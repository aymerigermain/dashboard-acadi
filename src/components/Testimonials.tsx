import {
  Box,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import type { DashboardStats } from '../types';

interface TestimonialsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ stats, loading }) => {
  if (!stats?.columnY || stats.columnY.length === 0) {
    return null;
  }

  const testimonials = stats.columnY.filter(testimonial => 
    testimonial && testimonial.trim().length > 0
  );

  if (testimonials.length === 0) {
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
            overflow: 'hidden',
            width: '100%',
            height: '280px',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              width: '50px',
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
              zIndex: 2,
              pointerEvents: 'none',
            },
            '&::before': {
              left: 0,
            },
            '&::after': {
              right: 0,
              background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              animation: 'scroll 80s linear infinite',
              alignItems: 'center',
              height: '100%',
              '@keyframes scroll': {
                '0%': {
                  transform: 'translateX(50%)',
                },
                '100%': {
                  transform: `translateX(-${testimonials.length * 420}px)`,
                },
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  minWidth: '400px',
                  maxWidth: '400px',
                  p: 3,
                  height: '220px',
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
                    top: 8,
                    left: 12,
                    fontSize: '2rem',
                    color: '#0496FF',
                    opacity: 0.3,
                    fontFamily: 'serif',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'text.primary',
                    fontStyle: 'italic',
                    textAlign: 'left',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 8,
                    WebkitBoxOrient: 'vertical',
                    pl: 2,
                    textOverflow: 'ellipsis',
                  }}
                >
                  {testimonial}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''} • 
            Les avis défilent automatiquement
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};