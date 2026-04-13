import Booking from '../models/bookingModel.js';
import Car from '../models/carModel.js';
import User from '../models/userModel.js';

// Get all bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const { status, paymentStatus, userId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (userId) filter.userId = userId;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .populate('carId', 'name brand model licensePlate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId })
      .populate('carId', 'name brand model imageUrl licensePlate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone address')
      .populate('carId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      notes,
      specialRequests,
      insurance,
    } = req.body;

    // Validation
    if (!userId || !carId || !startDate || !endDate || !pickupLocation || !dropoffLocation || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past',
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      carId,
      status: { $in: ['pending', 'confirmed', 'ongoing'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newBooking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      notes,
      specialRequests,
      insurance,
    });

    const populatedBooking = await newBooking.populate('carId').populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking status',
      });
    }

    const validStatuses = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, ...(notes && { notes }) },
      { new: true, runValidators: true }
    ).populate('carId').populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, stripePaymentIntentId } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide payment status',
      });
    }

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        ...(stripePaymentIntentId && { stripePaymentIntentId }),
      },
      { new: true, runValidators: true }
    ).populate('carId').populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add review to booking
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        review: {
          rating,
          comment,
          createdAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).populate('carId').populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'ongoing' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an ongoing or completed booking',
      });
    }

    booking.status = 'cancelled';
    if (reason) booking.notes = `Cancelled: ${reason}`;

    await booking.save();

    const updatedBooking = await booking.populate('carId').populate('userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add additional charges to booking
export const addAdditionalCharges = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type } = req.body;

    if (!description || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.additionalCharges.push({ description, amount, type });
    booking.totalPrice += amount;

    await booking.save();

    const updatedBooking = await booking.populate('carId').populate('userId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Additional charges added successfully',
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
