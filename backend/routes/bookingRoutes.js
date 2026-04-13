import express from 'express';
import {
  getAllBookings,
  getUserBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  updatePaymentStatus,
  addReview,
  cancelBooking,
  addAdditionalCharges,
} from '../controllers/bookingController.js';
import { isAdmin, verifyToken } from '../middlewares/adminAuth.js';

const router = express.Router();

// Admin routes - get all bookings
router.get('/', isAdmin, getAllBookings);

// User routes - require authentication
router.get('/user/:userId', verifyToken, getUserBookings);
router.get('/:id', verifyToken, getBookingById);
router.post('/', verifyToken, createBooking);
router.put('/:id/status', isAdmin, updateBookingStatus);
router.put('/:id/payment', updatePaymentStatus);
router.put('/:id/review', verifyToken, addReview);
router.put('/:id/cancel', verifyToken, cancelBooking);
router.put('/:id/charges', isAdmin, addAdditionalCharges);

export default router;
