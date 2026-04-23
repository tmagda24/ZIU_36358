import { Box, Card, CardContent, Typography, Button, CardMedia } from '@mui/material';

const projects = [
  {
    title: 'Projekty firmowe',
    desc: 'Zarządzanie zespołem i budżetem',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500' 
  },
  {
    title: 'Lista zakupów',
    desc: 'Mleko, pieczywo, rzeczy na grilla',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500'
  },
  {
    title: 'Zadania domowe',
    desc: 'Zadanie z matematyki i polskiego',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500'
  }
];

export default function ProjectCards() {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'clamp(1rem, 3vw, 1.5rem)',
      mb: 6
    }}>
      {projects.map((project, index) => (
        <Card key={index} sx={{ 
          bgcolor: 'background.paper', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-4px)' }
        }}>
          <CardMedia
            component="img"
            image={project.img}
            alt={`Okładka projektu ${project.title}`}
            sx={{
              aspectRatio: '16/9',
              objectFit: 'cover'
            }}
          />
          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            {/* POPRAWKA WCAG (NAGŁÓWKI): wymuszenie użycia HTMLowego tagu <h2> zamiast domyślnego <h6> */}
            <Typography variant="h6" component="h2" fontWeight="700" sx={{ mb: 1 }}>
              {project.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {project.desc}
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                borderRadius: '8px', 
                textTransform: 'none',
                fontWeight: '600'
              }}
            >
              Zobacz zadania
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}