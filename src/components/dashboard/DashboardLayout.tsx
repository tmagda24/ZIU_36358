import { useState } from 'react';
import { Box, Typography, Button, Container, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import AppHeader from './AppHeader';
import ProjectCards from './ProjectCards';
import { RegistrationModal } from '../registration/RegistrationModal';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false); // Stan otwarcia rejestracji

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Przekazujemy funkcję otwierającą do nagłówka */}
      <AppHeader 
        handleDrawerToggle={handleDrawerToggle} 
        onOpenRegister={() => setRegisterOpen(true)} 
      />

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: 'background.paper' },
        }}
      >
        <List sx={{ pt: 2 }}>
          {/* Przycisk rejestracji w menu mobilnym */}
          <ListItemButton onClick={() => { setRegisterOpen(true); setMobileOpen(false); }}>
            <ListItemText primary="Zarejestruj się" sx={{ color: 'primary.main', fontWeight: 'bold' }} />
          </ListItemButton>
          <ListItemButton onClick={handleDrawerToggle}><ListItemText primary="Dashboard" /></ListItemButton>
          <ListItemButton onClick={handleDrawerToggle}><ListItemText primary="Projekty" /></ListItemButton>
          <ListItemButton onClick={handleDrawerToggle}><ListItemText primary="Zadania" /></ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          
          <Box sx={{ mb: 8, maxWidth: '800px' }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
              Zarządzaj swoimi zadaniami jak profesjonalista
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
              Nasza aplikacja ToDo pomoże Ci zorganizować każdy dzień, śledzić postępy i zwiększyć produktywność całego zespołu.
            </Typography>
            
            {/* GŁÓWNY PRZYCISK REJESTRACJI (HERO) */}
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => setRegisterOpen(true)}
              sx={{ px: 4, py: 1.5, borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700 }}
            >
              Rozpocznij teraz (Rejestracja)
            </Button>
          </Box>

          <ProjectCards />

        </Container>
      </Box>

      {/* MODAL REJESTRACJI */}
      <RegistrationModal 
        open={registerOpen} 
        onClose={() => setRegisterOpen(false)} 
      />
    </Box>
  );
}