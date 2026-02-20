import React from 'react';
import { AddCarPageStyles } from '../assets/dummyStyles';

const mockCars = [
  { id: 1, name: 'Toyota Camry', model: 'Camry', year: 2022, price: 49 },
  { id: 2, name: 'Honda Civic', model: 'Civic', year: 2021, price: 42 },
  { id: 3, name: 'Ford Explorer', model: 'Explorer', year: 2023, price: 85 },
];

const ManageCars = () => {
  return (
    <div className={AddCarPageStyles.pageContainer}>
      <div className={AddCarPageStyles.fixedBackground}>
        <div className={AddCarPageStyles.gradientBlob1}></div>
        <div className={AddCarPageStyles.gradientBlob2}></div>
        <div className={AddCarPageStyles.gradientBlob3}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className={AddCarPageStyles.headerContainer}>
          <h1 className={AddCarPageStyles.title}>
            <span className={AddCarPageStyles.titleGradient}>Manage Cars</span>
          </h1>
          <p className={AddCarPageStyles.subtitle}>View, edit or remove your listed vehicles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCars.map((car) => (
            <div key={car.id} className="p-4 rounded-2xl border border-gray-800 bg-gray-900/40">
              <div className="h-40 bg-gradient-to-br from-orange-900/10 to-amber-900/10 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-gray-400">Image</span>
              </div>
              <h3 className="text-white font-semibold text-lg">{car.name}</h3>
              <p className="text-sm text-gray-400">{car.model} • {car.year}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-orange-400 font-bold">${car.price}/day</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-orange-700/40 to-amber-700/40 text-orange-200">Edit</button>
                  <button className="px-3 py-1 rounded-lg bg-red-700/30 text-red-200">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCars;
