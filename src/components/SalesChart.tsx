import {
  Box,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../types';

interface SalesChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, loading }) => {
  const theme = useTheme();

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: ChartDataPoint }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          elevation={4}
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Semaine du {label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#1e40af' }}>
            Ventes: {payload[0].value}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        height: 450,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            backgroundColor: '#1e40af',
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
          Évolution des Ventes (Historique Complet)
        </Typography>
      </Box>
      
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 300,
          }}
        >
          <Typography color="text.secondary">Chargement des données...</Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1e40af"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: '#1e40af',
                strokeWidth: 2,
                stroke: '#ffffff',
              }}
              activeDot={{
                r: 8,
                fill: '#1e40af',
                strokeWidth: 2,
                stroke: '#ffffff',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};