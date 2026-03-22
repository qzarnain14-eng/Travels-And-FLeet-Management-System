import React, { useState } from 'react'
import { signupStyles } from '../assets/dummyStyles'
import { useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaChevronRight, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import logo from '../assets/logocar.png'



const SignUp = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isActive] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!acceptedTerms) {
            return toast.error('Please accept terms & Conditions', { theme: 'dark' })
        }

        toast.success('Account created successfully! Welcome to PremiumDrive', {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
            onClose: () => navigate('/login')
        });
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



    return (
        <div className={signupStyles.pageContainer}>
            {/* Animated Background */}
            <div className={signupStyles.animatedBackground.base}>
                <div
                    className={`${signupStyles.animatedBackground.orb1} ${isActive
                        ? "translate-x-10 sm:translate-x-20 translate-y-5 sm:translate-y-10"
                        : ""
                        }`}
                ></div>
                <div
                    className={`${signupStyles.animatedBackground.orb2} ${isActive
                        ? "-translate-x-10 sm:-translate-x-20 -translate-y-5 sm:-translate-y-10"
                        : ""
                        }`}
                ></div>
                <div
                    className={`${signupStyles.animatedBackground.orb3} ${isActive
                        ? "-translate-x-5 sm:-translate-x-10 translate-y-10 sm:translate-y-20"
                        : ""
                        }`}
                ></div>
            </div>

            <Link to="/" className={signupStyles.backButton}>
                <FaArrowLeft className="text-xs sm:text-sm group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-xs sm:text-sm">Back to Home</span>
            </Link>

            <div className={`${signupStyles.signupCard.container}${isActive ?
                'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
            >
                <div className={signupStyles.signupCard.card}
                    style={{
                        boxShadow: "0 15px 35px rgba(0,0,0,0,2)",
                        borderRadius: "24px",
                    }}
                >
                    <div className={signupStyles.signupCard.decor1} />
                    <div className={signupStyles.signupCard.decor2} />

                    <div className={signupStyles.signupCard.headerContainer}>
                        <div className={signupStyles.signupCard.logoContainer}>
                            <div className={signupStyles.signupCard.logoText}>
                                <img src={logo} alt="logo" className="h-[1.2em] w-auto block object-contain" style={{
                                    display: "block",
                                }}
                                />
                                <span className="font-bold tracking-wider text-white mt-1">
                                    Travels and Fleet Management System
                                </span>
                            </div>
                        </div>
                        <h1 className={signupStyles.signupCard.title}>
                            Join PremiumDrive
                        </h1>
                        <p className={signupStyles.signupCard.subtitle}>
                            Create Your Exclusive Account
                        </p>
                    </div>

                    {/* FORM */}

                    <form onSubmit={handleSubmit} className={signupStyles.form.container}>
                        <div className={signupStyles.form.inputContainer}>
                            <div className={signupStyles.form.inputWrapper}>
                                <div className={signupStyles.form.inputIcon}>
                                    <FaUser className="text-sm sm:text-base" />
                                </div>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={signupStyles.form.input}
                                    placeholder="Full Name" required style={{ borderRadius: '16px' }}
                                />
                            </div>
                        </div>

                        <div className={signupStyles.form.inputContainer}>
                            <div className={signupStyles.form.inputWrapper}>
                                <div className={signupStyles.form.inputIcon}>
                                    <FaEnvelope className="text-sm sm:text-base" />
                                </div>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={signupStyles.form.input}
                                    placeholder="Email Address" required style={{ borderRadius: '16px' }}
                                />
                            </div>
                        </div>

                        <div className={signupStyles.form.inputContainer}>
                            <div className={signupStyles.form.inputWrapper}>
                                <div className={signupStyles.form.inputIcon}>
                                    <FaLock className="text-sm sm:text-base" />
                                </div>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={signupStyles.form.input}
                                    placeholder="Create Password" required style={{ borderRadius: '16px' }}
                                />

                                <div onClick={togglePasswordVisibility} className={signupStyles.form.passwordToggle}>
                                    {showPassword ? <FaEyeSlash className="text-sm sm:text-base" /> : (<FaEye className="text-sm sm:text-base" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TNC*/}
                        <div className="flex items-start mt-2 sm:mt-3 md:mt-4 lg:mt-5">
                            <div className='flex items-center h-5 mt-0.5 sm:mt-1 md:mt-1.5 lg:mt-2'>
                                <input type="checkbox" name="terms" id="terms" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)}
                                    className={signupStyles.form.checkbox}
                                    style={{ boxShadow: "none" }}
                                />
                            </div>

                            <div className="ml-2 sm:ml-3 text-xs sm:text-sm md:text-base lg:text-lg">
                                <label htmlFor="terms" className={signupStyles.form.checkboxLabel}>
                                    I agree to the <span className={signupStyles.form.checkboxLink}>
                                        Terms and Conditions
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            style={{
                                borderRadius: '16px',
                                boxShadow: "0 5px 15px rgba(8,90,20,0.6)",
                            }}
                            type="submit" className={signupStyles.form.submitButton}>
                            <span className={signupStyles.form.buttonText}>
                                <FaCheck className="text-white text-sm sm:text-base md:text-lg" />
                                CREATE ACCOUNT
                            </span>
                            <div className={signupStyles.form.buttonHover} />
                        </button>
                    </form>

                    <div
                        style={{
                            borderColor: "rgba(255,255,255,0.06)",
                        }}
                        className={signupStyles.signinSection}>
                        <p className={signupStyles.signinText}>Already have an Account</p>
                        <a href="/login" className={signupStyles.signinButton}
                            style={{
                                borderRadius: '16px',
                                boxShadow: "0 2px 10px rgba(245,124,0,0.08)",
                            }}
                        >
                            LOGIN TO YOUR ACCOUNT
                        </a>
                    </div>
                </div>
            </div>




            {/* Font Import */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Montserrat', sans-serif; }
        `}
            </style>
        </div >
    )
}

export default SignUp
