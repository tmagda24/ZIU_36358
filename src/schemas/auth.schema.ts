import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Podaj adres e-mail.').email('Podaj poprawny adres e-mail.'),
  password: z.string().min(1, 'Podaj hasło.'),
});

export type LoginData = z.infer<typeof loginSchema>;

/** Inicjały użytkownika do awatara (np. „Jan Kowalski” → „JK”). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
