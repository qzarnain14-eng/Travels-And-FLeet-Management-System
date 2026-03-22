import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

connectDB();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

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

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
