import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Podaj aktualne hasło.'),
    newPassword: z
      .string()
      .min(8, 'Nowe hasło musi mieć co najmniej 8 znaków.')
      .regex(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną wielką literę.')
      .regex(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę.'),
    confirmPassword: z.string().min(1, 'Potwierdź nowe hasło.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hasła muszą być identyczne.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Nowe hasło musi różnić się od aktualnego.',
    path: ['newPassword'],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
