import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import { changePasswordSchema, ChangePasswordData } from '../../schemas/account.schema';
import { useAuth } from '../../context/AuthContext';

interface AccountSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function AccountSettingsDialog({ open, onClose, onSuccess }: AccountSettingsDialogProps) {
  const { changePassword } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const handleClose = () => {
    if (status === 'loading') return;
    reset();
    setServerError(null);
    onClose();
  };

  const onSubmit = async (data: ChangePasswordData) => {
    setStatus('loading');
    setServerError(null);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      reset();
      onSuccess('Hasło zostało zmienione.');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nie udało się zmienić hasła.';
      if (message.toLowerCase().includes('aktualne hasło')) {
        setError('currentPassword', { type: 'server', message });
      } else {
        setServerError(message);
      }
    } finally {
      setStatus('idle');
    }
  };

  const isLoading = status === 'loading';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth aria-labelledby="account-dialog-title">
      <DialogTitle id="account-dialog-title" sx={{ fontWeight: 700 }}>
        Ustawienia konta
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Zmień hasło dostępu do swojego konta.
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              label="Aktualne hasło"
              type="password"
              autoComplete="current-password"
              error={!!errors.currentPassword}
              helperText={errors.currentPassword ? <span role="alert">{errors.currentPassword.message}</span> : ' '}
              inputProps={{ 'aria-required': 'true' }}
              {...register('currentPassword')}
            />
            <TextField
              label="Nowe hasło"
              type="password"
              autoComplete="new-password"
              error={!!errors.newPassword}
              helperText={
                errors.newPassword ? <span role="alert">{errors.newPassword.message}</span> : 'Min. 8 znaków, wielka litera i cyfra.'
              }
              inputProps={{ 'aria-required': 'true' }}
              {...register('newPassword')}
            />
            <TextField
              label="Potwierdź nowe hasło"
              type="password"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword ? <span role="alert">{errors.confirmPassword.message}</span> : ' '}
              inputProps={{ 'aria-required': 'true' }}
              {...register('confirmPassword')}
            />
            {serverError && (
              <Alert severity="error" role="alert">
                {serverError}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={isLoading}>
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            aria-busy={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isLoading ? 'Zapisywanie...' : 'Zmień hasło'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
