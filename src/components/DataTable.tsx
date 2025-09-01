import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import type { ChartDataPoint } from '../types';
import { formatCurrency } from '../utils/dateUtils';
import { calculateGrowthRate } from '../utils/dataProcessing';

interface DataTableProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ data, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Sort data by week (most recent first) for table display
  const sortedData = [...data].sort((a, b) => new Date(b.week).getTime() - new Date(a.week).getTime());
  
  const tableData = sortedData.map((item, index) => {
    const previousWeek = index < sortedData.length - 1 ? sortedData[index + 1] : null;
    const growthRate = previousWeek
      ? calculateGrowthRate(item.revenue, previousWeek.revenue)
      : null;

    return {
      ...item,
      weekNumber: sortedData.length - index,
      growthRate,
      formattedRevenue: formatCurrency(item.revenue),
      formattedCumulativeRevenue: formatCurrency(item.cumulativeRevenue || 0),
    };
  });

  const GrowthChip = ({ growthRate }: { growthRate: { rate: number; isPositive: boolean } | null }) => {
    if (!growthRate) return <Typography variant="caption">-</Typography>;

    const { rate, isPositive } = growthRate;
    const color = isPositive ? 'success' : 'error';
    const icon = isPositive ? <TrendingUp /> : <TrendingDown />;

    return (
      <Chip
        icon={icon}
        label={`${isPositive ? '+' : '-'}${rate.toFixed(1)}%`}
        color={color}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Détail par Semaine
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
          }}
        >
          <Typography color="text.secondary">Chargement des données...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            backgroundColor: '#64748b',
            borderRadius: 2,
          }}
        />
        <Typography
          variant="h6"
          component="h2"
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            fontSize: '1.125rem',
          }}
        >
          Détail par Semaine
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 500, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                Semaine
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                Ventes
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                CA Semaine
              </TableCell>
              {!isMobile && (
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                  Évolution
                </TableCell>
              )}
              <TableCell align="right" sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                CA Cumulé
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow
                key={row.week}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'grey.50',
                  },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    '& .MuiTableCell-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.date}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.sales}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'success.main' }}
                  >
                    {row.formattedRevenue}
                  </Typography>
                </TableCell>
                {!isMobile && (
                  <TableCell align="center">
                    <GrowthChip growthRate={row.growthRate} />
                  </TableCell>
                )}
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: 'primary.main' }}
                  >
                    {row.formattedCumulativeRevenue}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 100,
            mt: 2,
          }}
        >
          <Typography color="text.secondary">
            Aucune donnée disponible pour la période sélectionnée
          </Typography>
        </Box>
      )}
    </Paper>
  );
};