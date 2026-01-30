import React from 'react'
import { testimonialStyles as styles } from '../assets/dummyStyles';
import testimonials from '../assets/Testimonialdata';
import { FaCar, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';

const Testimonial = () => {
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

                {/* TESTIMONIAL CARD */}
                <div className={styles.grid}>
                    {testimonials.map((t, index) => {
                        const IconComponent = styles.icons[index % styles.icons.length];

                        return (
                            <div
                                key={t.id}
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
                                        <span className={styles.carText}>{t.car}</span>
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Testimonial