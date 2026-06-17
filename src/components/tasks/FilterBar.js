import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
const filters = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'active', label: 'Aktywne' },
    { value: 'completed', label: 'Ukończone' },
];
export default function FilterBar({ activeFilter, onFilterChange, counts }) {
    return (_jsx(ToggleButtonGroup, { value: activeFilter, exclusive: true, onChange: (_, value) => value && onFilterChange(value), "aria-label": "Filtruj zadania", size: "small", color: "primary", sx: { maxWidth: '100%', overflowX: 'auto' }, children: filters.map((f) => (_jsxs(ToggleButton, { value: f.value, sx: { fontWeight: 600, px: 2 }, children: [f.label, " (", counts[f.value], ")"] }, f.value))) }));
}
