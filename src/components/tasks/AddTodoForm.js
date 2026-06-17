import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
export default function AddTodoForm({ onAdd }) {
    const [text, setText] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) {
            setError('Treść zadania nie może być pusta.');
            return;
        }
        if (trimmed.length > 120) {
            setError('Zadanie może mieć maksymalnie 120 znaków.');
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            await onAdd(trimmed);
            setText('');
        }
        catch {
            /* błąd jest obsługiwany globalnie w kontekście */
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { sm: 'flex-start' } }, children: [_jsx(TextField, { fullWidth: true, label: "Nowe zadanie", placeholder: "Wpisz tre\u015B\u0107 zadania...", value: text, onChange: (e) => {
                    setText(e.target.value);
                    if (error)
                        setError(null);
                }, error: !!error, helperText: error ? _jsx("span", { role: "alert", children: error }) : ' ', inputProps: { 'aria-label': 'Treść nowego zadania', maxLength: 140 }, size: "small" }), _jsx(Button, { type: "submit", variant: "contained", startIcon: submitting ? _jsx(CircularProgress, { size: 18, color: "inherit" }) : _jsx(AddIcon, {}), disabled: submitting, sx: { mt: { sm: 0.25 }, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }, children: submitting ? 'Dodaję...' : 'Dodaj' })] }));
}
