import React, { useState, useRef, useCallback } from 'react';
import { AddCarPageStyles, toastStyles } from '../assets/dummyStyles';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:5000';
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const AddCar = () => {
    const initialFormData = {
        carName: "",
        dailyPrice: "",
        seats: "",
        fuelType: "Petrol",
        mileage: "",
        transmission: "Automatic",
        year: "",
        model: "",
        description: "",
        category: "Sedan",
        image: null,
        imagePreview: null,
    };

    const [data, setData] = useState(initialFormData);
    const FileRef = useRef(null);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }, []);
    // For IMG HANDLING
    const handleImageChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) =>
            setData((prev) => ({
                ...prev,
                image: file,
                imagePreview: evt.target.result,
            }));
        reader.readAsDataURL(file);
    }, []);

    const resetfrom = useCallback(() => {
        setData(initialFormData);
        if (FileRef.current) FileRef.current.value = '';
    }, [initialFormData]);


    const showToast = useCallback((type, title, message, icon) => {
        const toastConfig = {
            position: "top-right",
            className: toastStyles[type].container,
            bodyClassName: toastStyles[type].body,
        };

        if (type === "success") {
            toastConfig.autoClose = 3000;
        } else {
            toastConfig.autoClose = 4000;
        }

        toast[type](
            <div className="flex items-center">
                {icon}
                <div>
                    <p
                        className={
                            type === "success" ? "font-bold text-lg" : "font-semibold"
                        }
                    >
                        {title}
                    </p>
                    <p>{message}</p>
                </div>
            </div>,
            toastConfig
        );
    }, []);





    return (
        <div className={AddCarPageStyles.pageContainer}>
            {/* Background Decorations */}
            <div className={AddCarPageStyles.fixedBackground}>
                <div className={AddCarPageStyles.gradientBlob1}></div>
                <div className={AddCarPageStyles.gradientBlob2}></div>
                <div className={AddCarPageStyles.gradientBlob3}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                <div className={AddCarPageStyles.headerContainer}>
                    <div className={AddCarPageStyles.headerDivider}>
                        <div className={AddCarPageStyles.headerDividerLine}></div>
                    </div>
                    <h1 className={AddCarPageStyles.title}>
                        <span className={AddCarPageStyles.titleGradient}>Add Your Car</span>
                    </h1>
                    <p className={AddCarPageStyles.subtitle}>
                        share your vehicle with the world and start earning today.
                    </p>
                </div>
                <div className={AddCarPageStyles.formContainer}>
                    <form onSubmit={handleSubmit} className={AddCarPageStyles.form}>
                        <div className={AddCarPageStyles.formGrid}>
                            <div className={AddCarPageStyles.formColumn}>

                            </div>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddCar;
