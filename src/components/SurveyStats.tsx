import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import {
  Business,
  Work,
  Groups,
  Campaign,
} from '@mui/icons-material';
import type { DashboardStats } from '../types';

interface SurveyStatsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

const StatsCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  data: string[];
  loading?: boolean;
}> = ({ title, icon, color, data, loading }) => {
  // Count occurrences
  const counts = data.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalResponses = data.length;

  // Sort by count descending and calculate percentages
  const sortedEntries = Object.entries(counts)
    .map(([value, count]) => [value, count, Math.round((count / totalResponses) * 100)] as [string, number, number])
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5); // Top 5

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${color}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 1.5,
            backgroundColor: `${color}15`,
            color: color,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1rem',
          }}
        >
          {title}
        </Typography>
      </Box>

      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Chargement...
        </Typography>
      ) : data.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucune donnée
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sortedEntries.map(([value, count, percentage], index) => (
            <Box key={value} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.85rem',
                  flex: 1,
                  mr: 1,
                  fontWeight: index === 0 ? 600 : 400, // Bold for most frequent
                }}
              >
                {value}
              </Typography>
              <Chip
                label={`${percentage}%`}
                size="small"
                sx={{
                  backgroundColor: `${color}20`,
                  color: color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  minWidth: 40,
                  height: 24,
                }}
              />
            </Box>
          ))}
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="caption" color="text.secondary">
              Total: {data.length} réponses
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export const SurveyStats: React.FC<SurveyStatsProps> = ({ stats, loading }) => {
  if (!stats && !loading) return null;

  return (
    <Box sx={{ mb: 4 }}>
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
        Profil des Participants
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            title="Ancienneté Professionnelle"
            icon={<Work />}
            color="#0496FF"
            data={stats?.columnE || []}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            title="Secteur d'Activité"
            icon={<Business />}
            color="#10b981"
            data={stats?.columnF || []}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            title="Taille Entreprise"
            icon={<Groups />}
            color="#8b5cf6"
            data={stats?.columnG || []}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            title="Canal d'Acquisition"
            icon={<Campaign />}
            color="#f59e0b"
            data={stats?.columnAD || []}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};