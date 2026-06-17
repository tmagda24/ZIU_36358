import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface StatCardProps {
  value: string | number;
  label: string;
  actionLabel: string;
  onAction?: () => void;
}

const MotionCard = motion(Card);

export default function StatCard({ value, label, actionLabel, onAction }: StatCardProps) {
  return (
    <MotionCard
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      sx={{ height: '100%' }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
        <Typography variant="h4" component="p" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
        <Typography color="text.secondary">{label}</Typography>
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Button size="small" variant="contained" onClick={onAction} aria-label={`${actionLabel} — ${label}`}>
            {actionLabel}
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
}
