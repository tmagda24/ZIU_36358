import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  Stack,
  Button,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useThemeMode } from '../context/ThemeModeContext';
import { useTodoContext } from '../context/TodoContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import { getInitials } from '../schemas/auth.schema';
import StatCard from '../components/profile/StatCard';
import AccountSettingsDialog from '../components/profile/AccountSettingsDialog';
import NotificationsDialog from '../components/profile/NotificationsDialog';
import PrivacyDialog from '../components/profile/PrivacyDialog';

type DialogKey = 'account' | 'notifications' | 'privacy' | null;

interface ProfileLocationState {
  openPanel?: 'notifications';
}

export default function ProfilePage() {
  const { mode, toggleMode } = useThemeMode();
  const { state } = useTodoContext();
  const { user, logout } = useAuth();
  const { unreadCount, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDialog, setOpenDialog] = useState<DialogKey>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const displayName = user?.name ?? 'Użytkownik';

  // Otwarcie panelu powiadomień po wejściu z dzwonka w nagłówku.
  useEffect(() => {
    const navState = location.state as ProfileLocationState | null;
    if (navState?.openPanel === 'notifications') {
      setOpenDialog('notifications');
      markAllRead();
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, markAllRead]);

  const openNotifications = () => {
    setOpenDialog('notifications');
    markAllRead();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const accountLinks = [
    { key: 'account' as const, label: 'Ustawienia konta', icon: <SettingsIcon />, onClick: () => setOpenDialog('account') },
    { key: 'notifications' as const, label: 'Powiadomienia', icon: <NotificationsIcon />, onClick: openNotifications, badge: unreadCount },
    { key: 'privacy' as const, label: 'Prywatność', icon: <LockIcon />, onClick: () => setOpenDialog('privacy') },
  ];

  const stats = useMemo(() => {
    const completed = state.todos.filter((t) => t.completed).length;
    const active = state.todos.filter((t) => !t.completed).length;
    const total = state.todos.length;
    const effectiveness = total ? Math.round((completed / total) * 100) : 0;
    return [
      { value: completed, label: 'Ukończone zadania', actionLabel: 'Historia' },
      { value: 5, label: 'Aktywne projekty', actionLabel: 'Zarządzaj' },
      { value: `${effectiveness}%`, label: 'Skuteczność', actionLabel: 'Raport' },
      { value: active, label: 'Zadania na dzisiaj', actionLabel: 'Rozpocznij' },
      { value: 7, label: 'Dni z rzędu', actionLabel: 'Osiągnięcia' },
      { value: 3, label: 'Zaległe zadania', actionLabel: 'Sprawdź' },
    ];
  }, [state.todos]);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
          label="Włącz tryb ciemny"
          labelPlacement="start"
          sx={{ color: 'text.secondary' }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
          gap: { xs: 4, md: 6 },
          alignItems: 'start',
        }}
      >
        <Box component="aside" aria-label="Profil użytkownika" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Stack spacing={1.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
            <Avatar sx={{ width: 110, height: 110, bgcolor: 'action.selected', color: 'text.primary', fontSize: '2rem', fontWeight: 700 }}>
              {getInitials(displayName)}
            </Avatar>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              {displayName}
            </Typography>
            {user?.email && (
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            )}
            <Chip label="Administrator" size="small" />
          </Stack>

          <List component="nav" aria-label="Ustawienia konta" sx={{ mt: 3 }}>
            {accountLinks.map((link) => (
              <ListItem key={link.key} disablePadding>
                <ListItemButton sx={{ borderRadius: 2 }} onClick={link.onClick}>
                  <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                    {link.badge ? (
                      <Badge badgeContent={link.badge} color="error">
                        {link.icon}
                      </Badge>
                    ) : (
                      link.icon
                    )}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Button variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ mt: 2 }}>
            Wyloguj się
          </Button>
        </Box>

        <Box
          component="section"
          aria-label="Statystyki"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              actionLabel={stat.actionLabel}
              onAction={() => navigate('/zadania')}
            />
          ))}
        </Box>
      </Box>

      <AccountSettingsDialog
        open={openDialog === 'account'}
        onClose={() => setOpenDialog(null)}
        onSuccess={(msg) => setFeedback(msg)}
      />
      <NotificationsDialog open={openDialog === 'notifications'} onClose={() => setOpenDialog(null)} />
      <PrivacyDialog open={openDialog === 'privacy'} onClose={() => setOpenDialog(null)} onSuccess={(msg) => setFeedback(msg)} />

      <Snackbar
        open={!!feedback}
        autoHideDuration={3500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert onClose={() => setFeedback(null)} severity="success" variant="filled" sx={{ width: '100%' }}>
            {feedback}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
}
