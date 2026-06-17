import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
const skipLinkSx = {
    position: 'absolute',
    left: 16,
    top: -64,
    zIndex: 2000,
    px: 2.5,
    py: 1.25,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderRadius: 2,
    fontWeight: 700,
    textDecoration: 'none',
    transition: 'top 0.2s ease',
    '&:focus': { top: 16 },
};
export default function Layout() {
    const location = useLocation();
    return (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }, children: [_jsx(Box, { component: "a", href: "#main-content", sx: skipLinkSx, children: "Przejd\u017A do g\u0142\u00F3wnej tre\u015Bci" }), _jsx(Header, {}), _jsx(Box, { component: "main", id: "main-content", tabIndex: -1, sx: { flexGrow: 1, outline: 'none', display: 'flex', flexDirection: 'column' }, children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.28, ease: 'easeOut' }, style: { flexGrow: 1, display: 'flex', flexDirection: 'column' }, children: _jsx(Outlet, {}) }, location.pathname) }) }), _jsx(Footer, {})] }));
}
