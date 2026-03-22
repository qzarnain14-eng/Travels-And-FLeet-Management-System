import React from 'react'
import { carDetailStyles } from '../assets/dummyStyles'
import carsData from '../assets/carsData'
import HcarsData from '../assets/HcarsData'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaShieldAlt, FaTachometerAlt, FaUserFriends, FaGasPump, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { useState } from 'react';
import BookingStepper from './BookingStepper';

const CarDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // All state declarations must be at the top, before any conditional returns
    const [today] = useState(() => new Date().toISOString().split('T')[0]);
    const [currentImage, setCurrentImage] = useState(0);
    const initialForm = {
        pickupDate: '',
        returnDate: '',
        pickupLocation: '',
        name: '',
        email: '',
        phone: '',
    };
    const [formData, setFormData] = useState(initialForm);
    const [activeField, setActiveField] = useState(null);

    // get car from router state or fallback to data
    const allCarsData = [...carsData, ...HcarsData];
    const car =
        location.state?.car ||
        allCarsData.find((c) => String(c.id) === id);

    if (!car) return <div className="p-4 text-white text-center mt-20">Car not found.</div>;

    // carousel
    const carImages = [car.image, ...(car.images || [])];

    // handle input change 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((fd) => ({
            ...fd, [name]: value,
        }))
    };

    // calculation function
    const calculateTotal = () => {
        const { pickupDate, returnDate } = formData;
        if (pickupDate && returnDate) {
            const days = Math.max(
                1,
                Math.ceil(
                    (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
                )
            )
            return days * car.price;
        }
        return car.price;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Calculate days and total price
        const { pickupDate, returnDate } = formData;
        if (!pickupDate || !returnDate) {
            toast.error('Please select both pick-up and return dates', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored'
            });
            return;
        }

        const days = Math.max(
            1,
            Math.ceil(
                (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
            )
        );
        const totalPrice = days * car.price;

        const booking = {
            id: crypto.randomUUID(),
            carId: car.id,
            carName: car.name,
            category: car.type,
            dailyPrice: car.price,
            pickupDate: formData.pickupDate,
            returnDate: formData.returnDate,
            pickupLocation: formData.pickupLocation,
            days: days,
            totalPrice: totalPrice,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bookingDate: new Date().toISOString(),
            paymentStatus: 'pending',
            cancelled: false,
        };

        sessionStorage.setItem('pendingBooking', JSON.stringify(booking));
        setFormData(initialForm);
        toast.success('Continue to secure payment to confirm your booking.', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
        });
        navigate('/payment', { state: { booking } });
    };

    const handleFocus = (field) => {
        setActiveField(field);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    return (
        <div className={carDetailStyles.pageContainer}>
            {/* MAIN CONTENT */}
            <div className={carDetailStyles.contentContainer}>
                <button onClick={() => navigate(-1)}
                    className={carDetailStyles.backButton}
                >
                    <FaArrowLeft className={carDetailStyles.backButtonIcon} />
                </button>

                <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mb-8">
                    <BookingStepper step={1} />
                </div>

                <div className={carDetailStyles.mainLayout}>
                    <div className={carDetailStyles.leftColumn}>
                        <div className={carDetailStyles.imageCarousel}>
                            <img src={carImages[currentImage]} alt={car.name} className={`${carDetailStyles.carImage} object-contain`} />
                            {carImages.length > 1 && (
                                <div className={carDetailStyles.carouselIndicators}>
                                    {carImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImage(idx)}
                                            className={carDetailStyles.carouselIndicator(idx === currentImage)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <h1 className={carDetailStyles.carName}>
                            {car.name}
                        </h1>
                        <p className={carDetailStyles.carPrice}>
                            ₹{car.price} <span className={carDetailStyles.pricePerDay}>/ day</span>
                        </p>

                        <div className={carDetailStyles.specsGrid}>
                            {[
                                { Icon: FaUserFriends, label: 'Seats', value: car.seats, color: 'text-orange-400' },
                                { Icon: FaGasPump, label: 'Fuel', value: car.fuel, color: 'text-green-400' },
                                { Icon: FaTachometerAlt, label: 'Mileage', value: car.mileage, color: 'text-yellow-400' },
                                { Icon: FaCheckCircle, label: 'Transmission', value: car.transmission, color: 'text-purple-400' },
                            ].map((spec, i) => (
                                <div key={i} className={carDetailStyles.specCard}>
                                    <spec.Icon className={`${spec.color} ${carDetailStyles.specIcon}`} />
                                    <p className={carDetailStyles.specLabel}>{spec.label}</p>
                                    <p className={carDetailStyles.specValue}>{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* ABOUT SECTION */}
                        <div className={carDetailStyles.aboutSection}>
                            <h2 className={carDetailStyles.aboutTitle}>About this Vehicle</h2>
                            <p className={carDetailStyles.aboutText}>
                                {car.description || `Experience the ultimate in comfort and performance with the ${car.name}. This ${car.type} is meticulously maintained and equipped with modern features to ensure a premium driving experience. Perfect for both city commutes and long distance travels.`}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - BOOKING FORM */}
                    <div className={carDetailStyles.rightColumn}>
                        <div className={carDetailStyles.bookingCard}>
                            <h2 className={carDetailStyles.bookingTitle}>Book This Car</h2>
                            <p className={carDetailStyles.bookingSubtitle}>Fill in the details to reserve your ride.</p>

                            <form onSubmit={handleSubmit} className={carDetailStyles.form}>
                                <div className={carDetailStyles.grid2}>
                                    <div>
                                        <label className={carDetailStyles.formLabel}>Pick-up Date</label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'pickupDate')}>
                                            <FaCalendarAlt className={carDetailStyles.inputIcon} />
                                            <input
                                                type="date"
                                                name="pickupDate"
                                                min={today}
                                                required
                                                className={carDetailStyles.inputField}
                                                onFocus={() => handleFocus('pickupDate')}
                                                onBlur={handleBlur}
                                                onChange={handleInputChange}
                                                value={formData.pickupDate}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={carDetailStyles.formLabel}>Return Date</label>
                                        <div className={carDetailStyles.inputContainer(activeField === 'returnDate')}>
                                            <FaCalendarAlt className={carDetailStyles.inputIcon} />
                                            <input
                                                type="date"
                                                name="returnDate"
                                                min={formData.pickupDate || today}
                                                required
                                                className={carDetailStyles.inputField}
                                                onFocus={() => handleFocus('returnDate')}
                                                onBlur={handleBlur}
                                                onChange={handleInputChange}
                                                value={formData.returnDate}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className={carDetailStyles.formLabel}>Pick-up Location</label>
                                    <div className={carDetailStyles.inputContainer(activeField === 'pickupLocation')}>
                                        <FaMapMarkerAlt className={carDetailStyles.inputIcon} />
                                        <input
                                            type="text"
                                            name="pickupLocation"
                                            placeholder="Enter location"
                                            required
                                            className={carDetailStyles.textInputField}
                                            onFocus={() => handleFocus('pickupLocation')}
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            value={formData.pickupLocation}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className={carDetailStyles.inputContainer(activeField === 'name')}>
                                        <FaUser className={carDetailStyles.inputIcon} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Full Name"
                                            required
                                            className={carDetailStyles.textInputField}
                                            onFocus={() => handleFocus('name')}
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            value={formData.name}
                                        />
                                    </div>

                                    <div className={carDetailStyles.inputContainer(activeField === 'email')}>
                                        <FaEnvelope className={carDetailStyles.inputIcon} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            required
                                            className={carDetailStyles.textInputField}
                                            onFocus={() => handleFocus('email')}
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            value={formData.email}
                                        />
                                    </div>

                                    <div className={carDetailStyles.inputContainer(activeField === 'phone')}>
                                        <FaPhone className={carDetailStyles.inputIcon} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            required
                                            className={carDetailStyles.textInputField}
                                            onFocus={() => handleFocus('phone')}
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            value={formData.phone}
                                        />
                                    </div>
                                </div>

                                <div className={carDetailStyles.priceBreakdown}>
                                    <div className={carDetailStyles.priceRow}>
                                        <span>Base Price</span>
                                        <span>₹{car.price} / day</span>
                                    </div>
                                    <div className={carDetailStyles.totalRow}>
                                        <span>Estimated Total</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                </div>

                                <button type="submit" className={carDetailStyles.submitButton}>
                                    Confirm &amp; proceed to payment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarDetail