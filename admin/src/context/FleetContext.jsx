import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'tfms-admin-fleet';

const FleetContext = createContext(null);

function parsePrice(value) {
  const n = parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function FleetProvider({ children }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCars(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
    } catch {
      /* quota or private mode */
    }
  }, [cars]);

  const addCar = useCallback((formData) => {
    const car = {
      id: crypto.randomUUID(),
      name: formData.carName?.trim() || 'Unnamed vehicle',
      model: formData.model?.trim() || '',
      year: formData.year?.trim() || '',
      category: formData.category || 'Sedan',
      price: parsePrice(formData.dailyPrice),
      imageUrl: formData.imagePreview || null,
      seats: formData.seats,
      fuelType: formData.fuelType,
      mileage: formData.mileage,
      transmission: formData.transmission,
      description: formData.description,
    };
    setCars((prev) => [car, ...prev]);
  }, []);

  const updateCar = useCallback((id, formData) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          name: formData.carName?.trim() || 'Unnamed vehicle',
          model: formData.model?.trim() || '',
          year: formData.year?.trim() || '',
          category: formData.category || 'Sedan',
          price: parsePrice(formData.dailyPrice),
          imageUrl: formData.imagePreview != null ? formData.imagePreview : c.imageUrl,
          seats: formData.seats,
          fuelType: formData.fuelType,
          mileage: formData.mileage,
          transmission: formData.transmission,
          description: formData.description,
        };
      })
    );
  }, []);

  const removeCar = useCallback((id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <FleetContext.Provider value={{ cars, addCar, updateCar, removeCar }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const ctx = useContext(FleetContext);
  if (!ctx) {
    throw new Error('useFleet must be used within FleetProvider');
  }
  return ctx;
}
