import React, { useState, useRef, useCallback, useMemo } from 'react';
import { AddCarPageStyles, toastStyles } from '../assets/dummyStyles';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFleet } from '../context/FleetContext.jsx';

const AddCar = () => {
    const { addCar } = useFleet();
    const initialFormData = useMemo(() => ({
        carName: "",
        dailyPrice: "",
        seats: "5",
        fuelType: "Petrol",
        mileage: "",
        transmission: "Automatic",
        year: "",
        model: "",
        description: "",
        category: "Sedan",
        image: null,
        imagePreview: null,
    }), []);

    const seatOptions = useMemo(
        () => ["2", "3", "4", "5", "6", "7", "8"],
        []
    );

    const [data, setData] = useState(initialFormData);
    const FileRef = useRef(null);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }, []);
    const applyImageFile = useCallback((file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (evt) =>
            setData((prev) => ({
                ...prev,
                image: file,
                imagePreview: evt.target.result,
            }));
        reader.readAsDataURL(file);
    }, []);

    const handleImageChange = useCallback(
        (e) => {
            const file = e.target.files?.[0];
            applyImageFile(file);
        },
        [applyImageFile]
    );

    const handleImageDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            applyImageFile(file);
        },
        [applyImageFile]
    );

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





    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        addCar({ ...data });
        showToast('success', 'Listed successfully', 'Your car is ready to appear in the fleet.');
        resetfrom();
        setTimeout(() => navigate('/manage-cars'), 600);
    };

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
                        Share your vehicle with the world and start earning today
                    </p>
                </div>
                <div className={AddCarPageStyles.formContainer}>
                    <form onSubmit={handleSubmit} className={AddCarPageStyles.form}>
                        <div className={AddCarPageStyles.formGrid}>
                            <div className={AddCarPageStyles.formColumn}>
                                <div>
                                    <label className={AddCarPageStyles.label}>Car Name</label>
                                    <input name="carName" value={data.carName} onChange={handleChange} className={AddCarPageStyles.input} placeholder="e.g. Toyota Camry" />
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Daily Price ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                                        <input name="dailyPrice" value={data.dailyPrice} onChange={handleChange} className={AddCarPageStyles.inputWithPrefix} placeholder="49.99" />
                                    </div>
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Seats</label>
                                    <select name="seats" value={data.seats} onChange={handleChange} className={AddCarPageStyles.select}>
                                        {seatOptions.map((n) => (
                                            <option key={n} value={n}>{n} seats</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Fuel Type</label>
                                    <select name="fuelType" value={data.fuelType} onChange={handleChange} className={AddCarPageStyles.select}>
                                        <option>Petrol</option>
                                        <option>Diesel</option>
                                        <option>Electric</option>
                                        <option>Hybrid</option>
                                        <option>CNG</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Mileage (MPG)</label>
                                    <input name="mileage" value={data.mileage} onChange={handleChange} className={AddCarPageStyles.input} placeholder="e.g. 28" />
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Category</label>
                                    <select name="category" value={data.category} onChange={handleChange} className={AddCarPageStyles.select}>
                                        <option>Sedan</option>
                                        <option>SUV</option>
                                        <option>Sports</option>
                                        <option>Coupe</option>
                                        <option>Hatchback</option>
                                        <option>Luxury</option>
                                    </select>
                                </div>
                            </div>

                            <div className={AddCarPageStyles.formColumn}>
                                <div>
                                    <label className={AddCarPageStyles.label}>Transmission</label>
                                    <select name="transmission" value={data.transmission} onChange={handleChange} className={AddCarPageStyles.select}>
                                        <option>Automatic</option>
                                        <option>Manual</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Year</label>
                                    <input name="year" value={data.year} onChange={handleChange} className={AddCarPageStyles.input} placeholder="e.g. 2022" />
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Model</label>
                                    <input name="model" value={data.model} onChange={handleChange} className={AddCarPageStyles.input} placeholder="Model name" />
                                </div>

                                <div>
                                    <label className={AddCarPageStyles.label}>Description</label>
                                    <textarea name="description" value={data.description} onChange={handleChange} className={AddCarPageStyles.textarea} rows={5} placeholder="Describe the car for renters" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className={AddCarPageStyles.label}>Car Image</label>
                            <div className={AddCarPageStyles.imageUploadContainer}>
                                <label
                                    className={AddCarPageStyles.imageUploadLabel}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={handleImageDrop}
                                >
                                    {data.imagePreview ? (
                                        <img src={data.imagePreview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                                    ) : (
                                        <div className={AddCarPageStyles.imageUploadPlaceholder}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={AddCarPageStyles.imageUploadIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16v-2a4 4 0 014-4h2a4 4 0 014 4v2m-4 4v-4m0 0V8m0 8h.01" />
                                            </svg>
                                            <div className={AddCarPageStyles.imageUploadText}>Click to upload or drag and drop</div>
                                            <div className={AddCarPageStyles.imageUploadSubText}>PNG, JPG up to 5MB</div>
                                        </div>
                                    )}
                                    <input ref={FileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button type="button" onClick={resetfrom} className={AddCarPageStyles.buttonText + ' ' + AddCarPageStyles.submitButton + ' bg-gray-700/30 hover:bg-gray-700/40'}>Reset</button>
                            <button type="submit" className={AddCarPageStyles.submitButton}><span className={AddCarPageStyles.buttonText}>List Your Car</span></button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddCar;
