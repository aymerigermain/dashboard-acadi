import {
  Box,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';
import type { DashboardStats } from '../types';

interface TestimonialsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ stats }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [manualPosition, setManualPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startPosition = useRef(0);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = stats?.columnY?.filter(testimonial => 
    testimonial && testimonial.trim().length > 0
  ) || [];

  const totalWidth = testimonials.length * 520;

  const resetPauseTimeout = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      // Ne remet pas à 0 pour éviter de recommencer au début
    }, 3000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsPaused(true);
      
      const sensitivity = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const containerWidth = container.offsetWidth;
      const maxLeft = -(totalWidth - containerWidth + 100); // +100 pour voir le dernier témoignage
      const maxRight = containerWidth * 0.2; // Permet de voir le début
      
      const newPosition = Math.max(
        maxLeft,
        Math.min(maxRight, manualPosition - sensitivity * 2)
      );
      setManualPosition(newPosition);
      resetPauseTimeout();
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startPosition.current = manualPosition;
      setIsPaused(true);
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - startX.current;
      const containerWidth = container.offsetWidth;
      const maxLeft = -(totalWidth - containerWidth + 100);
      const maxRight = containerWidth * 0.2;
      
      const newPosition = Math.max(
        maxLeft,
        Math.min(maxRight, startPosition.current + deltaX)
      );
      setManualPosition(newPosition);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
      resetPauseTimeout();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.touches[0].clientX;
      startPosition.current = manualPosition;
      setIsPaused(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      const deltaX = e.touches[0].clientX - startX.current;
      const containerWidth = container.offsetWidth;
      const maxLeft = -(totalWidth - containerWidth + 100);
      const maxRight = containerWidth * 0.2;
      
      const newPosition = Math.max(
        maxLeft,
        Math.min(maxRight, startPosition.current + deltaX)
      );
      setManualPosition(newPosition);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      resetPauseTimeout();
    };

    const handleMouseEnter = () => {
      setIsPaused(true);
    };

    const handleMouseLeave = () => {
      if (!isDragging.current) {
        setIsPaused(false);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [manualPosition, totalWidth]);

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
          ref={containerRef}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '280px',
            cursor: 'grab',
            userSelect: 'none',
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
            ref={scrollRef}
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              height: '100%',
              ...(isPaused 
                ? {
                    transform: `translateX(${manualPosition}px)`,
                    transition: 'transform 0.2s ease-out',
                  }
                : {
                    animation: 'scroll 80s linear infinite',
                    '@keyframes scroll': {
                      '0%': {
                        transform: 'translateX(50%)',
                      },
                      '100%': {
                        transform: `translateX(-${totalWidth}px)`,
                      },
                    },
                  }
              ),
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  minWidth: '500px',
                  maxWidth: '500px',
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
            {isPaused ? 'Défilement en pause' : 'Les avis défilent automatiquement'} • 
            Faites défiler avec la souris ou le doigt
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};