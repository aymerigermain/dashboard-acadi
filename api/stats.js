import Stripe from 'stripe';
import { google } from 'googleapis';

// Initialize Stripe
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

// Google Sheets helper function
async function getSatisfactionData() {
  try {
    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
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
    console.log(`Column Y: ${columnY.length} testimonials`);
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
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

export default async function handler(req, res) {
  try {
    // Function to fetch all charges with pagination
    const fetchAllCharges = async () => {
      let allCharges = [];
      let hasMore = true;
      let startingAfter = null;

      while (hasMore) {
        const params = {
          limit: 100,
          expand: ['data.balance_transaction'],
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
          limit: 100,
          expand: ['data.balance_transaction'],
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
    
    const successfulPayments = allCharges.filter(charge => 
      charge.status === 'succeeded' && charge.amount > 0
    );

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
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
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
      weeklyData[weekKey].fees -= refundFee;

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
        totalRevenue: netRevenue,
        grossRevenue,
        totalRefunds,
        totalFees: totalChargeFees - totalRefundFees,
        netRevenue,
        totalCustomers,
        lastUpdate,
        weeklyStats,
        averageOrderValue: totalCustomers > 0 ? grossRevenue / totalCustomers : 0,
        currentWeekSales,
        currentWeekGrossRevenue,
        currentWeekRefunds,
        currentWeekFees,
        currentWeekNetRevenue,
        averageRating: satisfactionData.averageRating,
        totalReviews: satisfactionData.totalReviews,
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
}