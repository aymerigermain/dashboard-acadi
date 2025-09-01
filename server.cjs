const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const { google } = require('googleapis');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

// Initialize Google Sheets
const credentials = require('./credentials/google-sheets-credentials.json');
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Google Sheets helper function
async function getSatisfactionData() {
  try {
    const spreadsheetId = process.env.REACT_APP_GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      console.log('No Google Sheet ID configured');
      return { 
        averageRating: 0, 
        totalReviews: 0, 
        columnE: [], 
        columnF: [], 
        columnG: [], 
        columnY: [],
        columnAD: [] 
      };
    }

    // Get data from multiple columns
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'E:AD', // Columns E through AD (includes Y)
    });

    const values = response.data.values || [];
    if (values.length === 0) {
      return { averageRating: 0, totalReviews: 0, columnE: [], columnF: [], columnG: [], columnAD: [], columnY: [] };
    }

    // Extract data by column (0-indexed: E=0, F=1, G=2, O=10, Y=20, AD=25)
    const columnE = values.slice(1).map(row => row[0]).filter(val => val !== undefined && val !== '');
    const columnF = values.slice(1).map(row => row[1]).filter(val => val !== undefined && val !== '');
    const columnG = values.slice(1).map(row => row[2]).filter(val => val !== undefined && val !== '');
    const columnO = values.slice(1).map(row => row[10]).filter(val => val !== undefined && val !== '');
    const columnY = values.slice(1).map(row => row[20]).filter(val => val !== undefined && val !== '');
    const columnAD = values.slice(1).map(row => row[25]).filter(val => val !== undefined && val !== '');

    // Process ratings from column O
    const ratings = columnO
      .map(val => parseFloat(val))
      .filter(rating => !isNaN(rating) && rating >= 0 && rating <= 10);

    const totalReviews = ratings.length;
    const averageRating = totalReviews > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews 
      : 0;

    console.log(`Found ${totalReviews} satisfaction ratings, average: ${averageRating.toFixed(1)}/10`);
    console.log(`Column E: ${columnE.length} entries`);
    console.log(`Column F: ${columnF.length} entries`);
    console.log(`Column G: ${columnG.length} entries`);
    console.log(`Column Y: ${columnY.length} testimonials`);
    console.log(`Column AD: ${columnAD.length} entries`);
    
    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      columnE,
      columnF,
      columnG,
      columnY,
      columnAD
    };
  } catch (error) {
    console.error('Error fetching satisfaction data:', error);
    return { 
      averageRating: 0, 
      totalReviews: 0, 
      columnE: [], 
      columnF: [], 
      columnG: [], 
      columnY: [],
      columnAD: [] 
    };
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow Vite dev server
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all payments from Stripe with pagination
app.get('/api/payments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Function to fetch all charges with pagination
    const fetchAllCharges = async () => {
      let allCharges = [];
      let hasMore = true;
      let startingAfter = null;

      while (hasMore) {
        const params = {
          limit: 100, // Max limit per API call
          expand: ['data.customer']
        };

        if (startingAfter) {
          params.starting_after = startingAfter;
        }

        // Add date filters if provided
        if (startDate) {
          params.created = {
            gte: Math.floor(new Date(startDate).getTime() / 1000)
          };
        }
        if (endDate) {
          params.created = {
            ...params.created,
            lte: Math.floor(new Date(endDate).getTime() / 1000)
          };
        }

        const charges = await stripe.charges.list(params);
        allCharges = allCharges.concat(charges.data);
        
        hasMore = charges.has_more;
        if (hasMore && charges.data.length > 0) {
          startingAfter = charges.data[charges.data.length - 1].id;
        }

        // Safety break to avoid infinite loops
        if (allCharges.length > 10000) {
          console.warn('Reached safety limit of 10000 charges');
          break;
        }
      }

      return allCharges;
    };

    // Fetch all charges with pagination
    const allCharges = await fetchAllCharges();
    
    // Filter only successful payments
    const successfulPayments = allCharges.filter(charge => 
      charge.status === 'succeeded' && 
      charge.amount > 0
    );

    // Transform the data for the frontend
    const transformedData = successfulPayments.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100, // Convert from cents to euros
      currency: charge.currency,
      created: charge.created * 1000, // Convert to milliseconds
      description: charge.description || 'Formation Stratégie',
      customerEmail: charge.billing_details?.email || charge.customer?.email || 'N/A',
      status: charge.status
    }));

    res.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
      hasMore: charges.has_more
    });

  } catch (error) {
    console.error('Error fetching payments from Stripe:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
      message: error.message
    });
  }
});

