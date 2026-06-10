import Plausible from 'plausible-tracker';

/**
 * LABORATORIUM 12 — ZADANIE A
 * Ścieżka B: Plausible (privacy-first, zalecana).
 *
 * Dlaczego Plausible (a nie GA4)?
 *  - lekki skrypt (<1 kB) — minimalny wpływ na Core Web Vitals,
 *  - brak ciasteczek i fingerprintingu — zgodny z RODO „out-of-the-box”,
 *    dlatego NIE wymaga banera cookie consent na polskiej stronie,
 *  - dane są wysyłane przez navigator.sendBeacon / fetch (nieblokująco),
 *    więc skrypt nie jest render-blocking (brak zewnętrznego <script> w <head>).
 *
 * ZASADA MINIMALIZACJI DANYCH (art. 5 ust. 1 lit. c RODO):
 * zbieramy wyłącznie dane behawioralne niezbędne do oceny UX
 * (które ekrany są odwiedzane, czy użytkownik wykonuje akcję konwersji,
 * czy porzuca wyszukiwanie). NIE zbieramy żadnych danych osobowych —
 * w szczególności NIE wysyłamy treści wpisanej w pole wyszukiwania
 * (jedynie zanonimizowaną długość zapytania).
 */
const plausible = Plausible({
  // W produkcji należy podać realną domenę aplikacji, np. 'movie-browser.pl'.
  domain: 'localhost',
  // Pozwala raportować zdarzenia podczas pracy na localhost (testy w labie).
  trackLocalhost: true,
});

/**
 * Surowe API Plausible — używane przez hook śledzenia odsłon.
 * Zob. usePageTracking — wywołujemy trackPageview przy każdej zmianie trasy
 * React Routera, dzięki czemu raportowane są WSZYSTKIE trasy projektu
 * (/ oraz /favorites).
 */
export const trackPageview = plausible.trackPageview;

/**
 * Lista dozwolonych zdarzeń niestandardowych (kontrola spójności nazewnictwa).
 * Każde zdarzenie ma udokumentowany cel i zakres zbieranych danych (RODO).
 */
export type AnalyticsEvent =
  // CTA / konwersja: dodanie lub usunięcie filmu z ulubionych.
  // Dane: tylko etykieta akcji ('add'/'remove') i miejsce kliknięcia.
  | 'CTA Click'
  // „Submit” formularza wyszukiwania: użytkownik wpisał frazę i uzyskał wyniki.
  // Dane: TYLKO długość zapytania (bucket) i liczba wyników — bez treści frazy.
  | 'Search Submit'
  // Porzucenie „formularza” wyszukiwania: użytkownik zaczął pisać,
  // ale opuścił widok / wyczyścił pole bez otwarcia żadnego wyniku.
  // Dane: tylko etap porzucenia.
  | 'Form Abandon';

type EventProps = Record<string, string | number | boolean>;

/**
 * Bezpieczny wrapper na zdarzenia niestandardowe.
 * Centralizuje wysyłkę, ułatwia audyt zbieranych danych (rozliczalność RODO).
 */
export function trackEvent(name: AnalyticsEvent, props?: EventProps): void {
  plausible.trackEvent(name, props ? { props } : undefined);
}
