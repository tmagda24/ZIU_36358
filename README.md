# TaskFlow — ToDo List

Aplikacja webowa do zarządzania zadaniami i projektami, zbudowana w React + Material UI.
Projekt zrealizowany w ramach przedmiotu ZIU (projekt indywidualny, Lab 15).

> 🔗 **Demo na żywo:** https://tmagda24.github.io/ZIU_36358/
>
> 📦 **Repozytorium:** https://github.com/tmagda24/ZIU_36358

---

## ✨ Opis projektu

TaskFlow to interfejs aplikacji typu **To-Do / Task Manager**. Użytkownik może:

- przeglądać stronę główną z prezentacją projektów,
- zarządzać listą zadań (dodawanie, oznaczanie jako ukończone, usuwanie) z danymi pobieranymi z API,
- założyć konto przez formularz rejestracji z pełną walidacją,
- przeglądać profil ze statystykami i przełączać motyw jasny/ciemny.

Aplikacja jest w pełni responsywna i zaprojektowana zgodnie z dołączonym projektem (Figma / hi-fi),
z naciskiem na dostępność (WCAG AA).

## 🖥️ Ekrany (routing)

| Ścieżka         | Widok            | Dostęp       | Opis                                                        |
| --------------- | ---------------- | ------------ | ----------------------------------------------------------- |
| `/`             | Strona główna    | publiczny    | Hero + karty projektów                                      |
| `/logowanie`    | Logowanie        | publiczny    | Formularz logowania (RHF + Zod) + konto demo                |
| `/rejestracja`  | Rejestracja      | publiczny    | Formularz rejestracji z walidacją; tworzy konto i loguje    |
| `/zadania`      | Zadania          | chroniony    | Menedżer zadań z integracją API (GET/POST/PUT/DELETE)       |
| `/profil`       | Profil           | chroniony    | Statystyki, tryb ciemny, ustawienia konta                   |
| `*`             | 404              | publiczny    | Strona błędu z powrotem do strony głównej                   |

### 🔐 Logowanie i ustawienia konta

- **System logowania** (Context API): rejestracja, logowanie, wylogowanie, trasy chronione
  (`ProtectedRoute`) z powrotem do żądanej strony po zalogowaniu. Sesja i konta są utrwalane
  w `localStorage` (mock — brak realnego backendu).
- **Konto demo:** `jan.kowalski@taskflow.pl` / `Demo1234` (przycisk „Użyj konta demo” na stronie logowania).
- **Ustawienia konta** (profil → „Ustawienia konta”): zmiana hasła z walidacją.
- **Powiadomienia** (profil → „Powiadomienia” lub dzwonek w nagłówku): preferencje oraz dziennik
  zdarzeń — dodanie, ukończenie i usunięcie zadania (z licznikiem nieprzeczytanych).
- **Prywatność** (profil → „Prywatność”): przełączniki widoczności profilu i danych oraz usunięcie konta.

## 🧰 Użyte technologie

- **React 18** + **TypeScript**
- **Vite** — bundler i dev server
- **Material UI (MUI 7)** — biblioteka komponentów UI + system motywów
- **React Router** — routing między widokami (HashRouter)
- **React Hook Form + Zod** — obsługa stanu formularza i walidacja
- **Framer Motion** — animacje przejść między widokami i mikrointerakcje
- **Context API + useReducer** — globalny stan (zadania, motyw)
- **JSONPlaceholder** — mock API dla operacji sieciowych

## 🚀 Uruchomienie lokalne

Wymagania: **Node.js 18+** oraz npm.

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/tmagda24/ZIU_36358.git
cd ZIU_36358

# 2. Zainstaluj zależności
npm install

# 3. Uruchom serwer deweloperski
npm run dev
# aplikacja: http://localhost:3000

# 4. Build produkcyjny
npm run build

# 5. Podgląd builda produkcyjnego
npm run preview
```

## ☁️ Wdrożenie

Projekt działa na dowolnym hostingu statycznych plików (wynik builda trafia do `dist/`):

- **GitHub Pages** — gotowy workflow w `.github/workflows/deploy.yml`
  (włącz Pages → Source: _GitHub Actions_; deploy uruchamia się po pushu na `main`).
- **Vercel** — konfiguracja w `vercel.json` (import repo → deploy).
- **Netlify** — konfiguracja w `netlify.toml`.

Dzięki `HashRouter` i `base: './'` routing działa poprawnie na każdym z tych hostingów
bez dodatkowej konfiguracji przekierowań serwera.

## ✅ Realizacja kryteriów projektu

- **Komponenty wielokrotnego użytku** — `ProjectCard`, `StatCard`, `TaskList`, `FilterBar`, `AddTodoForm`, layout (`Header`/`Footer`).
- **Routing** — 5 widoków (React Router).
- **Biblioteka UI** — Material UI + spójny motyw.
- **Responsive design** — układ siatkowy z breakpointami (`xs`/`sm`/`md`/`lg`) i płynną typografią `clamp()`.
- **Formularze i walidacja** — rejestracja (RHF + Zod), czytelne komunikaty błędów, stany formularza.
- **Dostępność (WCAG)** — semantyczny HTML, `aria-*`, skip link, widoczny fokus, kontrast AA, nawigacja klawiaturą.
  Audyt **axe-core** dla wszystkich tras: **0 błędów krytycznych/poważnych** (skrypt: `node scripts/a11y.mjs` przy działającym `npm run preview`).
- **State management** — Context API + useReducer; obsługa stanów `loading` · `success` · `error`.
- **Integracja z API** — GET + POST/PUT/DELETE (JSONPlaceholder) z widoczną obsługą błędów sieciowych.
- **Mikrointerakcje** — animacje przejść (Framer Motion), spinnery, snackbary z feedbackiem.
- **Deployment i dokumentacja** — konfiguracje wdrożeń + niniejszy README.

---

## 📝 Notatka UX

### Grupa docelowa / persona

**Anna, 29 lat — specjalistka ds. projektów.** Pracuje hybrydowo, żongluje wieloma zadaniami
prywatnymi i służbowymi. Korzysta z aplikacji zarówno na laptopie, jak i na telefonie w drodze.
Oczekuje: szybkiego dodawania zadań, czytelnego podglądu postępów oraz interfejsu, który nie
przytłacza i dobrze wygląda również w trybie ciemnym (pracuje wieczorami).

### Kluczowe decyzje projektowe

- **Domyślny tryb ciemny** z możliwością przełączenia na jasny — ogranicza zmęczenie wzroku
  podczas pracy wieczorem, a wybór jest zapamiętywany w `localStorage`.
- **Jeden, zwięzły formularz rejestracji** zamiast wielu kroków — szybsze założenie konta
  i mniejsze ryzyko porzucenia.
- **Optymistyczne aktualizacje** listy zadań — interfejs reaguje natychmiast, a w razie błędu
  sieci zmiana jest wycofywana z komunikatem.

### Odniesienie do heurystyk Nielsena

- **Widoczność stanu systemu** — spinnery podczas ładowania, snackbary po dodaniu/usunięciu zadania,
  liczniki w filtrach.
- **Zapobieganie błędom** — walidacja formularza w locie i modal potwierdzenia przed usunięciem zadania.
- **Dopasowanie systemu do świata rzeczywistego** — język polski, zrozumiałe etykiety i komunikaty.
- **Rozpoznawanie zamiast przypominania** — stała nawigacja, aktywne podświetlenie bieżącego widoku.
- **Pomoc w rozpoznawaniu i naprawie błędów** — czytelne komunikaty błędów z akcją „Spróbuj ponownie”.
