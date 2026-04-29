import { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import AppHeader from './AppHeader';
import ProjectCards from './ProjectCards';
import StatsGrid from './StatsGrid';
import { AddTodoForm } from '../AddTodoForm';
import TodoList from '../TodoList';
import { FilterBar } from '../FilterBar';
import { useTodoContext } from '../../context/TodoContext';
import { FilterType } from '../../types/todo.types';
import { RegistrationModal } from '../registration/RegistrationModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal'; // Import nowego modala

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Stan dla modala usuwania
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [todoIdToDelete, setTodoIdToDelete] = useState<string | null>(null);

  const { state, dispatch } = useTodoContext();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleAddTask = (title: string) => {
    dispatch({ type: 'ADD', payload: title });
  };

  const handleToggleTask = (id: string) => {
    dispatch({ type: 'TOGGLE', payload: id });
  };

  // ZMIANA: Ta funkcja teraz tylko otwiera modal i zapisuje ID zadania
  const handleDeleteClick = (id: string) => {
    setTodoIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // NOWE: Ta funkcja wykonuje faktyczne usunięcie po potwierdzeniu
  const handleConfirmDelete = () => {
    if (todoIdToDelete) {
      dispatch({ type: 'DELETE', payload: todoIdToDelete }); //
      setDeleteModalOpen(false);
      setTodoIdToDelete(null);
    }
  };

  // Znajdujemy tytuł zadania do wyświetlenia w modalu
  const taskToDeleteTitle = state.todos.find(t => t.id === todoIdToDelete)?.title || "";

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Skip Link dla WCAG */}
      <a 
        href="#main-content" 
        style={{
          position: 'absolute', top: '-100px', left: '20px', zIndex: 10000,
          background: '#3B82F6', color: 'white', padding: '10px 20px',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', transition: 'top 0.3s'
        }}
        onFocus={(e) => e.currentTarget.style.top = '20px'}
        onBlur={(e) => e.currentTarget.style.top = '-100px'}
      >
        Przejdź do głównej treści
      </a>

      <AppHeader 
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle} 
        onOpenRegister={() => setRegisterOpen(true)} 
      />

      <Box component="main" id="main-content" tabIndex={-1} sx={{ flexGrow: 1, py: { xs: 4, md: 8 }, outline: 'none' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <StatsGrid />
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Box component="section">
                <Typography variant="h4" component="h2" fontWeight="700" sx={{ mb: 3 }}>
                  Twoje Zadania
                </Typography>
                
                <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
                  <AddTodoForm onAdd={handleAddTask} />
                  <Box sx={{ mt: 2 }}>
                    <FilterBar activeFilter={filter} onFilterChange={setFilter} />
                  </Box>
                </Paper>

                <TodoList 
                  todos={state.todos} 
                  filter={filter} 
                  onToggle={handleToggleTask} 
                  onDelete={handleDeleteClick} // Przekazujemy nową funkcję otwierającą modal
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <ProjectCards />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer i Modale */}
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
      
      {/* NOWY MODAL POTWIERDZENIA USUNIĘCIA */}
      <DeleteConfirmationModal 
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDeleteTitle}
      />
    </Box>
  );
}