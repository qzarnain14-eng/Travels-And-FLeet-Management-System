import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = 5000;
dotenv.config();

connectDB();

// MIDDLEWARES 
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES 
app.use('/api/auth', userRouter);

app.get('/api/ping', (req, res) => {
    res.status(200).json({
        ok: true,
        time: Date.now()
    });
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API WORKING' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});