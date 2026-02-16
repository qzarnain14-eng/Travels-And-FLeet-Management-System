import React, { useState } from 'react'
import { contactPageStyles } from '../assets/dummyStyles'
import { FaMapMarkedAlt, FaWhatsapp, FaEnvelope, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { FaUser, FaPhone, FaCar, FaStar } from 'react-icons/fa';


const Contact = () => {

    const styles = contactPageStyles;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        carType: "",
        message: "",
    });
    const [activeField, setActiveField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFocus = (field) => {
        setActiveField(field);
    };

    const handleBlur = () => {
        setActiveField(null);
    };

    //   WHATSAPP API

    const handleSubmit = (e) => {
        e.preventDefault();
        const whatsappMessage =
            `Name: ${formData.name}%0A` +
            `Email: ${formData.email}%0A` +
            `Phone: ${formData.phone}%0A` +
            `Car Type: ${formData.carType}%0A` +
            `Message: ${formData.message}`;
        window.open(`https://wa.me/+916354581007?text=${whatsappMessage}`, '_blank');

        setFormData({ name: '', email: '', phone: '', carType: '', message: '' });
    };



    return (
        <div className={styles.container}>
            <div className={styles.diamondPattern}>
                <div className="w-full h-full" style={{
                    backgroundImage: `
            linear-gradient(30deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
            linear-gradient(150deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
            linear-gradient(30deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
            linear-gradient(150deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
            linear-gradient(60deg, rgba(234,88,12,0.08) 25%, transparent 25.5%, transparent 75%, rgba(234,88,12,0.08) 75%, rgba(234,88,12,0.08)),
            linear-gradient(60deg, rgba(234,88,12,0.08) 25%, transparent 25.5%, transparent 75%, rgba(234,88,12,0.08) 75%, rgba(234,88,12,0.08))`,
                    backgroundSize: '80px 140px',
                    backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
                }}></div>
            </div>

            {/* FLOATING PARTICLES */}

            <div className={styles.floatingTriangles}>
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.triangle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#fb923c' : '#fdba74',
                            transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`
                        }}
                    ></div>
                ))}
            </div>

            {/* TITLE   */}
            <div className={styles.content}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>
                        Contact Our Team
                    </h1>
                    <div className={styles.divider} />
                    <p className={styles.subtitle}>
                        Have questions about our fleet? Our team is ready to assist with your car rental needs.
                    </p>
                </div>
            </div>

            <div className={styles.cardContainer}>
                <div className={styles.infoCard}>
                    <div className={styles.infoCardCircle1}></div>
                    <div className={styles.infoCardCircle2}></div>

                    <div className="relative z-10 space-y-5">
                        <h2 className={styles.infoTitle}>
                            <FaMapMarkedAlt className={styles.infoIcon} />Our Information
                        </h2>

                        <div className={styles.infoItemContainer}>
                            {[
                                { icon: FaWhatsapp, label: 'WhatsApp', value: '+916354581007', color: 'bg-green-900/30' },
                                { icon: FaEnvelope, label: 'Email', value: 'anushayadav441@gmail.com', color: 'bg-orange-900/30' },
                                { icon: FaClock, label: 'Hours', value: 'Mon-Sat: 8AM-8PM', color: 'bg-orange-900/30' },
                            ].map((info, i) => (
                                <div key={i} className={styles.infoItem}>
                                    <div className={styles.iconContainer(info.color)}>
                                        <info.icon className={i === 0 ? 'text-green-500 text-lg' : 'text-orange-400 text-lg'}
                                        />
                                    </div>
                                    <div>
                                        <h3 className={styles.infoLabel}>
                                            {info.label}
                                        </h3>
                                        <p className={styles.infoValue}>
                                            {info.value}
                                            {i === 2 && <span className="block text-grey-500">
                                                Sunday: 10AM-6PM
                                            </span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.offerContainer}>
                            <div className="flex items-center">
                                <FaCalendarAlt className={styles.offerIcon} />
                                <span className={styles.offerTitle}>Special Offers!</span>
                            </div>
                            <p className={styles.offerText}>
                                Book for 3+ days and get 10% discount
                            </p>
                        </div>
                    </div>
                </div>

                {/* FORM CARD */}
                <div className={styles.formCard}>
                    <div className={styles.formCircle1}></div>
                    <div className={styles.formCircle2}></div>

                    <div className="mb-4">
                        <h2 className={styles.formTitle}>
                            <IoIosSend className={styles.infoIcon} /> Send Your Inquiry
                        </h2>
                        <p className={styles.formSubtitle}>Fill out the form and we'll get back to you promptly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGrid}>
                            {['name', 'email', 'phone', 'carType'].map((field) => {
                                const icons = {
                                    name: FaUser,
                                    email: FaEnvelope,
                                    phone: FaPhone,
                                    carType: FaCar
                                };

                                const placeholders = {
                                    name: 'Full Name',
                                    email: 'Email Address',
                                    phone: 'Phone Number',
                                    carType: 'Select Car Type'
                                };

                                return (
                                    <div key={field} className={styles.inputContainer}>
                                        <div className={styles.inputIcon}>
                                            {React.createElement(icons[field])}
                                        </div>

                                        {field !== 'carType' ? (
                                            <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                                                name={field}
                                                value={formData[field]} onChange={handleChange} onFocus={() => handleFocus(field)} onBlur={handleBlur}
                                                required placeholder={placeholders[field]} className={styles.input(activeField === field)} />
                                        ) : (
                                            <select name="carType" value={formData.carType} onChange={handleChange}
                                                onFocus={() => handleFocus(field)} onBlur={handleBlur} required
                                                className={styles.select(activeField === field)}>
                                                <option value="" className="bg-gray-800">Select Car Type</option>
                                                {['Economy',
                                                    'SUV',
                                                    'Luxury',
                                                    'Van',
                                                    'Sports Car',
                                                    'Convertible'
                                                ].map((option) => (
                                                    <option value={option} key={option} className="bg-gray-800 cursor-pointer">
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                )
                            })}

                            <div className={styles.inputContainer + " md:col-span-2"}>
                                <div className={styles.textareaIcon}>
                                    <FaStar className="text-orange-400" />
                                </div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('message')}
                                    onBlur={handleBlur}
                                    required
                                    placeholder="Your Message"
                                    className={styles.textarea(activeField === 'message')}
                                    rows="3"
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Send via WhatsApp <FaWhatsapp className={styles.whatsappIcon} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact