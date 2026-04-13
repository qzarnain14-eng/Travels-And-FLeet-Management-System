import Car from '../models/carModel.js';

// Get all cars with filters
export const getCars = async (req, res) => {
  try {
    const { type, brand, maxPrice, availability, search } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (brand) filter.brand = brand;
    if (maxPrice) filter.price = { $lte: maxPrice };
    if (availability !== undefined) filter.availability = availability === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const cars = await Car.find(filter).select('-createdBy');
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single car by ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id).select('-createdBy');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add new car (Admin only)
export const addCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      type,
      year,
      price,
      fuelType,
      transmission,
      seats,
      mileage,
      features,
      imageUrl,
      description,
      licensePlate,
      insurance,
      maintenance,
    } = req.body;

    // Validation
    if (!name || !brand || !model || !type || !year || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if license plate already exists
    if (licensePlate) {
      const existingCar = await Car.findOne({ licensePlate });
      if (existingCar) {
        return res.status(400).json({
          success: false,
          message: 'License plate already in use',
        });
      }
    }

    const newCar = await Car.create({
      name,
      brand,
      model,
      type,
      year,
      price,
      fuelType,
      transmission,
      seats,
      mileage,
      features,
      imageUrl,
      description,
      licensePlate,
      insurance,
      maintenance,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      data: newCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update car (Admin only)
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if license plate is being updated and if it's unique
    if (updates.licensePlate) {
      const existingCar = await Car.findOne({
        licensePlate: updates.licensePlate,
        _id: { $ne: id },
      });
      if (existingCar) {
        return res.status(400).json({
          success: false,
          message: 'License plate already in use',
        });
      }
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete car (Admin only)
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
      data: deletedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get available cars for booking
export const getAvailableCars = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    const filter = { availability: true };
    if (type) filter.type = type;

    let availableCars = await Car.find(filter).select('-createdBy');

    // If dates are provided, check for booking conflicts
    if (startDate && endDate) {
      const Booking = require('../models/bookingModel.js').default;
      const start = new Date(startDate);
      const end = new Date(endDate);

      const bookedCars = await Booking.find({
        status: { $in: ['pending', 'confirmed', 'ongoing'] },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } },
        ],
      }).select('carId');

      const bookedCarIds = bookedCars.map((b) => b.carId.toString());
      availableCars = availableCars.filter((car) => !bookedCarIds.includes(car._id.toString()));
    }

    res.status(200).json({
      success: true,
      count: availableCars.length,
      data: availableCars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
