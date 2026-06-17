import { useState, FormEvent } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
    } catch {
      /* błąd jest obsługiwany globalnie w kontekście */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { sm: 'flex-start' } }}
    >
      <TextField
        fullWidth
        label="Nowe zadanie"
        placeholder="Wpisz treść zadania..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError(null);
        }}
        error={!!error}
        helperText={error ? <span role="alert">{error}</span> : ' '}
        inputProps={{ 'aria-label': 'Treść nowego zadania', maxLength: 140 }}
        size="small"
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
        disabled={submitting}
        sx={{ mt: { sm: 0.25 }, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
      >
        {submitting ? 'Dodaję...' : 'Dodaj'}
      </Button>
    </Box>
  );
}
