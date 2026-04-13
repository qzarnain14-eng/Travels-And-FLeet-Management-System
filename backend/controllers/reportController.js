import Booking from '../models/bookingModel.js';
import Car from '../models/carModel.js';
import User from '../models/userModel.js';

// Generate booking report
export const getBookingReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .populate('carId', 'name brand model licensePlate')
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const completedBookings = bookings.filter((b) => b.status === 'completed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

    res.status(200).json({
      success: true,
      report: {
        totalBookings,
        totalRevenue,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      },
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate vehicle report
export const getVehicleReport = async (req, res) => {
  try {
    const cars = await Car.find();

    const vehicleStats = await Promise.all(
      cars.map(async (car) => {
        const bookings = await Booking.find({ carId: car._id });
        const completedTrips = bookings.filter((b) => b.status === 'completed').length;
        const earning = bookings
          .filter((b) => b.status === 'completed')
          .reduce((sum, b) => sum + b.totalPrice, 0);

        return {
          carId: car._id,
          name: car.name,
          brand: car.brand,
          model: car.model,
          licensePlate: car.licensePlate,
          availability: car.availability,
          totalTrips: bookings.length,
          completedTrips,
          cancelledTrips: bookings.filter((b) => b.status === 'cancelled').length,
          earning,
          averageEarningPerTrip: completedTrips > 0 ? earning / completedTrips : 0,
        };
      })
    );

    const totalCars = cars.length;
    const availableCars = cars.filter((c) => c.availability).length;
    const totalTrips = await Booking.countDocuments();
    const totalEarnings = vehicleStats.reduce((sum, car) => sum + car.earning, 0);

    res.status(200).json({
      success: true,
      summary: {
        totalCars,
        availableCars,
        unavailableCars: totalCars - availableCars,
        totalTrips,
        totalEarnings,
      },
      vehicleStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate user report
export const getUserReport = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    const userStats = await Promise.all(
      users.map(async (user) => {
        const bookings = await Booking.find({ userId: user._id });
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter((b) => b.status === 'completed').length;
        const totalSpend = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || 'N/A',
          totalBookings,
          completedBookings,
          cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
          totalSpend,
          averageSpendPerBooking: totalBookings > 0 ? totalSpend / totalBookings : 0,
          lastBookingDate: bookings.length > 0 ? bookings[bookings.length - 1].createdAt : null,
        };
      })
    );

    const totalUsers = users.length;
    const activeUsers = userStats.filter((u) => u.totalBookings > 0).length;
    const totalRevenue = userStats.reduce((sum, u) => sum + u.totalSpend, 0);

    res.status(200).json({
      success: true,
      summary: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalRevenue,
      },
      userStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate summary report
export const getSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const bookings = await Booking.find(filter);
    const cars = await Car.find();
    const users = await User.find();

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const completedBookings = bookings.filter((b) => b.status === 'completed').length;
    const ongoingBookings = bookings.filter((b) => b.status === 'ongoing').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

    // Calculate occupancy rate
    const totalAvailableSpots = cars.length * 30; // Assuming 30 days per month
    const occupiedSpots = bookings
      .filter((b) => b.status === 'ongoing' || b.status === 'completed')
      .reduce((sum, b) => sum + b.numberOfDays, 0);
    const occupancyRate = totalAvailableSpots > 0 ? (occupiedSpots / totalAvailableSpots) * 100 : 0;

    const summaryReport = {
      periodStart: startDate || 'All time',
      periodEnd: endDate || 'Present',
      fleet: {
        totalCars: cars.length,
        availableCars: cars.filter((c) => c.availability).length,
      },
      users: {
        totalUsers: users.length,
        activeUsers: users.length, // Would need booking history
      },
      bookings: {
        totalBookings: bookings.length,
        completedBookings,
        ongoingBookings,
        cancelledBookings,
        pendingBookings: bookings.filter((b) => b.status === 'pending').length,
      },
      financial: {
        totalRevenue,
        averageBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
      },
      metrics: {
        occupancyRate: occupancyRate.toFixed(2),
        bookingCompletionRate:
          bookings.length > 0 ? ((completedBookings / bookings.length) * 100).toFixed(2) : 0,
      },
    };

    res.status(200).json({
      success: true,
      data: summaryReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Export report as PDF or JSON
export const exportReport = async (req, res) => {
  try {
    const { type, format } = req.query; // type: booking, vehicle, user, summary

    let reportData;

    switch (type) {
      case 'booking':
        const bookings = await Booking.find()
          .populate('userId', 'name email')
          .populate('carId', 'name brand');
        reportData = {
          reportType: 'Booking Report',
          generatedAt: new Date(),
          data: bookings,
        };
        break;

      case 'vehicle':
        const cars = await Car.find();
        reportData = {
          reportType: 'Vehicle Report',
          generatedAt: new Date(),
          data: cars,
        };
        break;

      case 'user':
        const users = await User.find().select('-password');
        reportData = {
          reportType: 'User Report',
          generatedAt: new Date(),
          data: users,
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type',
        });
    }

    if (format === 'json') {
      res.status(200).json({
        success: true,
        data: reportData,
      });
    } else {
      // For now, just return JSON. PDF export would require additional library like pdfkit
      res.status(200).json({
        success: true,
        message: 'PDF export not yet implemented. Use format=json',
        data: reportData,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
