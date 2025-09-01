import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    // Function to fetch all charges with pagination
    const fetchAllCharges = async () => {
      let allCharges = [];
      let hasMore = true;
      let startingAfter = null;

      while (hasMore) {
        const params = {
          limit: 100,
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
      amount: charge.amount / 100,
      currency: charge.currency,
      created: charge.created * 1000,
      description: charge.description || 'Formation Stratégie',
      customerEmail: charge.billing_details?.email || charge.customer?.email || 'N/A',
      status: charge.status
    }));

    res.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
      hasMore: false
    });

  } catch (error) {
    console.error('Error fetching payments from Stripe:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments',
      message: error.message
    });
  }
}