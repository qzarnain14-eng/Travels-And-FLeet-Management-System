import React, { useState, useEffect, useCallback } from 'react';
import { AddCarPageStyles, toastStyles } from '../assets/dummyStyles';
import { toast } from 'react-toastify';
import { FaStar, FaTrash, FaQuoteLeft, FaUser, FaCar } from 'react-icons/fa';

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        comment: '',
        rating: 5,
        car: ''
    });

    const backendUrl = 'http://localhost:5000/api/testimonials'; // Adjusted to match your backend port

    const fetchTestimonials = useCallback(async () => {
        try {
            const response = await fetch(backendUrl);
            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Testimonial added successfully');
                setFormData({ name: '', role: '', comment: '', rating: 5, car: '' });
                fetchTestimonials();
            } else {
                toast.error(data.message || 'Failed to add testimonial');
            }
        } catch (error) {
            toast.error('Error adding testimonial');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            const response = await fetch(`${backendUrl}/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Deleted successfully');
                fetchTestimonials();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting testimonial');
        }
    };

    return (
        <div className={AddCarPageStyles.pageContainer}>
            <div className={AddCarPageStyles.fixedBackground}>
                <div className={AddCarPageStyles.gradientBlob1}></div>
                <div className={AddCarPageStyles.gradientBlob2}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                <div className={AddCarPageStyles.headerContainer}>
                    <h1 className={AddCarPageStyles.title}>
                        <span className={AddCarPageStyles.titleGradient}>Manage Testimonials</span>
                    </h1>
                    <p className={AddCarPageStyles.subtitle}>Add or remove customer feedback to display on the home page</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* FORM SECTION */}
                    <div className="lg:col-span-1">
                        <div className={`${AddCarPageStyles.formContainer} !mt-0 !p-6`}>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                                <FaQuoteLeft className="mr-2 text-indigo-400" /> Add Testimonial
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className={AddCarPageStyles.label}>Customer Name</label>
                                    <input name="name" value={formData.name} onChange={handleChange} className={AddCarPageStyles.input} placeholder="e.g. John Doe" required />
                                </div>
                                <div>
                                    <label className={AddCarPageStyles.label}>Role/Profession</label>
                                    <input name="role" value={formData.role} onChange={handleChange} className={AddCarPageStyles.input} placeholder="e.g. Business Traveler" required />
                                </div>
                                <div>
                                    <label className={AddCarPageStyles.label}>Car Experienced (Optional)</label>
                                    <input name="car" value={formData.car} onChange={handleChange} className={AddCarPageStyles.input} placeholder="e.g. BMW M4" />
                                </div>
                                <div>
                                    <label className={AddCarPageStyles.label}>Rating (1-5)</label>
                                    <select name="rating" value={formData.rating} onChange={handleChange} className={AddCarPageStyles.select}>
                                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={AddCarPageStyles.label}>Comment</label>
                                    <textarea name="comment" value={formData.comment} onChange={handleChange} className={AddCarPageStyles.textarea} rows={4} placeholder="Write the testimonial here..." required />
                                </div>
                                <button type="submit" className={`${AddCarPageStyles.submitButton} w-full mt-4`}>
                                    <span className={AddCarPageStyles.buttonText}>Save Testimonial</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* LIST SECTION */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center text-white py-10">Loading testimonials...</div>
                            ) : testimonials.length === 0 ? (
                                <div className="text-center text-gray-400 py-10 bg-black/30 rounded-2xl border border-white/5">
                                    No testimonials found. Add one to get started!
                                </div>
                            ) : (
                                testimonials.map((t) => (
                                    <div key={t._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex justify-between items-start transition-all hover:bg-white/10">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                                                    {t.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold">{t.name}</h3>
                                                    <p className="text-gray-400 text-sm">{t.role}</p>
                                                </div>
                                                <div className="ml-auto flex text-yellow-500">
                                                    {[...Array(t.rating)].map((_, i) => <FaStar key={i} size={14} className="ml-1" />)}
                                                </div>
                                            </div>
                                            <p className="text-gray-300 italic mb-3">"{t.comment}"</p>
                                            {t.car && (
                                                <div className="inline-flex items-center text-xs bg-white/5 px-3 py-1 rounded-full text-indigo-300">
                                                    <FaCar className="mr-2" /> {t.car}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => handleDelete(t._id)} className="ml-4 p-2 text-gray-500 hover:text-red-500 transition-colors">
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTestimonials;
