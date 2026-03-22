import React, { useMemo, useState } from 'react';
import { AddCarPageStyles } from '../assets/dummyStyles';
import { Car, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFleet } from '../context/FleetContext.jsx';
import EditCarModal from './EditCarModal.jsx';

const CATEGORIES = [
  'All Categories',
  'Sedan',
  'SUV',
  'Sports',
  'Coupe',
  'Hatchback',
  'Luxury',
];

const ManageCars = () => {
  const { cars, removeCar, updateCar } = useFleet();
  const [category, setCategory] = useState('All Categories');
  const [editingCar, setEditingCar] = useState(null);

  const handleRemove = (car) => {
    if (
      !window.confirm(
        `Remove "${car.name}" from your fleet? This cannot be undone.`
      )
    ) {
      return;
    }
    removeCar(car.id);
    if (editingCar?.id === car.id) setEditingCar(null);
    toast.success(`"${car.name}" removed from your fleet.`);
  };

  const handleSaveEdit = (formData) => {
    if (!editingCar) return;
    updateCar(editingCar.id, formData);
    toast.success('Vehicle updated successfully.');
    setEditingCar(null);
  };

  const filtered = useMemo(() => {
    if (category === 'All Categories') return cars;
    return cars.filter((c) => c.category === category);
  }, [cars, category]);

  const showAllCars = () => setCategory('All Categories');

  return (
    <>
      {editingCar && (
        <EditCarModal
          car={editingCar}
          onClose={() => setEditingCar(null)}
          onSave={handleSaveEdit}
        />
      )}
    <div className={AddCarPageStyles.pageContainer}>
      <div className={AddCarPageStyles.fixedBackground}>
        <div className={AddCarPageStyles.gradientBlob1}></div>
        <div className={AddCarPageStyles.gradientBlob2}></div>
        <div className={AddCarPageStyles.gradientBlob3}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className={`${AddCarPageStyles.headerContainer} pt-20`}>
          <div className={AddCarPageStyles.headerDivider}>
            <div className={AddCarPageStyles.headerDividerLine}></div>
          </div>
          <h1 className={AddCarPageStyles.title}>
            <span className={AddCarPageStyles.titleGradient}>Fleet Management</span>
          </h1>
          <p className={AddCarPageStyles.subtitle}>
            Manage your entire fleet, track bookings, and monitor vehicle status in
            real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-orange-900/20 to-amber-900/10 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Cars</h3>
            <p className="text-4xl font-bold text-orange-400">{cars.length}</p>
          </div>
          <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm flex flex-col justify-center">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" />
              Filter by Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={AddCarPageStyles.select}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-orange-900/30 to-amber-900/30 flex items-center justify-center mb-6">
              <Car className="w-10 h-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-medium text-white">No cars found</h3>
            <p className="mt-2 text-gray-400">
              {cars.length === 0
                ? 'List a car from Add Car to see it here.'
                : 'Try adjusting your filter criteria.'}
            </p>
            {cars.length > 0 && (
              <button
                type="button"
                onClick={showAllCars}
                className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold hover:from-orange-500 hover:to-amber-500 transition-all"
              >
                Show All Cars
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car) => (
              <div
                key={car.id}
                className="p-4 rounded-2xl border border-gray-800 bg-gray-900/40"
              >
                <div className="h-40 bg-gradient-to-br from-orange-900/10 to-amber-900/10 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">Image</span>
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg">{car.name}</h3>
                <p className="text-sm text-gray-400">
                  {car.model} • {car.year}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-orange-400 font-bold">
                    ${Number(car.price).toFixed(2)}/day
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCar(car)}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-orange-700/40 to-amber-700/40 text-orange-200 hover:from-orange-600/50 hover:to-amber-600/50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(car)}
                      className="px-3 py-1 rounded-lg bg-red-700/30 text-red-200 hover:bg-red-700/50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ManageCars;
