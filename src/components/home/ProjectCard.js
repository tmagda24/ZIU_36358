import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const MotionCard = motion(Card);
export default function ProjectCard({ project }) {
    const navigate = useNavigate();
    return (_jsxs(MotionCard, { whileHover: { y: -6 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, sx: { display: 'flex', flexDirection: 'column', height: '100%' }, children: [_jsx(CardMedia, { component: "img", image: project.image, alt: "", sx: { aspectRatio: '16 / 9', objectFit: 'cover' } }), _jsxs(CardContent, { sx: { flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }, children: [_jsx(Typography, { variant: "h5", component: "h3", sx: { fontWeight: 700, mb: 1 }, children: project.title }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 3 }, children: project.description }), _jsx(Box, { sx: { mt: 'auto' }, children: _jsx(Button, { variant: "contained", onClick: () => navigate('/zadania'), "aria-label": `Zobacz zadania dla projektu: ${project.title}`, children: "Zobacz zadania" }) })] })] }));
}
