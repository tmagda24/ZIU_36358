import { useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { getInitials } from '../../schemas/auth.schema';

interface NavItem {
  label: string;
  to: string;
  scrollTo?: string;
  protected?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Projekty', to: '/', scrollTo: 'projekty' },
  { label: 'Zadania', to: '/zadania', protected: true },
  { label: 'Profil', to: '/profil', protected: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const toggleDrawer = () => setMobileOpen((v) => !v);

  const openNotifications = () => navigate('/profil', { state: { openPanel: 'notifications' } });

  const visibleNavItems = navItems.filter((item) => !item.protected || isAuthenticated);

  const handleNav = (item: NavItem, closeDrawer = false) => {
    navigate(item.to);
    if (item.scrollTo) {
      window.setTimeout(() => {
        document.getElementById(item.scrollTo!)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
    if (closeDrawer) toggleDrawer();
  };

  const handleLogout = (closeDrawer = false) => {
    logout();
    if (closeDrawer) toggleDrawer();
    navigate('/');
  };

  return (
    <AppBar position="sticky" component="header" color="default" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 5 } }}>
          <Box
            component={RouterNavLink}
            to="/"
            aria-label="TaskFlow — strona główna"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              aria-hidden
              sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: 'action.selected', fontSize: '0.8rem', fontWeight: 700 }}
            >
              TaskFlow
            </Box>
            <Typography component="span" variant="h6" sx={{ fontWeight: 800 }}>
              ToDo List
            </Typography>
          </Box>

          <Box component="nav" aria-label="Nawigacja główna" sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {visibleNavItems.map((item) =>
              item.scrollTo ? (
                <Button key={item.label} color="inherit" onClick={() => handleNav(item)} sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={item.label}
                  component={RouterNavLink}
                  to={item.to}
                  end={item.to === '/'}
                  color="inherit"
                  sx={({ palette }) => ({ fontWeight: 600, color: 'text.primary', '&.active': { color: palette.primary.light } })}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isAuthenticated && user ? (
            <>
              <Tooltip title="Powiadomienia">
                <IconButton onClick={openNotifications} aria-label={`Powiadomienia${unreadCount ? `, nieprzeczytane: ${unreadCount}` : ''}`}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 600 }}>
                {user.name}
              </Typography>
              <IconButton onClick={() => navigate('/profil')} aria-label={`Przejdź do profilu — ${user.name}`} sx={{ p: 0.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }}>
                  {getInitials(user.name)}
                </Avatar>
              </IconButton>
              <Tooltip title="Wyloguj się">
                <IconButton onClick={() => handleLogout()} aria-label="Wyloguj się" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                variant="text"
                color="inherit"
                onClick={() => navigate('/logowanie')}
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }}
              >
                Zaloguj się
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/rejestracja')}
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }}
              >
                Zarejestruj się
              </Button>
            </>
          )}

          <IconButton
            onClick={toggleDrawer}
            aria-label={mobileOpen ? 'Zamknij menu nawigacyjne' : 'Otwórz menu nawigacyjne'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Drawer
        id="mobile-nav"
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{ display: { md: 'none' } }}
        PaperProps={{ sx: { width: 260, bgcolor: 'background.paper' } }}
      >
        <Box sx={{ p: 2 }} role="presentation">
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            TaskFlow
          </Typography>
          {isAuthenticated && user && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Zalogowano jako {user.name}
            </Typography>
          )}
          <Divider sx={{ mb: 1 }} />
          <List component="nav" aria-label="Nawigacja mobilna">
            {visibleNavItems.map((item) =>
              item.scrollTo ? (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton onClick={() => handleNav(item, true)}>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItemButton>
                </ListItem>
              ) : (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    component={RouterNavLink}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={toggleDrawer}
                    sx={{ '&.active': { color: 'primary.light' } }}
                  >
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItemButton>
                </ListItem>
              )
            )}

            <Divider sx={{ my: 1 }} />

            {isAuthenticated ? (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleLogout(true)}>
                  <ListItemText primary="Wyloguj się" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { toggleDrawer(); navigate('/logowanie'); }}>
                    <ListItemText primary="Zaloguj się" primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { toggleDrawer(); navigate('/rejestracja'); }}>
                    <ListItemText primary="Zarejestruj się" primaryTypographyProps={{ fontWeight: 700, color: 'primary.light' }} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
