import express from 'express';
import {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
  getAvailableCars,
} from '../controllers/carController.js';
import { isAdmin } from '../middlewares/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getCars);
router.get('/search/available', getAvailableCars);
router.get('/:id', getCarById);

// Admin routes (protected with admin middleware)
router.post('/', isAdmin, addCar);
router.put('/:id', isAdmin, updateCar);
router.delete('/:id', isAdmin, deleteCar);

export default router;
