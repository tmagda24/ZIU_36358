/**
 * Mock systemu uwierzytelniania. Ponieważ aplikacja nie posiada własnego
 * backendu, konta użytkowników i sesja przechowywane są w localStorage,
 * a żądania symulują opóźnienie sieciowe (stany loading / success / error).
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

const USERS_KEY = 'taskflow-users';
const SESSION_KEY = 'taskflow-session';

const DEMO_USER: StoredUser = {
  id: 'demo-user',
  name: 'Jan Kowalski',
  email: 'jan.kowalski@taskflow.pl',
  password: 'Demo1234',
};

export const DEMO_CREDENTIALS = {
  email: DEMO_USER.email,
  password: DEMO_USER.password,
};

function delay(ms = 700): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = raw ? JSON.parse(raw) : [];
    // Zapewniamy istnienie konta demonstracyjnego.
    if (!users.some((u) => u.email === DEMO_USER.email)) {
      users.push(DEMO_USER);
      writeUsers(users);
    }
    return users;
  } catch {
    return [DEMO_USER];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(user: StoredUser): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

export const authApi = {
  /** Logowanie — weryfikacja danych względem zapisanych kont. */
  async login(email: string, password: string): Promise<AuthUser> {
    await delay();
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) {
      throw new Error('Nieprawidłowy e-mail lub hasło.');
    }
    const session = toAuthUser(found);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  /** Rejestracja — utworzenie nowego konta i zalogowanie. */
  async register(payload: RegisterPayload): Promise<AuthUser> {
    await delay();
    const users = readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === payload.email.trim().toLowerCase());
    if (exists) {
      throw new Error('Ten adres e-mail jest już zarejestrowany.');
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
    };
    users.push(newUser);
    writeUsers(users);
    const session = toAuthUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  /** Zmiana hasła — weryfikacja aktualnego hasła i zapis nowego. */
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    await delay();
    const users = readUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      throw new Error('Nie znaleziono konta.');
    }
    if (users[idx].password !== currentPassword) {
      throw new Error('Aktualne hasło jest nieprawidłowe.');
    }
    users[idx] = { ...users[idx], password: newPassword };
    writeUsers(users);
  },

  /** Usunięcie konta wraz z sesją. */
  async deleteAccount(email: string): Promise<void> {
    await delay();
    const users = readUsers().filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    writeUsers(users);
    localStorage.removeItem(SESSION_KEY);
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },
};
