import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#3B82F6', 
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#161622', 
      paper: '#1F1F2E',   
    },
    text: {
      primary: '#FFFFFF',
      // POPRAWKA WCAG (KONTRAST): Rozjaśniony szary, żeby przejść test 4.5:1
      secondary: '#D1D5DB', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 3rem)', lineHeight: 1.2 }, 
    h4: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: 'clamp(1.5rem, 4vw, 2.125rem)' },
    h5: { fontWeight: 600, fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' },
    h6: { fontWeight: 600, fontSize: 'clamp(1.125rem, 2vw, 1.25rem)' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 16 }, 
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1F1F2E', 
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F1F2E', 
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, paddingLeft: 20, paddingRight: 20 },
      },
    },
  },
});

export default muiTheme;