import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

/**
 * Wspólne ustawienia typografii i kształtów. Rozmiary używają clamp(),
 * dzięki czemu skalują się płynnie między breakpointami (responsive design).
 */
const sharedOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: 'clamp(1.6rem, 6vw, 3.25rem)', lineHeight: 1.15, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: 1.25 },
    h4: { fontWeight: 700, fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)' },
    h5: { fontWeight: 700, fontSize: 'clamp(1.15rem, 3vw, 1.4rem)' },
    h6: { fontWeight: 600, fontSize: 'clamp(1.05rem, 2vw, 1.2rem)' },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
};

/**
 * Kolory dobrane tak, aby spełniać kontrast WCAG AA (>= 4.5:1) dla tekstu.
 * Primary #2563EB na bieli daje ~4.6:1 (tekst na przyciskach contained).
 */
export function buildTheme(mode: ThemeMode): Theme {
  const isDark = mode === 'dark';
  // Akcent dla tekstu/linków/przycisków tekstowych. Na ciemnym tle #2563EB
  // nie spełnia kontrastu 4.5:1, dlatego używamy jaśniejszego błękitu.
  const accent = isDark ? '#93C5FD' : '#2563EB';

  return createTheme({
    ...sharedOptions,
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        light: '#3B82F6',
        dark: '#1D4ED8',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#A78BFA' : '#7C3AED',
        contrastText: '#FFFFFF',
      },
      success: { main: isDark ? '#34D399' : '#15803D' },
      warning: { main: isDark ? '#FBBF24' : '#B45309' },
      error: { main: isDark ? '#F87171' : '#DC2626' },
      background: {
        default: isDark ? '#0F172A' : '#F1F5F9',
        paper: isDark ? '#1E293B' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F8FAFC' : '#0F172A',
        // Oba warianty przechodzą test kontrastu 4.5:1 na swoim tle.
        secondary: isDark ? '#CBD5E1' : '#475569',
      },
      divider: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark ? 'none' : '0 1px 3px rgba(15,23,42,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            borderRadius: 16,
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10, paddingLeft: 20, paddingRight: 20 },
          textPrimary: { color: accent },
          outlinedPrimary: {
            color: accent,
            borderColor: isDark ? 'rgba(147,197,253,0.5)' : undefined,
            '&:hover': { borderColor: accent },
          },
        },
      },
      MuiLink: {
        styleOverrides: { root: { color: accent } },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCssBaseline: {
        styleOverrides: {
          // Widoczny fokus dla nawigacji klawiaturą (WCAG 2.4.7).
          'a:focus-visible, button:focus-visible, [tabindex]:focus-visible, .MuiButtonBase-root:focus-visible': {
            outline: '3px solid #3B82F6',
            outlineOffset: '2px',
          },
        },
      },
    },
  });
}

export default buildTheme('dark');
