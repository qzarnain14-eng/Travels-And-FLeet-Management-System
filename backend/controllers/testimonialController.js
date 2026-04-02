import Testimonial from '../models/testimonialModel.js'

// Get all testimonials
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching testimonials', error: error.message });
    }
};

// Add a new testimonial
const addTestimonial = async (req, res) => {
    try {
        const { name, role, comment, rating, car } = req.body;
        
        if (!name || !role || !comment || !rating) {
            return res.status(400).json({ success: false, message: 'Please provide name, role, comment, and rating' });
        }

        const testimonial = await Testimonial.create({
            name,
            role,
            comment,
            rating,
            car
        });

        res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while adding testimonial', error: error.message });
    }
};

// Delete a testimonial
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while deleting testimonial', error: error.message });
    }
};

export { getTestimonials, addTestimonial, deleteTestimonial };
