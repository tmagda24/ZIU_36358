import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;
const BASE = process.env.BASE || 'http://localhost:4178';
const ROUTES = ['#/', '#/logowanie', '#/rejestracja', '#/zadania', '#/profil'];
const SESSION = JSON.stringify({ id: 'demo-user', name: 'Jan Kowalski', email: 'jan.kowalski@taskflow.pl' });
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=' + process.env.TEMP + '\\axe-chrome-' + Date.now(),
  'about:blank',
]);

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/json`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* retry */
    }
    await sleep(300);
  }
  throw new Error('Nie udało się połączyć z Chrome DevTools.');
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((resolve) => (ws.onopen = resolve));

let nextId = 1;
const pending = new Map();
const loadWaiters = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
  if (msg.method === 'Page.loadEventFired') {
    loadWaiters.splice(0).forEach((fn) => fn());
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = nextId++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const waitForLoad = () => new Promise((resolve) => loadWaiters.push(resolve));

await send('Page.enable');
await send('Runtime.enable');

// Wstrzykujemy sesję demo, aby audytować również trasy chronione.
{
  const loaded = waitForLoad();
  await send('Page.navigate', { url: `${BASE}/#/` });
  await Promise.race([loaded, sleep(5000)]);
  await send('Runtime.evaluate', {
    expression: `localStorage.setItem('taskflow-session', '${SESSION}')`,
  });
}

let totalCritical = 0;
for (const route of ROUTES) {
  const url = `${BASE}/${route}`;
  const loaded = waitForLoad();
  await send('Page.navigate', { url });
  await Promise.race([loaded, sleep(5000)]);
  await sleep(1800); // render React + animacje + fetch

  const expr = `${axeSource};
    (async () => {
      const r = await axe.run(document, { resultTypes: ['violations'] });
      return JSON.stringify(r.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })));
    })()`;
  const res = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  const violations = JSON.parse(res.result.value);
  const critical = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  totalCritical += critical.length;

  console.log(`\n=== ${route} ===`);
  if (violations.length === 0) {
    console.log('  ✓ Brak naruszeń axe-core.');
  } else {
    for (const v of violations) {
      console.log(`  [${v.impact}] ${v.id} — ${v.help} (elementy: ${v.nodes})`);
    }
  }
}

console.log(`\nPODSUMOWANIE: krytyczne/poważne naruszenia = ${totalCritical}`);
ws.close();
chrome.kill();
process.exit(0);
