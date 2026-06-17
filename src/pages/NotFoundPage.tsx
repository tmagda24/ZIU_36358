import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2" component="h1" sx={{ fontWeight: 800 }}>
          404
        </Typography>
        <Typography color="text.secondary">Nie znaleziono strony, której szukasz.</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Wróć na stronę główną
        </Button>
      </Stack>
    </Container>
  );
}
