import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button, Avatar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Tooltip, Badge, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { getInitials } from '../../schemas/auth.schema';
const navItems = [
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
    const handleNav = (item, closeDrawer = false) => {
        navigate(item.to);
        if (item.scrollTo) {
            window.setTimeout(() => {
                document.getElementById(item.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
        }
        if (closeDrawer)
            toggleDrawer();
    };
    const handleLogout = (closeDrawer = false) => {
        logout();
        if (closeDrawer)
            toggleDrawer();
        navigate('/');
    };
    return (_jsxs(AppBar, { position: "sticky", component: "header", color: "default", sx: { bgcolor: 'background.paper' }, children: [_jsxs(Toolbar, { sx: { justifyContent: 'space-between', gap: 2 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 5 } }, children: [_jsxs(Box, { component: RouterNavLink, to: "/", "aria-label": "TaskFlow \u2014 strona g\u0142\u00F3wna", sx: { display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none', color: 'inherit' }, children: [_jsx(Box, { "aria-hidden": true, sx: { px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: 'action.selected', fontSize: '0.8rem', fontWeight: 700 }, children: "TaskFlow" }), _jsx(Typography, { component: "span", variant: "h6", sx: { fontWeight: 800 }, children: "ToDo List" })] }), _jsx(Box, { component: "nav", "aria-label": "Nawigacja g\u0142\u00F3wna", sx: { display: { xs: 'none', md: 'flex' }, gap: 1 }, children: visibleNavItems.map((item) => item.scrollTo ? (_jsx(Button, { color: "inherit", onClick: () => handleNav(item), sx: { fontWeight: 600, color: 'text.primary' }, children: item.label }, item.label)) : (_jsx(Button, { component: RouterNavLink, to: item.to, end: item.to === '/', color: "inherit", sx: ({ palette }) => ({ fontWeight: 600, color: 'text.primary', '&.active': { color: palette.primary.light } }), children: item.label }, item.label))) })] }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1.5 }, children: [isAuthenticated && user ? (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "Powiadomienia", children: _jsx(IconButton, { onClick: openNotifications, "aria-label": `Powiadomienia${unreadCount ? `, nieprzeczytane: ${unreadCount}` : ''}`, children: _jsx(Badge, { badgeContent: unreadCount, color: "error", children: _jsx(NotificationsIcon, {}) }) }) }), _jsx(Typography, { variant: "body2", sx: { display: { xs: 'none', md: 'block' }, fontWeight: 600 }, children: user.name }), _jsx(IconButton, { onClick: () => navigate('/profil'), "aria-label": `Przejdź do profilu — ${user.name}`, sx: { p: 0.5 }, children: _jsx(Avatar, { sx: { bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }, children: getInitials(user.name) }) }), _jsx(Tooltip, { title: "Wyloguj si\u0119", children: _jsx(IconButton, { onClick: () => handleLogout(), "aria-label": "Wyloguj si\u0119", sx: { display: { xs: 'none', sm: 'inline-flex' } }, children: _jsx(LogoutIcon, {}) }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "text", color: "inherit", onClick: () => navigate('/logowanie'), sx: { display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }, children: "Zaloguj si\u0119" }), _jsx(Button, { variant: "contained", onClick: () => navigate('/rejestracja'), sx: { display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }, children: "Zarejestruj si\u0119" })] })), _jsx(IconButton, { onClick: toggleDrawer, "aria-label": mobileOpen ? 'Zamknij menu nawigacyjne' : 'Otwórz menu nawigacyjne', "aria-expanded": mobileOpen, "aria-controls": "mobile-nav", sx: { display: { md: 'none' } }, children: _jsx(MenuIcon, {}) })] })] }), _jsx(Drawer, { id: "mobile-nav", anchor: "right", open: mobileOpen, onClose: toggleDrawer, sx: { display: { md: 'none' } }, PaperProps: { sx: { width: 260, bgcolor: 'background.paper' } }, children: _jsxs(Box, { sx: { p: 2 }, role: "presentation", children: [_jsx(Typography, { variant: "h6", sx: { fontWeight: 800, mb: 1 }, children: "TaskFlow" }), isAuthenticated && user && (_jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: ["Zalogowano jako ", user.name] })), _jsx(Divider, { sx: { mb: 1 } }), _jsxs(List, { component: "nav", "aria-label": "Nawigacja mobilna", children: [visibleNavItems.map((item) => item.scrollTo ? (_jsx(ListItem, { disablePadding: true, children: _jsx(ListItemButton, { onClick: () => handleNav(item, true), children: _jsx(ListItemText, { primary: item.label, primaryTypographyProps: { fontWeight: 600 } }) }) }, item.label)) : (_jsx(ListItem, { disablePadding: true, children: _jsx(ListItemButton, { component: RouterNavLink, to: item.to, end: item.to === '/', onClick: toggleDrawer, sx: { '&.active': { color: 'primary.light' } }, children: _jsx(ListItemText, { primary: item.label, primaryTypographyProps: { fontWeight: 600 } }) }) }, item.label))), _jsx(Divider, { sx: { my: 1 } }), isAuthenticated ? (_jsx(ListItem, { disablePadding: true, children: _jsx(ListItemButton, { onClick: () => handleLogout(true), children: _jsx(ListItemText, { primary: "Wyloguj si\u0119", primaryTypographyProps: { fontWeight: 700 } }) }) })) : (_jsxs(_Fragment, { children: [_jsx(ListItem, { disablePadding: true, children: _jsx(ListItemButton, { onClick: () => { toggleDrawer(); navigate('/logowanie'); }, children: _jsx(ListItemText, { primary: "Zaloguj si\u0119", primaryTypographyProps: { fontWeight: 600 } }) }) }), _jsx(ListItem, { disablePadding: true, children: _jsx(ListItemButton, { onClick: () => { toggleDrawer(); navigate('/rejestracja'); }, children: _jsx(ListItemText, { primary: "Zarejestruj si\u0119", primaryTypographyProps: { fontWeight: 700, color: 'primary.light' } }) }) })] }))] })] }) })] }));
}
