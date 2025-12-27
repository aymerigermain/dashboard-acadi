import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Logout,
  ThumbUp,
  School,
} from '@mui/icons-material';
import type { DashboardStats } from '../types';
import { formatCurrency, formatCurrencyWithDecimals, formatDateLong } from '../utils/dateUtils';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  hoverValue?: string; // Valeur à afficher au hover (ex: avec centimes)
  subtitle?: string; // Texte additionnel sous la valeur
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color, hoverValue, subtitle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        cursor: hoverValue ? 'pointer' : 'default',
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
          mb: subtitle ? 0.5 : 0,
        }}
      >
        {isHovered && hoverValue ? hoverValue : value}
      </Typography>
      {subtitle && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.65rem' }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

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
        {stats ? `${stats.averageRating.toFixed(2)}/10` : '---'}
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

const DeductionsKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        cursor: 'pointer',
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
          {stats ? 
            (isHovered ? 
              formatCurrencyWithDecimals(stats.totalRefunds + stats.totalFees) : 
              formatCurrency(stats.totalRefunds + stats.totalFees)
            ) : '---'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            Remboursements: {stats ? 
              (isHovered ? formatCurrencyWithDecimals(stats.totalRefunds) : formatCurrency(stats.totalRefunds)) 
              : '---'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
            Frais Stripe: {stats ? 
              (isHovered ? formatCurrencyWithDecimals(stats.totalFees) : formatCurrency(stats.totalFees)) 
              : '---'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const NetRevenueKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        cursor: 'pointer',
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
        {stats ?
          (isHovered ? formatCurrencyWithDecimals(stats.netRevenue + (stats.externalRevenuesMetrics?.totalRevenue || 0)) : formatCurrency(stats.netRevenue + (stats.externalRevenuesMetrics?.totalRevenue || 0))) 
          : '---'}
      </Typography>
    </Paper>
  );
};

const NPSKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  // Fonction pour obtenir la couleur et le label selon le score NPS
  const getNPSInfo = (score: number) => {
    if (score >= 50) return { color: '#22c55e', bgColor: '#22c55e10', label: 'Excellent' };
    if (score >= 0) return { color: '#f59e0b', bgColor: '#f59e0b10', label: 'Bon' };
    return { color: '#ef4444', bgColor: '#ef444410', label: 'À améliorer' };
  };

  const npsScore = stats?.netPromoterScore ?? 0;
  const npsInfo = getNPSInfo(npsScore);
  const totalResponses = stats ? (stats.npsPromotors + stats.npsDetractors + stats.npsPassives) : 0;
  const promotors = stats?.npsPromotors ?? 0;
  const detractors = stats?.npsDetractors ?? 0;
  const passives = stats?.npsPassives ?? 0;

  // Calcul de l'angle pour la jauge (semi-cercle de -90° à +90°)
  const angle = Math.max(-90, Math.min(90, (npsScore / 100) * 90));

  // Tooltip explicatif
  const npsTooltip = `Net Promoter Score (NPS): ${npsScore}

Le NPS mesure la propension de vos clients à recommander votre formation.

Sur ${totalResponses} réponses:
• ${promotors} Promoteurs (notes 9-10): recommandent activement
• ${passives} Neutres (notes 7-8): satisfaits mais pas enthousiastes  
• ${detractors} Détracteurs (notes 0-6): risquent de nuire à votre réputation

Calcul: ((${promotors} - ${detractors}) / ${totalResponses}) × 100 = ${npsScore}

Interprétation:
• 50+ = Excellent
• 0-49 = Bon
• Négatif = À améliorer`;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${npsInfo.color}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
          borderColor: npsInfo.color,
        },
      }}
    >
      {/* Partie gauche - Info texte */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: npsInfo.bgColor,
            color: npsInfo.color,
            mb: 2,
          }}
        >
          <ThumbUp />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, width: '100%' }}>
          <Tooltip 
            title={<Box sx={{ whiteSpace: 'pre-line', p: 1, maxWidth: 350 }}>{npsTooltip}</Box>}
            placement="top"
            arrow
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                fontWeight: 600, 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'help',
                textDecoration: 'underline dotted',
              }}
            >
              Net Promoter Score
            </Typography>
          </Tooltip>
          <Tooltip title="Voir les réponses">
            <IconButton
              size="small"
              onClick={() => window.open('https://docs.google.com/forms/d/1UnarmlIx_MUiA6faJGORUpxDIAunnf9glugXt1aa08E/edit#responses', '_blank')}
              sx={{ 
                color: npsInfo.color, 
                p: 0.5,
                '&:hover': { bgcolor: npsInfo.bgColor }
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
            color: npsInfo.color,
            fontSize: '1.75rem',
            lineHeight: 1,
            mb: 0.5
          }}
        >
          {stats && stats.netPromoterScore !== undefined ? `${stats.netPromoterScore}` : '---'}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{ 
            fontSize: '0.65rem',
            fontWeight: 600,
            color: npsInfo.color,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            mb: 0.5,
          }}
        >
          {stats ? npsInfo.label : '---'}
        </Typography>
        
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.65rem' }}
        >
          ({totalResponses > 0 ? `${totalResponses} rép.` : '---'})
        </Typography>
      </Box>

      {/* Partie droite - Gauge */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80
      }}>
        <Box sx={{ position: 'relative', width: 70, height: 35 }}>
          <svg width="70" height="35" viewBox="0 0 70 35">
            {/* Arc de fond */}
            <path
              d="M 8 30 A 25 25 0 0 1 62 30"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Arc coloré selon le score */}
            <path
              d="M 8 30 A 25 25 0 0 1 62 30"
              fill="none"
              stroke={npsInfo.color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${Math.PI * 25} ${Math.PI * 25}`}
              strokeDashoffset={Math.PI * 25 * (1 - (npsScore + 100) / 200)}
              style={{
                transition: 'stroke-dashoffset 0.6s ease-in-out'
              }}
            />
            {/* Indicateur de position */}
            <circle
              cx={35 + 25 * Math.cos((angle * Math.PI) / 180 + Math.PI)}
              cy={30 + 25 * Math.sin((angle * Math.PI) / 180 + Math.PI)}
              r="2.5"
              fill={npsInfo.color}
            />
          </svg>
        </Box>
      </Box>
    </Paper>
  );
};

const WeeklyStatsKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        cursor: 'pointer',
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
        CA Brut Semaine
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
          {stats ? 
            (isHovered ? formatCurrencyWithDecimals(stats.currentWeekGrossRevenue) : formatCurrency(stats.currentWeekGrossRevenue)) 
            : '---'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            Nouveaux clients: {stats ? stats.currentWeekSales.toString() : '---'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const CompletionKPICard: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  // Calculer le pourcentage de complétion (nombre d'avis / nombre de licences total incluant achats externes)
  const totalLicences = stats ? (stats.totalCustomers + (stats.externalRevenuesMetrics?.totalLicenses || 0)) : 0;
  const completionRate = stats && totalLicences > 0
    ? (stats.totalReviews / totalLicences) * 100
    : 0;

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return '#22c55e'; // Vert - Très bon
    if (rate >= 60) return '#f59e0b'; // Orange - Bon
    if (rate >= 40) return '#ef4444'; // Rouge - Moyen
    return '#64748b'; // Gris - Faible
  };

  const color = getCompletionColor(completionRate);

  return (
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
        <School />
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
        Complétion Formation
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ 
            fontWeight: 700, 
            color: color,
            fontSize: '1.75rem',
            lineHeight: 1.2,
          }}
        >
          {stats ? `${completionRate.toFixed(0)}%` : '---'}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            {stats ? `${stats.totalReviews} avis sur ${totalLicences} licences` : '---'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

interface HeaderProps {
  stats: DashboardStats | null;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: Date | null;
  onExport: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  loading,
  onRefresh,
  lastUpdated,
  onExport,
  onLogout,
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
                Tableau de Bord
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Suivi des performances de vente en temps réel
                </Typography>
                {lastUpdated && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      fontStyle: 'italic',
                    }}
                  >
                    • Dernière MAJ: {formatDateLong(lastUpdated)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          }}>
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
            {onLogout && (
              <Tooltip title="Se déconnecter">
                <IconButton
                  onClick={onLogout}
                  sx={{ 
                    bgcolor: '#64748b', 
                    color: 'white', 
                    '&:hover': { 
                      bgcolor: '#475569',
                      transform: 'translateY(-1px)',
                    },
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                  }}
                >
                  <Logout sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* KPI Cards - Layout responsive avec 4 colonnes empilées prenant toute la largeur */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr', // Mobile: 1 colonne
            sm: '1fr 1fr', // Tablette: 2 colonnes 
            md: '1fr 1fr 1fr 1fr', // Desktop petit: 4 colonnes égales
            lg: '1fr 2fr 1fr 2fr', // Desktop: proportions 1-2-1-2
            xl: '1fr 2fr 1fr 2fr' // Large desktop: même proportions
          },
          gap: 2,
          width: '100%'
        }}>
          {/* Première colonne - CA Brut et Déductions empilés */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            minWidth: 0 // Permet le shrinking si nécessaire
          }}>
            <KPICard
              title="CA Brut"
              value={stats ? formatCurrency(stats.grossRevenue + (stats.externalRevenuesMetrics?.totalRevenue || 0)) : '---'}
              hoverValue={stats ? formatCurrencyWithDecimals(stats.grossRevenue + (stats.externalRevenuesMetrics?.totalRevenue || 0)) : undefined}
              subtitle={stats && stats.externalRevenuesMetrics?.totalRevenue > 0 ? `dont ${formatCurrency(stats.externalRevenuesMetrics.totalRevenue)} hors plateforme` : undefined}
              icon={<EuroSymbol />}
              color="#10b981"
            />
            <DeductionsKPICard stats={stats} />
          </Box>

          {/* Deuxième colonne - CA Net et CA Brut Semaine empilés (2x plus large) */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            minWidth: 0
          }}>
            <NetRevenueKPICard stats={stats} />
            <WeeklyStatsKPICard stats={stats} />
          </Box>
          
          {/* Troisième colonne - Nombre Total d'Apprenants et Complétion Formation empilés */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            minWidth: 0
          }}>
            <KPICard
              title="Nombre de Licences"
              value={stats ? (stats.totalCustomers + (stats.externalRevenuesMetrics?.totalLicenses || 0)).toString() : '---'}
              subtitle={stats && stats.externalRevenuesMetrics?.totalLicenses > 0 ? `dont ${stats.externalRevenuesMetrics.totalLicenses} hors plateforme` : undefined}
              icon={<People />}
              color="#8b5cf6"
            />
            <CompletionKPICard stats={stats} />
          </Box>

          {/* Dernière colonne - Satisfaction et NPS empilés (2x plus large) */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0
          }}>
            <SatisfactionKPICard stats={stats} />
            <NPSKPICard stats={stats} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};