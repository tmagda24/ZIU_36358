import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Chip,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AnimatePresence, motion } from 'framer-motion';
import { Todo } from '../../types/todo.types';

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (todo: Todo) => void;
}

const MotionListItem = motion(ListItem);

export default function TaskList({ todos, onToggle, onDelete }: TaskListProps) {
  if (todos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">Brak zadań w tym widoku.</Typography>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <List disablePadding aria-label="Lista zadań">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <MotionListItem
              key={todo.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              divider
              secondaryAction={
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => onDelete(todo)}
                  aria-label={`Usuń zadanie: ${todo.title}`}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: 44 }}>
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                  inputProps={{ 'aria-label': `Oznacz jako ukończone: ${todo.title}` }}
                />
              </ListItemIcon>
              <ListItemText
                primary={todo.title}
                sx={{
                  '& .MuiListItemText-primary': {
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.secondary' : 'text.primary',
                  },
                }}
              />
              {todo.completed && <Chip label="Ukończone" size="small" color="success" sx={{ mr: 1 }} />}
            </MotionListItem>
          ))}
        </AnimatePresence>
      </List>
    </Paper>
  );
}
