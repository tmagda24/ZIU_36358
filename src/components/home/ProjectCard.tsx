import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

const MotionCard = motion(Card);

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <MotionCard
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <CardMedia
        component="img"
        image={project.image}
        alt=""
        sx={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {project.description}
        </Typography>
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/zadania')}
            aria-label={`Zobacz zadania dla projektu: ${project.title}`}
          >
            Zobacz zadania
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
}
