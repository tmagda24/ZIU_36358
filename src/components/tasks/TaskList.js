import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, IconButton, Chip, Paper, Typography, Box, } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AnimatePresence, motion } from 'framer-motion';
const MotionListItem = motion(ListItem);
export default function TaskList({ todos, onToggle, onDelete }) {
    if (todos.length === 0) {
        return (_jsx(Box, { sx: { textAlign: 'center', py: 6 }, children: _jsx(Typography, { color: "text.secondary", children: "Brak zada\u0144 w tym widoku." }) }));
    }
    return (_jsx(Paper, { variant: "outlined", sx: { overflow: 'hidden' }, children: _jsx(List, { disablePadding: true, "aria-label": "Lista zada\u0144", children: _jsx(AnimatePresence, { initial: false, children: todos.map((todo) => (_jsxs(MotionListItem, { layout: true, initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.2 }, divider: true, secondaryAction: _jsx(IconButton, { edge: "end", color: "error", onClick: () => onDelete(todo), "aria-label": `Usuń zadanie: ${todo.title}`, children: _jsx(DeleteOutlineIcon, {}) }), children: [_jsx(ListItemIcon, { sx: { minWidth: 44 }, children: _jsx(Checkbox, { edge: "start", checked: todo.completed, onChange: () => onToggle(todo.id), inputProps: { 'aria-label': `Oznacz jako ukończone: ${todo.title}` } }) }), _jsx(ListItemText, { primary: todo.title, sx: {
                                '& .MuiListItemText-primary': {
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    color: todo.completed ? 'text.secondary' : 'text.primary',
                                },
                            } }), todo.completed && _jsx(Chip, { label: "Uko\u0144czone", size: "small", color: "success", sx: { mr: 1 } })] }, todo.id))) }) }) }));
}
