import express from 'express';
import {
  getBookingReport,
  getVehicleReport,
  getUserReport,
  getSummaryReport,
  exportReport,
} from '../controllers/reportController.js';
import { isAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

// All report endpoints (protected with admin middleware)
router.get('/booking', isAdmin, getBookingReport);
router.get('/vehicle', isAdmin, getVehicleReport);
router.get('/user', isAdmin, getUserReport);
router.get('/summary', isAdmin, getSummaryReport);
router.get('/export', isAdmin, exportReport);

export default router;
