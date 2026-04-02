import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/userRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || stripeSecretKey.startsWith('your_sk_') || stripeSecretKey.trim() === '') {
  console.warn('WARNING: STRIPE_SECRET_KEY is missing or invalid (placeholder). Stripe checkout will return error until a valid key is configured. Set backend/.env STRIPE_SECRET_KEY=sk_test_...');
}

console.log('Environment check:');
console.log('STRIPE_MODE:', process.env.STRIPE_MODE);
console.log('STRIPE_TEST_SECRET_KEY exists:', !!process.env.STRIPE_TEST_SECRET_KEY);
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
if (process.env.STRIPE_TEST_SECRET_KEY) {
  console.log('STRIPE_TEST_SECRET_KEY starts with:', process.env.STRIPE_TEST_SECRET_KEY.substring(0, 12));
}
if (process.env.STRIPE_SECRET_KEY) {
  console.log('STRIPE_SECRET_KEY starts with:', process.env.STRIPE_SECRET_KEY.substring(0, 12));
}

await connectDB();

app.use(cors({ origin: '*', credentials: true }));

// Parse request body
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📤 ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log(`   Body: ${JSON.stringify(req.body).substring(0, 100)}...`);
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/testimonials', testimonialRoutes);

console.log('Routes registered:');
console.log('- /api/auth');
console.log('- /api/stripe');
console.log('- /api/testimonials');
console.log('- /api/ping');
console.log('- / (root)');

app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));
app.get('/', (req, res) => res.json({ message: 'API running' }));

app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API http://localhost:${PORT}`);
});
