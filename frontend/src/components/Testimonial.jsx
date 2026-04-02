import React, { useState, useEffect } from 'react'
import { testimonialStyles as styles } from '../assets/dummyStyles';
import { FaCar, FaStar, FaQuoteLeft, FaPaperPlane } from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';

const Testimonial = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/testimonials');
            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleRatingClick = (rate) => {
        setFormData(prev => ({ ...prev, rating: rate }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/testimonials/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'Customer' })
            });

            const data = await response.json();
            if (data.success) {
                setMessage('Thank you! Your experience has been recorded.');
                setFormData({ name: '', rating: 5, comment: '' });
                fetchTestimonials(); // Refresh the list
                setTimeout(() => setMessage(''), 5000);
            } else {
                setMessage('Something went wrong. Please try again.');
            }
        } catch (error) {
            setMessage('Server error. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                {/* HEADERS */}
                <div className={styles.headerContainer}>
                    <div className={styles.badge}>
                        <FaCar className={`${styles.quoteIcon} mr-2`} />
                        <span className={styles.badgeText}>Customer Experiences</span>
                    </div>

                    <h1 className={styles.title}>
                        Premium <span className={styles.accentText}>Drive</span> Experiences
                    </h1>

                    <div className={styles.dividerContainer}>
                        <div className={styles.dividerLine} />
                        <GiSteeringWheel
                            className={`${styles.accentText} mx-4`} size={24} />
                        <div className={styles.dividerLine} />
                    </div>
                    <p className={styles.subtitle}>
                        Hear from our customers about their journey with our premium fleet
                    </p>
                </div>

                {/* TESTIMONIAL GRID */}
                <div className={styles.grid}>
                    {loading ? (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            Loading experiences...
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            No testimonials yet. Be the first to share your experience!
                        </div>
                    ) : (
                        testimonials.map((t, index) => {
                            const IconComponent = styles.icons[index % styles.icons.length];

                            return (
                                <div
                                    key={t._id}
                                    className={styles.card}
                                    style={{
                                        clipPath: "polygon(0% 10%, 10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)",
                                        background:
                                            "linear-gradient(145deg, rgba(30,30,40,0.8), rgba(20,20,30,0.8))",
                                        backdropFilter: "blur(10px)",
                                        border: "1px solid rgba(100,100,120,0.2)",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    <div className={styles.cardContent}>
                                        <div className="flex justify-between items-start mb-6">
                                            <FaQuoteLeft className={styles.quoteIcon} size={28} />
                                            {/* RATING */}
                                            <div className={styles.ratingContainer}>
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`${i < t.rating ? styles.accentText : 'text-gray-700'} ${styles.star}`}
                                                        size={18}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className={styles.comment}>"{t.comment}"</p>

                                        <div className={styles.carInfo}>
                                            <IconComponent className={styles.carIcon} />
                                            <span className={styles.carText}>{t.car || "Premium Fleet"}</span>
                                        </div>

                                        <div className={styles.authorContainer}>
                                            <div className={styles.avatar}>
                                                {t.name.charAt(0)}
                                            </div>
                                            <div className={styles.authorInfo}>
                                                <h4 className={styles.authorName}>{t.name}</h4>
                                                <p className={styles.authorRole}>{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.decorativeCorner} />
                                    <div className={styles.patternIcon}>
                                        <IconComponent size={36} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* FORM SECTION - SHARE YOUR EXPERIENCE */}
                <div className="mt-24 max-w-4xl mx-auto w-full">
                    <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-pink-500/20 border border-white/5">
                        <div className="bg-[#0a0a0f]/90 backdrop-blur-3xl rounded-[1.4rem] p-8 md:p-12">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Experience</span>
                                </h2>
                                <p className="text-gray-400">Your feedback helps us maintain our premium standard</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-600"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest ml-1">Your Rating</label>
                                        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-[16.5px]">
                                            {[1, 2, 3, 4, 5].map((rate) => (
                                                <button
                                                    key={rate}
                                                    type="button"
                                                    onClick={() => handleRatingClick(rate)}
                                                    className="transition-transform active:scale-95"
                                                >
                                                    <FaStar
                                                        size={24}
                                                        className={rate <= formData.rating ? "text-yellow-500" : "text-gray-700"}
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-4 text-sm font-medium text-indigo-400">{formData.rating}/5</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest ml-1">Your Comment</label>
                                    <textarea
                                        rows={4}
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-gray-600 resize-none"
                                        placeholder="Tell us about your journey with Travels and Fleet..."
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex flex-col items-center">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`group relative overflow-hidden flex items-center justify-center space-x-4 bg-gradient-to-r from-indigo-600 to-purple-600 px-12 py-5 rounded-2xl font-bold text-white transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100`}
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                        <span className="relative">{submitting ? 'Sharing...' : 'Share Your Story'}</span>
                                        <FaPaperPlane className={`relative text-indigo-200 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${submitting ? 'animate-pulse' : ''}`} />
                                    </button>

                                    {message && (
                                        <p className={`mt-6 text-sm font-medium animate-pulse ${message.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
                                            {message}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/*STATS SECTIONS*/}
                <div className={styles.statsContainer}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue(styles.statColors.value[0])}>10k+</div>
                            <div className={styles.statLabel(styles.statColors.label[0])}>
                                Happy Customers
                            </div>
                        </div>

                        <div className={styles.statItem}>
                            <div className={styles.statValue(styles.statColors.value[1])}>250k+</div>
                            <div className={styles.statLabel(styles.statColors.label[1])}>
                                Luxury Vehicles
                            </div>
                        </div>

                        <div className={styles.statItem}>
                            <div className={styles.statValue(styles.statColors.value[2])}>24/7</div>
                            <div className={styles.statLabel(styles.statColors.label[2])}>
                                Support
                            </div>
                        </div>

                        <div className={styles.statItem}>
                            <div className={styles.statValue(styles.statColors.value[3])}>50+</div>
                            <div className={styles.statLabel(styles.statColors.label[3])}>
                                Locations
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className={styles.ctaContainer}>
                    <h2 className={styles.ctaTitle}>
                        Ready for your experience
                    </h2>
                    <p className={styles.ctaText}>
                        Join Thousand Of Statisfieed Customer Who Have Experience Our Premium Fleet And Exceptional Service
                    </p>
                    <a href="/cars" className={styles.ctaButton}>
                        Book Your Luxury Ride
                    </a>
                </div>
            </div>

            <div className={styles.bottomGradient} />
        </div>
    )
}

export default Testimonial
