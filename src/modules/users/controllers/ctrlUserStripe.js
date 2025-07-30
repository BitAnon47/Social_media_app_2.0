const stripe = require('stripe')(process.env.Stripe_SECRET_KEY);

const createSubscriptionIntent = async (req, res) => {
  try {
    // You should get the customer ID from your DB or create a new one if needed
    const { userId,amount, currency } = req.body;

    // Create a PaymentIntent for the subscription
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // e.g., 999 for $9.99
      currency, // e.g., 'usd'
      customer: userId, // Assuming userId is stored in req.user
      description: 'User profile subscription',
      // You can add more options as needed
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createSubscriptionIntent };