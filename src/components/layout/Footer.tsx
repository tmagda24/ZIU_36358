import { Box, Container, Link, Typography } from '@mui/material';

const APP_VERSION = '1.0.0';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 2.5,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box component="nav" aria-label="Stopka" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link href="#" color="text.secondary" underline="hover">
              Regulamin
            </Link>
            <Typography component="span" color="text.secondary" aria-hidden>
              |
            </Typography>
            <Link href="#" color="text.secondary" underline="hover">
              Polityka prywatności
            </Link>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Wersja: {APP_VERSION}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
