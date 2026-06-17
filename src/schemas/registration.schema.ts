import { z } from 'zod';

export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Imię musi mieć co najmniej 2 znaki.')
      .max(60, 'Imię jest zbyt długie.'),
    email: z.string().min(1, 'Podaj adres e-mail.').email('Podaj poprawny adres e-mail.'),
    password: z
      .string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków.')
      .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną wielką literę.')
      .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę.'),
    confirmPassword: z.string().min(1, 'Potwierdź hasło.'),
    terms: z.boolean().refine((v) => v === true, {
      message: 'Musisz zaakceptować regulamin i politykę prywatności.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą być identyczne.',
    path: ['confirmPassword'],
  });

export type RegistrationData = z.infer<typeof registrationSchema>;
