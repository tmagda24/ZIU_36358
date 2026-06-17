import { useMemo, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Alert,
  Button,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTodoContext } from '../context/TodoContext';
import { useNotifications } from '../context/NotificationsContext';
import { FilterType, Todo } from '../types/todo.types';
import AddTodoForm from '../components/tasks/AddTodoForm';
import FilterBar from '../components/tasks/FilterBar';
import TaskList from '../components/tasks/TaskList';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface Feedback {
  message: string;
  severity: 'success' | 'error' | 'info';
}

export default function TasksPage() {
  const { state, fetchTodos, addTodo, toggleTodo, deleteTodo } = useTodoContext();
  const { notify } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');
  const [toDelete, setToDelete] = useState<Todo | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Wyświetlamy błędy sieciowe pojawiające się podczas mutacji (toggle/delete/add).
  useEffect(() => {
    if (state.error && state.status !== 'error') {
      setFeedback({ message: state.error, severity: 'error' });
    }
  }, [state.error, state.status]);

  const counts = useMemo(
    () => ({
      all: state.todos.length,
      active: state.todos.filter((t) => !t.completed).length,
      completed: state.todos.filter((t) => t.completed).length,
    }),
    [state.todos]
  );

  const filteredTodos = useMemo(
    () =>
      state.todos.filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      }),
    [state.todos, filter]
  );

  const handleAdd = async (title: string) => {
    await addTodo(title);
    notify('added', `Dodano zadanie: „${title}”.`);
    setFeedback({ message: 'Dodano nowe zadanie.', severity: 'success' });
  };

  const handleToggle = (id: string) => {
    const target = state.todos.find((t) => t.id === id);
    toggleTodo(id);
    // Powiadamiamy tylko o oznaczeniu zadania jako ukończone.
    if (target && !target.completed) {
      notify('completed', `Ukończono zadanie: „${target.title}”.`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    const title = toDelete.title;
    setToDelete(null);
    await deleteTodo(toDelete.id);
    notify('deleted', `Usunięto zadanie: „${title}”.`);
    setFeedback({ message: `Usunięto zadanie: „${title}”.`, severity: 'info' });
  };

  const isLoading = state.status === 'loading';
  const isError = state.status === 'error';

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Twoje zadania
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Dodawaj, oznaczaj i usuwaj zadania. Dane pobierane są z API.
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <AddTodoForm onAdd={handleAdd} />
          <FilterBar activeFilter={filter} onFilterChange={setFilter} counts={counts} />
        </Stack>
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, py: 8 }} role="status" aria-live="polite">
          <CircularProgress />
          <Typography color="text.secondary">Ładowanie zadań…</Typography>
        </Box>
      )}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={() => fetchTodos()}>
              Spróbuj ponownie
            </Button>
          }
        >
          {state.error}
        </Alert>
      )}

      {!isLoading && !isError && (
        <TaskList todos={filteredTodos} onToggle={handleToggle} onDelete={setToDelete} />
      )}

      <DeleteConfirmationModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={toDelete?.title ?? ''}
      />

      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert onClose={() => setFeedback(null)} severity={feedback.severity} variant="filled" sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
}
