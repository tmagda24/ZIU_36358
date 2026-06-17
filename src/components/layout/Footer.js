import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Link, Typography } from '@mui/material';
const APP_VERSION = '1.0.0';
export default function Footer() {
    return (_jsx(Box, { component: "footer", sx: {
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            py: 2.5,
            mt: 'auto',
        }, children: _jsx(Container, { maxWidth: "lg", children: _jsxs(Box, { sx: {
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                }, children: [_jsxs(Box, { component: "nav", "aria-label": "Stopka", sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Link, { href: "#", color: "text.secondary", underline: "hover", children: "Regulamin" }), _jsx(Typography, { component: "span", color: "text.secondary", "aria-hidden": true, children: "|" }), _jsx(Link, { href: "#", color: "text.secondary", underline: "hover", children: "Polityka prywatno\u015Bci" })] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Wersja: ", APP_VERSION] })] }) }) }));
}
