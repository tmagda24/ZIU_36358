import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppHeaderProps {
  handleDrawerToggle: () => void;
  onOpenRegister?: () => void;
}

export default function AppHeader({ handleDrawerToggle, onOpenRegister }: AppHeaderProps) {
  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'background.paper', 
        color: 'text.primary', 
        boxShadow: 'none', 
        borderBottom: '1px solid rgba(255,255,255,0.05)' 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* POPRAWKA WCAG (NAGŁÓWKI): Zmiana na component="div", aby logo nie tworzyło <H6> przed <H1> */}
          <Typography component="div" variant="h6" sx={{ fontWeight: 800, mr: 6, color: 'primary.main', lineHeight: 1.2 }}>
            TaskFlow<br/>
            <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 600 }}>
              ToDo List
            </Typography>
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {/* POPRAWKA WCAG (KONTRAST): Zwiększenie opacity do 0.9 dla lepszej czytelności */}
            <Button color="inherit" sx={{ fontWeight: 600, opacity: 0.9 }}>Dashboard</Button>
            <Button color="inherit" sx={{ fontWeight: 600 }}>Projekty</Button>
            <Button color="inherit" sx={{ fontWeight: 600, opacity: 0.9 }}>Zadania</Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {onOpenRegister && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onOpenRegister}
              sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
            >
              Zarejestruj się
            </Button>
          )}

          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', ml: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Jan Kowalski</Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>JK</Avatar>
          
          {/* POPRAWKA WCAG (ETYKIETY): Dodano aria-label do ikony bez tekstu */}
          <IconButton 
            color="inherit" 
            onClick={handleDrawerToggle} 
            aria-label="Otwórz menu nawigacyjne"
            sx={{ display: { md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}