import {
  ThemeProvider,
  CssBaseline,
  Container,
  Grid,
  Box,
  Alert,
  Backdrop,
  CircularProgress,
  Typography,
} from '@mui/material';
import { theme } from './theme';
import { useRef } from 'react';
import { useStripeData } from './hooks/useStripeData';
import { Header } from './components/Header';
import { SalesChart } from './components/SalesChart';
import { RevenueChart } from './components/RevenueChart';
import { SurveyStats } from './components/SurveyStats';
import { Testimonials } from './components/Testimonials';
import { DataTable } from './components/DataTable';
import { ExportButton, type ExportButtonRef } from './components/ExportButton';

function App() {
  const { stats, chartData, loading, error, refetch, lastUpdated } = useStripeData();
  const exportButtonRef = useRef<ExportButtonRef>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading && !stats} // Only show on initial load
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement des données...
          </Typography>
        </Box>
      </Backdrop>

      {/* Main Content */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }} data-export="dashboard">
        {/* Header with KPIs */}
        <Header
          stats={stats}
          loading={loading}
          onRefresh={refetch}
          lastUpdated={lastUpdated}
          onExport={() => exportButtonRef.current?.handleExportClick()}
        />

        <Container maxWidth="xl" sx={{ pb: 4 }}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => window.location.reload()}
            >
              {error}
            </Alert>
          )}

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={6}>
              <Box data-testid="sales-chart">
                <SalesChart data={chartData} loading={loading} />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box data-testid="revenue-chart">
                <RevenueChart data={chartData} loading={loading} />
              </Box>
            </Grid>
          </Grid>

          {/* Data Table Section */}
          <Box sx={{ mb: 4 }}>
            <DataTable data={chartData} loading={loading} />
          </Box>

          {/* Survey Statistics Section */}
          <SurveyStats stats={stats} loading={loading} />

          {/* Testimonials Section */}
          <Testimonials stats={stats} />

          {/* Export Section */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              py: 3,
            }}
          >
            <ExportButton
              ref={exportButtonRef}
              stats={stats}
              chartData={chartData}
              disabled={loading || !!error}
            />
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
              mt: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              ACADI - Formation Stratégie d'Entreprise avec Xavier Fontanet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dashboard développé par Aymeri Germain
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;