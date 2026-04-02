import express from 'express';
import Stripe from 'stripe';

console.log('Loading stripeRoutes.js...');

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

console.log(`Stripe mode: ${stripeMode}`);
console.log(`Stripe test key exists: ${!!stripeTestKey}`);
console.log(`Stripe live key exists: ${!!stripeLiveKey}`);
console.log(`Selected key starts with: ${stripeSecretKey ? stripeSecretKey.substring(0, 12) : 'undefined'}`);

let stripe;
let stripeEnabled = true;
if (!stripeSecretKey || stripeSecretKey.startsWith('your_sk_') || stripeSecretKey.trim() === '') {
  stripeEnabled = false;
  console.warn(`Stripe disabled: key missing for mode=${stripeMode}. Set STRIPE_${stripeMode.toUpperCase()}_SECRET_KEY in backend/.env`);
} else {
  try {
    stripe = new Stripe(stripeSecretKey);
    console.log(`✓ Stripe initialized successfully in ${stripeMode} mode`);
  } catch (error) {
    stripeEnabled = false;
    console.error(`✗ Stripe initialization failed: ${error.message}`);
  }
}

router.post('/create-checkout-session', async (req, res) => {
  console.log('🔵 UPDATED: Stripe checkout endpoint called');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Stripe enabled:', stripeEnabled);
  console.log('Stripe object exists:', !!stripe);

  if (!stripeEnabled || !stripe) {
    return res.status(500).json({
      error: 'Stripe is not properly configured',
      message: `Stripe is not configured for ${stripeMode} mode. Please ensure STRIPE_${stripeMode.toUpperCase()}_SECRET_KEY is set correctly in backend/.env and the server has been restarted.`,
      debug: {
        stripeMode,
        stripeEnabled,
        hasStripeObject: !!stripe,
        keyStarts: stripeSecretKey ? stripeSecretKey.substring(0, 12) : 'none'
      }
    });
  }

  try {
    const { bookingData } = req.body;

    if (!bookingData || !bookingData.totalPrice) {
      return res.status(400).json({ error: 'Missing booking details' });
    }

    console.log('Creating checkout session with:', bookingData);

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

    console.log('✓ Checkout session created:', session.id);
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe Checkout Error:', {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      code: error.code,
      headers: error.headers
    });

    // Check if it's an API key error
    if (error.message && error.message.includes('Invalid API Key')) {
      return res.status(500).json({
        error: 'Invalid Stripe API Key',
        message: 'The Stripe API key configured in backend/.env is invalid. Please verify the key in your Stripe Dashboard at https://dashboard.stripe.com/apikeys and update backend/.env with the correct secret key.',
        details: error.message,
        suggestion: 'Go to Stripe Dashboard > Developers > API Keys > Secret Key and copy the exact value. Ensure NODE_ENV=development and STRIPE_MODE=sandbox are set correctly.'
      });
    }

    res.status(500).json({
      error: 'Stripe payment initialization failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

export default router;
console.log('stripeRoutes.js loaded and exported');
