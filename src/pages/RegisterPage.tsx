import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { registrationSchema, RegistrationData } from '../schemas/registration.schema';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const onSubmit = async (data: RegistrationData) => {
    setSubmitState('loading');
    setServerError(null);
    try {
      // Utworzenie konta i automatyczne zalogowanie (mock auth + localStorage).
      await registerUser({ name: data.name, email: data.email, password: data.password });
      setSubmitState('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.';
      if (message.toLowerCase().includes('e-mail')) {
        setError('email', { type: 'server', message });
        setSubmitState('idle');
      } else {
        setServerError(message);
        setSubmitState('error');
      }
    }
  };

  const isLoading = submitState === 'loading';

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', flexGrow: 1 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, width: '100%' }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
          Zarejestruj się
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Wypełnij poniższe dane, aby utworzyć konto w naszej aplikacji ToDo.
        </Typography>

        {submitState === 'success' ? (
          <Alert severity="success" role="status" sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>Konto utworzone — jesteś zalogowany!</Typography>
            <Box sx={{ mt: 1.5, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={() => navigate('/zadania')}>
                Przejdź do zadań
              </Button>
              <Button variant="outlined" onClick={() => navigate('/profil')}>
                Mój profil
              </Button>
            </Box>
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Imię"
                id="name"
                error={!!errors.name}
                helperText={errors.name ? <span role="alert">{errors.name.message}</span> : ' '}
                inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.name }}
                {...register('name')}
              />
              <TextField
                label="E-mail"
                id="email"
                type="email"
                error={!!errors.email}
                helperText={errors.email ? <span role="alert">{errors.email.message}</span> : ' '}
                inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.email }}
                {...register('email')}
              />
              <TextField
                label="Hasło"
                id="password"
                type="password"
                error={!!errors.password}
                helperText={
                  errors.password ? (
                    <span role="alert">{errors.password.message}</span>
                  ) : (
                    'Minimum 8 znaków, wielka litera i cyfra.'
                  )
                }
                inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.password }}
                {...register('password')}
              />
              <TextField
                label="Potwierdź hasło"
                id="confirmPassword"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? <span role="alert">{errors.confirmPassword.message}</span> : ' '}
                inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.confirmPassword }}
                {...register('confirmPassword')}
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="terms"
                      {...register('terms')}
                      inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.terms }}
                    />
                  }
                  label="Akceptuję regulamin i politykę prywatności"
                />
                {errors.terms && (
                  <FormHelperText error role="alert">
                    {errors.terms.message}
                  </FormHelperText>
                )}
              </Box>

              {serverError && (
                <Alert severity="error" role="alert">
                  {serverError}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                  {isLoading ? 'Rejestruję...' : 'Zarejestruj się'}
                </Button>
                <Button variant="text" size="large" onClick={() => navigate('/')} disabled={isLoading}>
                  Anuluj
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
