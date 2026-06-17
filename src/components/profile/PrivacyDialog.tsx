import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';

interface PrivacyDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface PrivacySettings {
  publicProfile: boolean;
  showActivity: boolean;
  analytics: boolean;
}

const DEFAULT_PRIVACY: PrivacySettings = {
  publicProfile: false,
  showActivity: true,
  analytics: false,
};

export default function PrivacyDialog({ open, onClose, onSuccess }: PrivacyDialogProps) {
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  const { clearAll } = useNotifications();
  const [settings, setSettings] = useLocalStorage<PrivacySettings>('taskflow-privacy', DEFAULT_PRIVACY);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggle = (key: keyof PrivacySettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    onSuccess('Zaktualizowano ustawienia prywatności.');
  };

  const handleClose = () => {
    if (deleting) return;
    setConfirmingDelete(false);
    onClose();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      clearAll();
      await deleteAccount();
      navigate('/');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth aria-labelledby="privacy-dialog-title">
      <DialogTitle id="privacy-dialog-title" sx={{ fontWeight: 700 }}>
        Prywatność
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Zarządzaj widocznością profilu i swoimi danymi.
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={settings.publicProfile} onChange={() => toggle('publicProfile')} />}
            label="Profil publiczny"
          />
          <FormControlLabel
            control={<Switch checked={settings.showActivity} onChange={() => toggle('showActivity')} />}
            label="Pokazuj moją aktywność innym użytkownikom"
          />
          <FormControlLabel
            control={<Switch checked={settings.analytics} onChange={() => toggle('analytics')} />}
            label="Zgoda na anonimowe dane analityczne"
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
          Strefa niebezpieczna
        </Typography>

        {confirmingDelete ? (
          <Alert
            severity="error"
            action={
              <Button
                color="error"
                variant="contained"
                size="small"
                onClick={handleDeleteAccount}
                disabled={deleting}
                startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : undefined}
              >
                Potwierdź
              </Button>
            }
          >
            Czy na pewno chcesz trwale usunąć konto? Tej operacji nie można cofnąć.
          </Alert>
        ) : (
          <Box>
            <Button color="error" variant="outlined" onClick={() => setConfirmingDelete(true)}>
              Usuń konto
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="contained" disabled={deleting}>
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
}
