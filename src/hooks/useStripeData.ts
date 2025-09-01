import { useState, useEffect, useCallback } from 'react';
import { stripeService } from '../services/stripeService';
import type { DashboardStats, ChartDataPoint } from '../types';
import { processWeeklyData } from '../utils/dataProcessing';

interface UseStripeDataReturn {
  stats: DashboardStats | null;
  chartData: ChartDataPoint[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useStripeData = (): UseStripeDataReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check server health first
      const isHealthy = await stripeService.healthCheck();
      if (!isHealthy) {
        throw new Error('Server is not responding. Please check the connection.');
      }

      // Fetch statistics
      const statsData = await stripeService.getStats();
      setStats(statsData);

      // Process chart data
      const processedData = processWeeklyData(statsData.weeklyStats);
      setChartData(processedData);

      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error fetching Stripe data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchData, loading]);

  return {
    stats,
    chartData,
    loading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};