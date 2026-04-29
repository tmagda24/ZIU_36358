import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppHeaderProps {
  mobileOpen: boolean; 
  handleDrawerToggle: () => void;
  onOpenRegister: () => void;
}

export default function AppHeader({ mobileOpen, handleDrawerToggle, onOpenRegister }: AppHeaderProps) {
  // 2. KRYTERIUM: SEMANTYCZNY HTML (<header> i banner)
  return (
    <AppBar 
      position="sticky" 
      component="header"
      role="banner"
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.primary', 
        boxShadow: 'none', 
        borderBottom: '1px solid rgba(255,255,255,0.05)' 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: 800, mr: 6, color: 'primary.main', lineHeight: 1.2 }}>
            TaskFlow<br/>
            <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 600 }}>
              ToDo List
            </Typography>
          </Typography>

          <Box component="nav" aria-label="Nawigacja główna" sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Button color="inherit" sx={{ fontWeight: 600, opacity: 0.9 }}>Dashboard</Button>
            <Button color="inherit" sx={{ fontWeight: 600 }}>Projekty</Button>
            <Button color="inherit" sx={{ fontWeight: 600, opacity: 0.9 }}>Zadania</Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onOpenRegister}
            aria-haspopup="dialog"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
          >
            Zarejestruj się
          </Button>

          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', ml: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Jan Kowalski</Typography>
          </Box>
          <Avatar aria-label="Profil użytkownika Jan Kowalski" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>JK</Avatar>
          
          {/* 3. KRYTERIUM: ATrybuty ARIA (informowanie czytnika, czy menu jest otwarte) */}
          <IconButton 
            color="inherit" 
            onClick={handleDrawerToggle} 
            aria-label={mobileOpen ? "Zamknij menu nawigacyjne" : "Otwórz menu nawigacyjne"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            sx={{ display: { md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}