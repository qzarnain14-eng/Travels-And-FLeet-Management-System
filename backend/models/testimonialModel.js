import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: 'Customer'
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    car: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
