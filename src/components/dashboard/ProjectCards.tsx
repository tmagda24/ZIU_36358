import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CardMedia, TextField } from '@mui/material';

const allProjects = [
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
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(allProjects);

  // Symulacja filtrowania
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltered(allProjects.filter(p => p.title.toLowerCase().includes(query.toLowerCase())));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // 2. KRYTERIUM: SEMANTYCZNY HTML (<section>)
  return (
    <Box component="section" aria-labelledby="projects-heading" sx={{ mb: 6 }}>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'flex-end' }, mb: 4, gap: 2 }}>
        <Typography variant="h4" component="h2" id="projects-heading" fontWeight="700">
          Twoje projekty
        </Typography>

        <Box sx={{ minWidth: '300px' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Szukaj projektu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputProps={{ 'aria-label': 'Wyszukaj projekt z listy' }}
          />
          {/* 4. KRYTERIUM: ARIA LIVE REGION */}
          {/* aria-live="polite" informuje czytnik ekranu o wynikach, gdy użytkownik skończy pisać */}
          <Typography 
            aria-live="polite" 
            role="status" 
            variant="body2" 
            sx={{ mt: 1, color: 'text.secondary', fontWeight: 600 }}
          >
            {query 
              ? `Znaleziono projektów: ${filtered.length}.` 
              : `Wyświetlanie wszystkich ${allProjects.length} projektów.`}
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(1rem, 3vw, 1.5rem)',
      }}>
        {filtered.map((project, index) => (
          <Card key={index} component="article" sx={{ 
            bgcolor: 'background.paper', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardMedia
              component="img"
              image={project.img}
              alt="" // Puste alt, gdy obrazek jest czysto dekoracyjny i dubluje tytuł
              sx={{ aspectRatio: '16/9', objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h6" component="h3" fontWeight="700" sx={{ mb: 1 }}>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {project.desc}
              </Typography>
              <Button variant="contained" fullWidth aria-label={`Zobacz zadania dla projektu ${project.title}`} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: '600' }}>
                Zobacz zadania
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}