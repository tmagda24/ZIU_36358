import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectCard, { Project } from '../components/home/ProjectCard';

const projects: Project[] = [
  {
    id: 'firmowe',
    title: 'Projekty firmowe',
    description: 'Zarządzanie zespołem i budżetem',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'zakupy',
    title: 'Lista zakupów',
    description: 'Mleko, pieczywo, rzeczy na grilla',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'domowe',
    title: 'Zadania domowe',
    description: 'Zadanie z matematyki i polskiego',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
  },
];

const MotionStack = motion(Stack);

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 9 } }}>
      <MotionStack
        spacing={3}
        alignItems="center"
        textAlign="center"
        sx={{ maxWidth: 820, mx: 'auto', mb: { xs: 7, md: 10 } }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h1" component="h1" sx={{ overflowWrap: 'break-word', hyphens: 'auto' }}>
          Zarządzaj swoimi zadaniami jak profesjonalista
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 640 }}>
          Nasza aplikacja ToDo pomoże Ci zorganizować każdy dzień, śledzić postępy
          i zwiększyć produktywność całego zespołu.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/zadania')} sx={{ px: 4, py: 1.25 }}>
          Rozpocznij teraz
        </Button>
      </MotionStack>

      <Box component="section" id="projekty" aria-labelledby="projects-heading" sx={{ scrollMarginTop: 96 }}>
        <Typography id="projects-heading" variant="h3" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
          Twoje projekty
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
