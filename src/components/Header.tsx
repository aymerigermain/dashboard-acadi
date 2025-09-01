import {
  Box,
  Typography,
  Paper,
  Grid,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EuroSymbol,
  People,
  Refresh,
  PictureAsPdf,
  Star,
  OpenInNew,
  Launch,
} from '@mui/icons-material';
import type { DashboardStats } from '../types';
import { formatCurrency, formatDateLong } from '../utils/dateUtils';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderTop: `3px solid ${color}`,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
        borderColor: color,
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: `${color}10`,
        color: color,
        mb: 2,
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ 
        fontWeight: 600, 
        mb: 1,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {title}
    </Typography>
    <Typography
      variant="h4"
      component="div"
      sx={{ 
        fontWeight: 700, 
        color: 'text.primary',
        fontSize: '1.75rem',
        lineHeight: 1.2,
      }}
    >
      {value}
    </Typography>
  </Paper>
);

const SatisfactionKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderTop: '3px solid #f59e0b',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
        borderColor: '#f59e0b',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: '#f59e0b10',
        color: '#f59e0b',
        mb: 2,
      }}
    >
      <Star />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ 
          fontWeight: 600, 
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Satisfaction
      </Typography>
      <Tooltip title="Voir les réponses">
        <IconButton
          size="small"
          onClick={() => window.open('https://docs.google.com/forms/d/1UnarmlIx_MUiA6faJGORUpxDIAunnf9glugXt1aa08E/edit#responses', '_blank')}
          sx={{ 
            color: '#f59e0b', 
            p: 0.5,
            '&:hover': { bgcolor: '#f59e0b10' }
          }}
        >
          <OpenInNew sx={{ fontSize: '0.8rem' }} />
        </IconButton>
      </Tooltip>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
      <Typography
        variant="h4"
        component="div"
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          fontSize: '1.75rem',
          lineHeight: 1.2,
        }}
      >
        {stats ? `${stats.averageRating}/10` : '---'}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.7rem', ml: 0.5 }}
      >
        ({stats ? `${stats.totalReviews} avis` : '---'})
      </Typography>
    </Box>
  </Paper>
);

const DeductionsKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderTop: '3px solid #ef4444',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
        borderColor: '#ef4444',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: '#ef444410',
        color: '#ef4444',
        mb: 2,
      }}
    >
      <EuroSymbol />
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ 
        fontWeight: 600, 
        mb: 1,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      Déductions
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        variant="h4"
        component="div"
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          fontSize: '1.75rem',
          lineHeight: 1.2,
        }}
      >
        {stats ? formatCurrency(stats.totalRefunds + stats.totalFees) : '---'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          Remboursements: {stats ? formatCurrency(stats.totalRefunds) : '---'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
          Frais Stripe: {stats ? formatCurrency(stats.totalFees) : '---'}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const NetRevenueKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderTop: '3px solid #1e40af',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
        borderColor: '#1e40af',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: '#1e40af10',
        color: '#1e40af',
        mb: 2,
      }}
    >
      <EuroSymbol />
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ 
          fontWeight: 600, 
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        CA Net
      </Typography>
      <Tooltip title="Voir Stripe Dashboard">
        <IconButton
          size="small"
          onClick={() => window.open('https://dashboard.stripe.com/dashboard', '_blank')}
          sx={{ 
            color: '#1e40af', 
            p: 0.5,
            '&:hover': { bgcolor: '#1e40af10' }
          }}
        >
          <OpenInNew sx={{ fontSize: '0.8rem' }} />
        </IconButton>
      </Tooltip>
    </Box>
    <Typography
      variant="h4"
      component="div"
      sx={{ 
        fontWeight: 700, 
        color: 'text.primary',
        fontSize: '1.75rem',
        lineHeight: 1.2,
      }}
    >
      {stats ? formatCurrency(stats.netRevenue) : '---'}
    </Typography>
  </Paper>
);

const WeeklyStatsKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: '100%',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderTop: '3px solid #64748b',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
        borderColor: '#64748b',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: '#64748b10',
        color: '#64748b',
        mb: 2,
      }}
    >
      <People />
    </Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ 
        fontWeight: 600, 
        mb: 1,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      Performance Semaine
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        variant="h4"
        component="div"
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          fontSize: '1.75rem',
          lineHeight: 1.2,
        }}
      >
        {stats ? formatCurrency(stats.currentWeekGrossRevenue) : '---'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          Nouveaux clients: {stats ? stats.currentWeekSales.toString() : '---'}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

interface HeaderProps {
  stats: DashboardStats | null;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: Date | null;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  loading,
  onRefresh,
  lastUpdated,
  onExport,
}) => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderBottom: '1px solid #e2e8f0',
        pb: 4 
      }}
    >
      <Container maxWidth="xl">
        {/* Title and refresh button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 3, sm: 0 },
            mb: 4,
            pt: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
            <Box
              component="img"
              src="/acadi-logo.png"
              alt="ACADI Logo"
              sx={{
                height: { xs: 48, sm: 64 },
                width: 'auto',
              }}
            />
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#0496FF',
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                Tableau de Bord - Formation Stratégie
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Suivi des performances de vente en temps réel
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          }}>
            {lastUpdated && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Dernière MAJ: {formatDateLong(lastUpdated)}
              </Typography>
            )}
            <Tooltip title="Accéder à la plateforme Teachizy">
              <IconButton
                onClick={() => window.open('https://app.teachizy.fr/', '_blank')}
                sx={{ 
                  bgcolor: '#0496FF', 
                  color: 'white', 
                  '&:hover': { bgcolor: '#0374CC' },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                }}
              >
                <Launch sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exporter PDF">
              <IconButton
                onClick={onExport}
                disabled={loading || !stats}
                sx={{ 
                  bgcolor: '#0496FF', 
                  color: 'white', 
                  '&:hover': { bgcolor: '#0374CC' },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                }}
              >
                <PictureAsPdf sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualiser les données">
              <IconButton
                onClick={onRefresh}
                disabled={loading}
                sx={{ 
                  bgcolor: '#0496FF', 
                  color: 'white', 
                  '&:hover': { bgcolor: '#0374CC' },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                }}
              >
                <Refresh
                  sx={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* KPI Cards - Une seule ligne de 6 */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={2}>
            <KPICard
              title="CA Brut"
              value={stats ? formatCurrency(stats.grossRevenue) : '---'}
              icon={<EuroSymbol />}
              color="#10b981"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} lg={2}>
            <DeductionsKPICard stats={stats} />
          </Grid>

          <Grid item xs={12} sm={6} lg={2}>
            <NetRevenueKPICard stats={stats} />
          </Grid>

          <Grid item xs={12} sm={6} lg={2}>
            <SatisfactionKPICard stats={stats} />
          </Grid>

          <Grid item xs={12} sm={6} lg={2}>
            <KPICard
              title="Nombre Total de Clients"
              value={stats ? stats.totalCustomers.toString() : '---'}
              icon={<People />}
              color="#8b5cf6"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={2}>
            <WeeklyStatsKPICard stats={stats} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};