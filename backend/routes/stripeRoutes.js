import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

const stripeMode = (process.env.STRIPE_MODE || 'sandbox').toLowerCase();
const stripeTestKey = process.env.STRIPE_TEST_SECRET_KEY;
const stripeLiveKey = process.env.STRIPE_LIVE_SECRET_KEY;

let stripeSecretKey;
if (stripeMode === 'live') {
  stripeSecretKey = stripeLiveKey;
} else {
  stripeSecretKey = stripeTestKey || process.env.STRIPE_SECRET_KEY;
}

let stripe;
let stripeEnabled = true;
if (!stripeSecretKey || stripeSecretKey.startsWith('your_sk_') || stripeSecretKey.trim() === '') {
  stripeEnabled = false;
  console.warn(`Stripe disabled: key missing for mode=${stripeMode}. Set STRIPE_${stripeMode.toUpperCase()}_SECRET_KEY in backend/.env`);
} else {
  stripe = new Stripe(stripeSecretKey);
}

router.post('/create-checkout-session', async (req, res) => {
  if (!stripeEnabled) {
    return res.status(500).json({
      error:
        `Stripe is not configured for ${stripeMode}. Set backend/.env STRIPE_${stripeMode.toUpperCase()}_SECRET_KEY=sk_${stripeMode}_... and restart the server.`,
    });
  }

  try {
    const { bookingData } = req.body;
    
    if (!bookingData || !bookingData.totalPrice) {
      return res.status(400).json({ error: 'Missing booking details' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${bookingData.carName} Rental`,
              description: `${bookingData.days} days rental from ${bookingData.pickupDate} to ${bookingData.returnDate}`,
            },
            unit_amount: Math.round(bookingData.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
      customer_email: bookingData.email,
      metadata: {
        carId: bookingData.carId,
        pickupDate: bookingData.pickupDate,
        returnDate: bookingData.returnDate,
        pickupLocation: bookingData.pickupLocation,
        name: bookingData.name,
        phone: bookingData.phone
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
