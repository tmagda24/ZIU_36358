import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNotifications, NotificationType } from '../../context/NotificationsContext';

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

const typeIcon: Record<NotificationType, JSX.Element> = {
  completed: <CheckCircleIcon color="success" />,
  deleted: <DeleteOutlineIcon color="error" />,
  added: <AddCircleOutlineIcon color="primary" />,
  info: <InfoOutlinedIcon color="action" />,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationsDialog({ open, onClose }: NotificationsDialogProps) {
  const { notifications, preferences, setPreferences, markAllRead, clearAll } = useNotifications();

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="notif-dialog-title">
      <DialogTitle id="notif-dialog-title" sx={{ fontWeight: 700 }}>
        Powiadomienia
      </DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Preferencje
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={preferences.added} onChange={() => togglePref('added')} />}
            label="Powiadom o dodaniu zadania"
          />
          <FormControlLabel
            control={<Switch checked={preferences.completed} onChange={() => togglePref('completed')} />}
            label="Powiadom o ukończeniu zadania"
          />
          <FormControlLabel
            control={<Switch checked={preferences.deleted} onChange={() => togglePref('deleted')} />}
            label="Powiadom o usunięciu zadania"
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Ostatnie powiadomienia
          </Typography>
          <Chip size="small" label={notifications.length} />
        </Box>

        {notifications.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            Brak powiadomień. Wykonaj akcję na zadaniach, aby się tu pojawiły.
          </Typography>
        ) : (
          <List dense sx={{ maxHeight: 280, overflowY: 'auto' }} aria-label="Lista powiadomień">
            {notifications.map((n) => (
              <ListItem key={n.id} sx={{ bgcolor: n.read ? 'transparent' : 'action.hover', borderRadius: 1, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{typeIcon[n.type]}</ListItemIcon>
                <ListItemText primary={n.message} secondary={formatDate(n.createdAt)} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Button onClick={markAllRead} size="small" color="inherit" disabled={notifications.length === 0}>
            Oznacz jako przeczytane
          </Button>
          <Button onClick={clearAll} size="small" color="error" disabled={notifications.length === 0}>
            Wyczyść
          </Button>
        </Stack>
        <Button onClick={onClose} variant="contained">
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
}