// Get payment statistics
app.get('/api/stats', async (req, res) => {
  try {
    // Function to fetch all charges with pagination
    const fetchAllCharges = async () => {
      let allCharges = [];
      let hasMore = true;
      let startingAfter = null;

      while (hasMore) {
        const params = {
          limit: 100, // Max limit per API call
          expand: ['data.balance_transaction'], // Include fee information
        };

        if (startingAfter) {
          params.starting_after = startingAfter;
        }

        const charges = await stripe.charges.list(params);
        allCharges = allCharges.concat(charges.data);
        
        hasMore = charges.has_more;
        if (hasMore && charges.data.length > 0) {
          startingAfter = charges.data[charges.data.length - 1].id;
        }

        // Safety break to avoid infinite loops
        if (allCharges.length > 10000) {
          console.warn('Reached safety limit of 10000 charges');
          break;
        }
      }

      return allCharges;
    };

    // Function to fetch all refunds with pagination
    const fetchAllRefunds = async () => {
      let allRefunds = [];
      let hasMore = true;
      let startingAfter = null;

      while (hasMore) {
        const params = {
          limit: 100, // Max limit per API call
          expand: ['data.balance_transaction'], // Include fee information
        };

        if (startingAfter) {
          params.starting_after = startingAfter;
        }

        const refunds = await stripe.refunds.list(params);
        allRefunds = allRefunds.concat(refunds.data);
        
        hasMore = refunds.has_more;
        if (hasMore && refunds.data.length > 0) {
          startingAfter = refunds.data[refunds.data.length - 1].id;
        }

        // Safety break to avoid infinite loops
        if (allRefunds.length > 10000) {
          console.warn('Reached safety limit of 10000 refunds');
          break;
        }
      }

      return allRefunds;
    };

    // Fetch all charges and refunds with pagination
    const [allCharges, allRefunds] = await Promise.all([
      fetchAllCharges(),
      fetchAllRefunds()
    ]);
    
    console.log(`Fetched ${allCharges.length} total charges from Stripe`);
    console.log(`Fetched ${allRefunds.length} total refunds from Stripe`);
    
    const successfulPayments = allCharges.filter(charge => 
      charge.status === 'succeeded' && charge.amount > 0
    );
    console.log(`Found ${successfulPayments.length} successful payments`);

    // Calculate comprehensive statistics
    const grossRevenue = successfulPayments.reduce((sum, charge) => sum + (charge.amount / 100), 0);
    const totalRefunds = allRefunds.reduce((sum, refund) => sum + (refund.amount / 100), 0);
    const totalChargeFees = successfulPayments.reduce((sum, charge) => {
      return sum + (charge.balance_transaction?.fee || 0) / 100;
    }, 0);
    const totalRefundFees = allRefunds.reduce((sum, refund) => {
      return sum + (refund.balance_transaction?.fee || 0) / 100;
    }, 0);
    
    const netRevenue = grossRevenue - totalRefunds - totalChargeFees + totalRefundFees;
    const totalCustomers = successfulPayments.length;
    const lastUpdate = new Date().toISOString();

    // Helper function to get Monday of the week
    const getMondayOfWeek = (date) => {
      const monday = new Date(date);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
    };

    // Get current week (Monday to Sunday)
    const now = new Date();
    const currentWeekStart = getMondayOfWeek(now);
    
    // Group by week for all payments and refunds
    const weeklyData = {};
    let currentWeekSales = 0;
    let currentWeekGrossRevenue = 0;
    let currentWeekRefunds = 0;
    let currentWeekFees = 0;

    // Process charges
    successfulPayments.forEach(charge => {
      const chargeDate = new Date(charge.created * 1000);
      const weekStart = getMondayOfWeek(chargeDate);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          sales: 0,
          grossRevenue: 0,
          refunds: 0,
          fees: 0,
          netRevenue: 0
        };
      }
      
      const amount = charge.amount / 100;
      const fee = (charge.balance_transaction?.fee || 0) / 100;
      
      weeklyData[weekKey].sales += 1;
      weeklyData[weekKey].grossRevenue += amount;
      weeklyData[weekKey].fees += fee;

      // Track current week stats
      if (weekKey === currentWeekStart.toISOString().split('T')[0]) {
        currentWeekSales += 1;
        currentWeekGrossRevenue += amount;
        currentWeekFees += fee;
      }
    });

    // Process refunds
    allRefunds.forEach(refund => {
      const refundDate = new Date(refund.created * 1000);
      const weekStart = getMondayOfWeek(refundDate);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          sales: 0,
          grossRevenue: 0,
          refunds: 0,
          fees: 0,
          netRevenue: 0
        };
      }
      
      const refundAmount = refund.amount / 100;
      const refundFee = (refund.balance_transaction?.fee || 0) / 100;
      
      weeklyData[weekKey].refunds += refundAmount;
      weeklyData[weekKey].fees -= refundFee; // Refund fees are credited back

      // Track current week refund stats
      if (weekKey === currentWeekStart.toISOString().split('T')[0]) {
        currentWeekRefunds += refundAmount;
        currentWeekFees -= refundFee;
      }
    });

    // Calculate net revenue for each week
    Object.values(weeklyData).forEach(week => {
      week.netRevenue = week.grossRevenue - week.refunds - week.fees;
    });

    const currentWeekNetRevenue = currentWeekGrossRevenue - currentWeekRefunds - currentWeekFees;

    // Convert to array and sort by date
    const weeklyStats = Object.values(weeklyData).sort((a, b) => 
      new Date(a.week).getTime() - new Date(b.week).getTime()
    );

    // Get satisfaction data from Google Sheets
    const satisfactionData = await getSatisfactionData();

    res.json({
      success: true,
      data: {
        // Legacy field for compatibility
        totalRevenue: netRevenue,
        
        // New comprehensive metrics
        grossRevenue,
        totalRefunds,
        totalFees: totalChargeFees - totalRefundFees,
        netRevenue,
        
        totalCustomers,
        lastUpdate,
        weeklyStats,
        averageOrderValue: totalCustomers > 0 ? grossRevenue / totalCustomers : 0,
        
        // Current week stats
        currentWeekSales,
        currentWeekGrossRevenue,
        currentWeekRefunds,
        currentWeekFees,
        currentWeekNetRevenue,
        
        // Satisfaction data from Google Sheets
        averageRating: satisfactionData.averageRating,
        totalReviews: satisfactionData.totalReviews,
        
        // Additional Google Sheets columns
        columnE: satisfactionData.columnE,
        columnF: satisfactionData.columnF,
        columnG: satisfactionData.columnG,
        columnY: satisfactionData.columnY,
        columnAD: satisfactionData.columnAD
      }
    });

  } catch (error) {
    console.error('Error calculating statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate statistics',
      message: error.message
    });
  }
});

