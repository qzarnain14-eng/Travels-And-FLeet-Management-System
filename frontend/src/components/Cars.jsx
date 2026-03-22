import React from 'react'
import { carPageStyles } from '../assets/dummyStyles'
import carsData from '../assets/carsData'
import { FaShieldAlt, FaTachometerAlt, FaUserFriends } from 'react-icons/fa'
import { FaGasPump } from 'react-icons/fa'
import { FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Cars = () => {


    const navigate = useNavigate();

    return (
        <div className={carPageStyles.pageContainer}>

            {/* MAIN CONTENT */}

            <div className={carPageStyles.contentContainer}>
                <div className={carPageStyles.headerContainer}>
                    <div className={carPageStyles.headerDecoration} />
                    <h1 className={carPageStyles.title}>Premium Cars Collection</h1>
                    <p className={carPageStyles.subtitle}>
                        Discover our premium collection of cars and find the perfect one for your needs.
                    </p>
                </div>

                <div className={carPageStyles.gridContainer}>
                    {carsData.map((car) => (
                        <div key={car.id} className={carPageStyles.carCard}>
                            <div className={carPageStyles.glowEffect} />

                            <div className={carPageStyles.imageContainer}>
                                <img src={car.image} alt={car.name} className={carPageStyles.carImage}
                                />
                                <div className={carPageStyles.priceBadge}> ₹{car.price}/day</div>
                            </div>

                            <div className={carPageStyles.cardContent}>
                                <div className={carPageStyles.headerRow}>
                                    <div>
                                        <h3 className={carPageStyles.carName}>
                                            {car.name}
                                        </h3>
                                        <p className={carPageStyles.carType}>{car.type}</p>
                                    </div>
                                </div>

                                <div className={carPageStyles.specsGrid}>
                                    <div className={carPageStyles.specItem}>
                                        <div className={carPageStyles.specIconContainer}>
                                            <FaUserFriends className="text-sky-400" />
                                        </div>
                                        <span> {car.seats} Seats </span>
                                    </div>

                                    <div className={carPageStyles.specItem}>
                                        <div className={carPageStyles.specIconContainer}>
                                            <FaGasPump className="text-amber-400" />
                                        </div>
                                        <span> {car.fuel}</span>
                                    </div>


                                    <div className={carPageStyles.specItem}>
                                        <div className={carPageStyles.specIconContainer}>
                                            <FaTachometerAlt className="text-emerald-400" />
                                        </div>
                                        <span> {car.mileage}</span>
                                    </div>

                                    <div className={carPageStyles.specItem}>
                                        <div className={carPageStyles.specIconContainer}>
                                            <FaShieldAlt className="text-purple-400" />
                                        </div>
                                        <span> Premium </span>
                                    </div>
                                </div>

                                <button onClick={() => {
                                    const token = localStorage.getItem('authToken');
                                    if (!token) {
                                        toast.info("Please login to book your car", {
                                            position: "top-center",
                                            autoClose: 3000,
                                        });
                                        navigate('/login', { state: { from: `/car/${car.id}` } });
                                    } else {
                                        navigate(`/car/${car.id}`, { state: { car } });
                                    }
                                }} className={carPageStyles.bookButton}
                                >
                                    <span className={carPageStyles.buttonText}>
                                        Book Now
                                    </span>
                                    <FaArrowRight className={carPageStyles.buttonIcon} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={carPageStyles.decor1}></div>
                <div className={carPageStyles.decor2}></div>
            </div>
        </div>
    )
}

export default Cars