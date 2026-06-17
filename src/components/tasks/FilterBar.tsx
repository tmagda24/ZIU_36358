import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FilterType } from '../../types/todo.types';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'active', label: 'Aktywne' },
  { value: 'completed', label: 'Ukończone' },
];

export default function FilterBar({ activeFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <ToggleButtonGroup
      value={activeFilter}
      exclusive
      onChange={(_, value: FilterType | null) => value && onFilterChange(value)}
      aria-label="Filtruj zadania"
      size="small"
      color="primary"
      sx={{ maxWidth: '100%', overflowX: 'auto' }}
    >
      {filters.map((f) => (
        <ToggleButton key={f.value} value={f.value} sx={{ fontWeight: 600, px: 2 }}>
          {f.label} ({counts[f.value]})
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
