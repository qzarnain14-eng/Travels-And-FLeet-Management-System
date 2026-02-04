import React, { useEffect } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FaArrowLeft, FaUser } from 'react-icons/fa'
import logo from '../assets/logocar.png'
import { toast } from 'react-toastify'






const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(true);
    }, []);

    const handleChange = e => {
        setCredentials(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log('Login details', credentials);
        localStorage.setItem('authToken', 'your-authentication-token-here');

        toast.success('Login Successful! Welcome back', {
            position: 'top-right',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
            onClose: () => {
                const redirectPath = location.state?.from || '/';
                navigate(redirectPath, { replace: true });
            }
        });

    }



    return (
        <div className={loginStyles.pageContainer}>
            {/* Animated Dark Background */}
            <div className={loginStyles.animatedBackground.base}>
                <div className={`${loginStyles.animatedBackground.orb1} ${isActive ? 'translate-x-20 translate-y-10' : ''}`} />
                <div className={`${loginStyles.animatedBackground.orb2} ${isActive ? '-translate-x-20 -translate-y-10' : ''}`} />
                <div className={`${loginStyles.animatedBackground.orb3} ${isActive ? '-translate-x-10 translate-y-20' : ''}`} />
            </div>

            <a href="/" className={loginStyles.backButton}>
                <FaArrowLeft className='text-sm sm:text-base' />
                <span className='font-medium text-xs sm:text-sm'>Back to Home</span>
            </a>

            {/* LOGIN CARD */}

            <div className={`${loginStyles.loginCard.container}${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
            >
                <div className={loginStyles.loginCard.card}>
                    <div className={loginStyles.loginCard.decor1} />
                    <div className={loginStyles.loginCard.decor2} />


                    {/* HEADER */}

                    <div className={loginStyles.loginCard.headerContainer}>
                        <div className={loginStyles.loginCard.logoContainer}>
                            <div className={loginStyles.loginCard.logoText}>
                                <img src={logo} alt="logo" className='h-[1em] w-auto block '
                                    style={{
                                        display: 'block', objectFit: 'contain',
                                    }}
                                />
                                <span className='font-bold tracking-wider'>Travels and Fleet Management System</span>
                            </div>
                        </div>
                        <h1 className={loginStyles.loginCard.title}>
                            PremiumDrive
                        </h1>
                        <p className={loginStyles.loginCard.subtitle}>
                            LUXURY MOBILITY EXPERIENCE
                        </p>
                    </div>

                    {/* FORM */}

                    <form onSubmit={handleSubmit} className={loginStyles.form.container}>
                        <div className={loginStyles.form.inputContainer}>
                            <div className={loginStyles.form.inputWrapper}>
                                <div className={loginStyles.form.inputIcon}>
                                    <FaUser />
                                </div>
                                <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder='Enter Your E-MAil'
                                    required className={loginStyles.form.input}
                                />

                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login