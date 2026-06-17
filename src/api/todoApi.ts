import { Todo } from '../types/todo.types';

/**
 * Warstwa integracji z API. Korzystamy z publicznego mocka JSONPlaceholder,
 * który obsługuje realne żądania sieciowe GET / POST / PUT / DELETE bez
 * potrzeby stawiania własnego backendu (idealne pod publiczne wdrożenie).
 *
 * JSONPlaceholder nie utrwala danych po stronie serwera, dlatego po udanej
 * odpowiedzi sieciowej aktualizujemy też stan lokalny (optymistycznie).
 */
const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

interface RawTodo {
  id: number;
  title: string;
  completed: boolean;
}

function mapTodo(raw: RawTodo): Todo {
  return {
    id: String(raw.id),
    title: raw.title,
    completed: raw.completed,
    createdAt: new Date().toISOString(),
  };
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Błąd serwera (HTTP ${res.status}). Spróbuj ponownie.`);
  }
  return res.json() as Promise<T>;
}

export const todoApi = {
  /** GET — pobranie listy zadań. */
  async list(): Promise<Todo[]> {
    const data = await request<RawTodo[]>(`${BASE_URL}?_limit=8`);
    return data.map(mapTodo);
  },

  /** POST — utworzenie nowego zadania. */
  async create(title: string): Promise<Todo> {
    const data = await request<RawTodo>(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ title, completed: false, userId: 1 }),
    });
    // JSONPlaceholder zwraca id=201 dla każdego POST — generujemy własne, unikalne.
    return { ...mapTodo(data), id: crypto.randomUUID(), title };
  },

  /** PUT — aktualizacja statusu zadania. */
  async update(todo: Todo): Promise<Todo> {
    // Zadania utworzone lokalnie nie istnieją na serwerze mocka — pomijamy sieć.
    const numericId = Number(todo.id);
    if (!Number.isInteger(numericId) || numericId > 200) return todo;
    await request<RawTodo>(`${BASE_URL}/${numericId}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: numericId,
        title: todo.title,
        completed: todo.completed,
        userId: 1,
      }),
    });
    return todo;
  },

  /** DELETE — usunięcie zadania. */
  async remove(id: string): Promise<void> {
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId > 200) return;
    await request<unknown>(`${BASE_URL}/${numericId}`, { method: 'DELETE' });
  },
};