// Mock data endpoint for development
app.get('/api/mock-data', (req, res) => {
  const mockData = {
    // Legacy compatibility
    totalRevenue: 11800, // This is now netRevenue
    
    // Comprehensive metrics
    grossRevenue: 12500,
    totalRefunds: 350,
    totalFees: 350,
    netRevenue: 11800,
    
    totalCustomers: 125,
    lastUpdate: new Date().toISOString(),
    weeklyStats: [
      { week: '2024-07-01', sales: 8, revenue: 792, grossRevenue: 792, refunds: 0, fees: 25, netRevenue: 767 },
      { week: '2024-07-08', sales: 12, revenue: 1188, grossRevenue: 1188, refunds: 50, fees: 38, netRevenue: 1100 },
      { week: '2024-07-15', sales: 15, revenue: 1485, grossRevenue: 1485, refunds: 100, fees: 47, netRevenue: 1338 },
      { week: '2024-07-22', sales: 18, revenue: 1782, grossRevenue: 1782, refunds: 0, fees: 56, netRevenue: 1726 },
      { week: '2024-07-29', sales: 20, revenue: 1980, grossRevenue: 1980, refunds: 200, fees: 62, netRevenue: 1718 },
      { week: '2024-08-05', sales: 22, revenue: 2178, grossRevenue: 2178, refunds: 0, fees: 69, netRevenue: 2109 },
      { week: '2024-08-12', sales: 15, revenue: 1485, grossRevenue: 1485, refunds: 0, fees: 47, netRevenue: 1438 },
      { week: '2024-08-19', sales: 15, revenue: 1485, grossRevenue: 1485, refunds: 0, fees: 47, netRevenue: 1438 }
    ],
    averageOrderValue: 100,
    
    // Current week stats
    currentWeekSales: 8,
    currentWeekGrossRevenue: 792,
    currentWeekRefunds: 0,
    currentWeekFees: 25,
    currentWeekNetRevenue: 767
  };

  res.json({
    success: true,
    data: mockData
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for Vite dev server`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});