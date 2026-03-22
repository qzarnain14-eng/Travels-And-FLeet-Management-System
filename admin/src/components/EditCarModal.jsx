import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AddCarPageStyles, bookStyles } from '../assets/dummyStyles';
import { X } from 'lucide-react';

const SEAT_OPTIONS = ['2', '3', '4', '5', '6', '7', '8'];

function carToForm(car) {
  if (!car) return null;
  return {
    carName: car.name || '',
    dailyPrice: car.price != null ? String(car.price) : '',
    seats: car.seats || '5',
    fuelType: car.fuelType || 'Petrol',
    mileage: car.mileage || '',
    transmission: car.transmission || 'Automatic',
    year: car.year || '',
    model: car.model || '',
    description: car.description || '',
    category: car.category || 'Sedan',
    imagePreview: car.imageUrl || null,
    image: null,
  };
}

const EditCarModal = ({ car, onClose, onSave }) => {
  const fileRef = useRef(null);
  const [data, setData] = useState(() => carToForm(car));

  useEffect(() => {
    setData(carToForm(car));
  }, [car]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const applyImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
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

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyImageFile(e.dataTransfer.files?.[0]);
    },
    [applyImageFile]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data) return;
    onSave(data);
  };

  if (!car || !data) return null;

  return (
    <div
      className={bookStyles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-car-title"
      onClick={onClose}
    >
      <div
        className={`${bookStyles.modalContainer} rounded-2xl border border-gray-800 bg-gray-900/98 backdrop-blur-md p-6 sm:p-8 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 id="edit-car-title" className="text-2xl font-bold text-white">
              Edit vehicle
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Update details and save changes to your fleet.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={AddCarPageStyles.formGrid}>
            <div className={AddCarPageStyles.formColumn}>
              <div>
                <label className={AddCarPageStyles.label}>Car Name</label>
                <input
                  name="carName"
                  value={data.carName}
                  onChange={handleChange}
                  className={AddCarPageStyles.input}
                  required
                />
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Daily Price ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    $
                  </span>
                  <input
                    name="dailyPrice"
                    value={data.dailyPrice}
                    onChange={handleChange}
                    className={AddCarPageStyles.inputWithPrefix}
                    inputMode="decimal"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Seats</label>
                <select
                  name="seats"
                  value={data.seats}
                  onChange={handleChange}
                  className={AddCarPageStyles.select}
                >
                  {SEAT_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} seats
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Fuel Type</label>
                <select
                  name="fuelType"
                  value={data.fuelType}
                  onChange={handleChange}
                  className={AddCarPageStyles.select}
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                  <option>CNG</option>
                </select>
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Mileage (MPG)</label>
                <input
                  name="mileage"
                  value={data.mileage}
                  onChange={handleChange}
                  className={AddCarPageStyles.input}
                />
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Category</label>
                <select
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  className={AddCarPageStyles.select}
                >
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
                <select
                  name="transmission"
                  value={data.transmission}
                  onChange={handleChange}
                  className={AddCarPageStyles.select}
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Year</label>
                <input
                  name="year"
                  value={data.year}
                  onChange={handleChange}
                  className={AddCarPageStyles.input}
                />
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Model</label>
                <input
                  name="model"
                  value={data.model}
                  onChange={handleChange}
                  className={AddCarPageStyles.input}
                />
              </div>
              <div>
                <label className={AddCarPageStyles.label}>Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                  className={AddCarPageStyles.textarea}
                  rows={5}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={AddCarPageStyles.label}>Car Image</label>
            <div className={AddCarPageStyles.imageUploadContainer}>
              <label
                className={AddCarPageStyles.imageUploadLabel}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
              >
                {data.imagePreview ? (
                  <img
                    src={data.imagePreview}
                    alt=""
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ) : (
                  <div className={AddCarPageStyles.imageUploadPlaceholder}>
                    <div className={AddCarPageStyles.imageUploadText}>
                      Click to upload or drag and drop
                    </div>
                    <div className={AddCarPageStyles.imageUploadSubText}>
                      PNG, JPG up to 5MB
                    </div>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-gray-300 bg-gray-800/80 border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className={AddCarPageStyles.submitButton}>
              <span className={AddCarPageStyles.buttonText}>Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarModal;
