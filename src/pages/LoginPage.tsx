import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { loginSchema, LoginData } from '../schemas/auth.schema';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../api/authApi';

interface LocationState {
  from?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as LocationState | null)?.from ?? '/profil';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginData) => {
    setStatus('loading');
    setServerError(null);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Nie udało się zalogować.');
      setStatus('idle');
    }
  };

  const fillDemo = () => {
    setValue('email', DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue('password', DEMO_CREDENTIALS.password, { shouldValidate: true });
  };

  const isLoading = status === 'loading';

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
          Zaloguj się
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Wprowadź dane logowania, aby uzyskać dostęp do swoich zadań.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <TextField
              label="E-mail"
              id="email"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email ? <span role="alert">{errors.email.message}</span> : ' '}
              inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.email }}
              {...register('email')}
            />
            <TextField
              label="Hasło"
              id="password"
              type="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password ? <span role="alert">{errors.password.message}</span> : ' '}
              inputProps={{ 'aria-required': 'true', 'aria-invalid': !!errors.password }}
              {...register('password')}
            />

            {serverError && (
              <Alert severity="error" role="alert">
                {serverError}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              aria-busy={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>

            <Button variant="outlined" onClick={fillDemo} disabled={isLoading}>
              Użyj konta demo
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" align="center">
          Nie masz jeszcze konta?{' '}
          <Link component={RouterLink} to="/rejestracja" fontWeight={700}>
            Zarejestruj się
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
