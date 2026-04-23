import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import { step1Schema, Step1Data } from '../../schemas/registration.schema';

interface Step1Props {
  defaultValues?: Partial<Step1Data>;
  onComplete: (data: Step1Data) => void;
  serverError?: string | null;
  onCancel: () => void;
}

export const Step1 = ({ defaultValues, onComplete, serverError, onCancel }: Step1Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      ...defaultValues,
    },
  });

  // WCAG: Focus management przy montowaniu kroku
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Obsługa błędu serwera przekazanego z formularza nadrzędnego
  useEffect(() => {
    if (serverError) {
      setError('email', { type: 'server', message: serverError });
    }
  }, [serverError, setError]);

  const passwordValue = watch('password') || '';
  
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: 'text.secondary' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score < 2) return { label: 'Słabe', color: 'error.main' };
    if (score === 2 || score === 3) return { label: 'Średnie', color: 'warning.main' };
    return { label: 'Silne', color: 'success.main' };
  };

  const strength = getPasswordStrength(passwordValue);

  return (
    <Box component="form" onSubmit={handleSubmit(onComplete)} noValidate>
      <Typography variant="h5" component="h2" mb={1} tabIndex={-1} ref={headingRef} fontWeight={700}>
        Krok 1: Dane osobowe
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Wypełnij poniższe dane, aby utworzyć konto w naszej aplikacji ToDo.
      </Typography>

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            label="Imię *"
            id="firstName"
            error={!!errors.firstName}
            helperText={errors.firstName ? <span id="firstName-err" role="alert">{errors.firstName.message}</span> : undefined}
            inputProps={{
              'aria-required': 'true',
              'aria-invalid': !!errors.firstName,
              'aria-describedby': errors.firstName ? 'firstName-err' : undefined,
            }}
            {...register('firstName')}
          />
          <TextField
            fullWidth
            label="Nazwisko *"
            id="lastName"
            error={!!errors.lastName}
            helperText={errors.lastName ? <span id="lastName-err" role="alert">{errors.lastName.message}</span> : undefined}
            inputProps={{
              'aria-required': 'true',
              'aria-invalid': !!errors.lastName,
              'aria-describedby': errors.lastName ? 'lastName-err' : undefined,
            }}
            {...register('lastName')}
          />
        </Box>

        <TextField
          fullWidth
          label="E-mail *"
          id="email"
          type="email"
          error={!!errors.email}
          helperText={errors.email ? <span id="email-err" role="alert">{errors.email.message}</span> : undefined}
          inputProps={{
            'aria-required': 'true',
            'aria-invalid': !!errors.email,
            'aria-describedby': errors.email ? 'email-err' : undefined,
          }}
          {...register('email')}
        />

        <Box>
          <TextField
            fullWidth
            label="Hasło *"
            id="password"
            type="password"
            error={!!errors.password}
            helperText={errors.password ? <span id="password-err" role="alert">{errors.password.message}</span> : undefined}
            inputProps={{
              'aria-required': 'true',
              'aria-invalid': !!errors.password,
              'aria-describedby': errors.password ? 'password-err' : 'pwd-hint',
            }}
            {...register('password')}
          />
          {passwordValue && (
            <Typography id="pwd-hint" aria-live="polite" variant="caption" sx={{ color: strength.color, mt: 0.5, display: 'block', ml: 2 }}>
              Siła hasła: {strength.label}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          label="Potwierdź hasło *"
          id="confirmPassword"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword ? <span id="confirm-err" role="alert">{errors.confirmPassword.message}</span> : undefined}
          inputProps={{
            'aria-required': 'true',
            'aria-invalid': !!errors.confirmPassword,
            'aria-describedby': errors.confirmPassword ? 'confirm-err' : undefined,
          }}
          {...register('confirmPassword')}
        />
      </Stack>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" type="submit" size="large">
          Dalej
        </Button>
        <Button variant="text" onClick={onCancel} size="large" sx={{ color: 'text.secondary' }}>
          Anuluj
        </Button>
      </Box>
    </Box>
  );
};