import {
  Box,
  Typography,
  Paper,
  Container,
  IconButton,
} from '@mui/material';
import { FormatQuote, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import type { DashboardStats } from '../types';

interface TestimonialsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ stats }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = stats?.columnY?.filter(testimonial =>
    testimonial && testimonial.trim().length > 0
  ) || [];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!stats?.columnY || testimonials.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FormatQuote sx={{ color: '#0496FF' }} />
          Témoignages
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            minHeight: '280px',
          }}
        >
          {/* Bouton précédent */}
          <IconButton
            onClick={handlePrevious}
            disabled={testimonials.length <= 1}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'white',
              border: '2px solid #0496FF',
              color: '#0496FF',
              '&:hover': {
                bgcolor: '#0496FF',
                color: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(4, 150, 255, 0.2)',
              '&:disabled': {
                border: '2px solid #e2e8f0',
                color: '#cbd5e1',
                bgcolor: 'white',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          {/* Témoignage actuel */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              maxWidth: '700px',
              p: 4,
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #0496FF',
              borderRadius: 2,
              position: 'relative',
              '&::before': {
                content: '"\\201C"',
                position: 'absolute',
                top: 12,
                left: 16,
                fontSize: '3rem',
                color: '#0496FF',
                opacity: 0.3,
                fontFamily: 'serif',
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'text.primary',
                fontStyle: 'italic',
                textAlign: 'left',
                pl: 3,
              }}
            >
              {testimonials[currentIndex]}
            </Typography>
          </Paper>

          {/* Bouton suivant */}
          <IconButton
            onClick={handleNext}
            disabled={testimonials.length <= 1}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'white',
              border: '2px solid #0496FF',
              color: '#0496FF',
              '&:hover': {
                bgcolor: '#0496FF',
                color: 'white',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(4, 150, 255, 0.2)',
              '&:disabled': {
                border: '2px solid #e2e8f0',
                color: '#cbd5e1',
                bgcolor: 'white',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Indicateurs de pagination */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: currentIndex === index ? '#0496FF' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: currentIndex === index ? '#0496FF' : '#94a3b8',
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {currentIndex + 1} / {testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};