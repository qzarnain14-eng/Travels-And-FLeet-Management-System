import express from 'express'
import { getTestimonials, addTestimonial, deleteTestimonial } from '../controllers/testimonialController.js'

const router = express.Router();

router.get('/', getTestimonials);
router.post('/add', addTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
