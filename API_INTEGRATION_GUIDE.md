# API Integration Guide - Quick Reference

This guide shows how to use the new API functions in your frontend components.

## Getting Started

### 1. Import API Functions
```javascript
import { 
  getCars, 
  getCarById, 
  createBooking, 
  getUserBookings,
  updatePaymentStatus,
  getBookingReport 
} from '../lib/api';
```

### 2. Authentication
The API automatically includes the JWT token from localStorage in the Authorization header. Users must be logged in first.

---

## CAR API Examples

### Get All Cars (with filters)
```javascript
// Simple fetch
const { data: cars } = await getCars();

// With filters
const { data: cars } = await getCars({
  type: 'suv',
  brand: 'Toyota',
  maxPrice: 5000,
  availability: true,
  search: 'Toyota Fortuner'
});
```

### Get Single Car
```javascript
try {
  const { data: car } = await getCarById('car_id_here');
  console.log(car);
} catch (error) {
  console.error(error.message);
}
```

### Get Available Cars for Date Range
```javascript
const { data: availableCars } = await getAvailableCars(
  '2024-04-15',
  '2024-04-20',
  'suv'  // optional filter by type
);
```

### Add Car (Admin Only)
```javascript
try {
  const carData = {
    name: 'BMW X5',
    brand: 'BMW',
    model: 'X5',
    type: 'suv',
    year: 2024,
    price: 8000,
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 7,
    features: ['4WD', 'Sunroof', 'Navigation'],
    imageUrl: 'https://...',
    description: 'Luxury SUV with all features'
  };
  
  const { data: newCar } = await addCar(carData);
  console.log('Car added:', newCar._id);
} catch (error) {
  console.error(error.message);
}
```

### Update Car (Admin Only)
```javascript
try {
  const updates = {
    price: 7500,
    availability: false,
    mileage: 15000
  };
  
  const { data: updatedCar } = await updateCar('car_id', updates);
  console.log('Car updated:', updatedCar);
} catch (error) {
  console.error(error.message);
}
```

### Delete Car (Admin Only)
```javascript
try {
  const { data: deletedCar } = await deleteCar('car_id');
  console.log('Car deleted:', deletedCar.name);
} catch (error) {
  console.error(error.message);
}
```

---

## BOOKING API Examples

### Get User's Bookings
```javascript
try {
  const { data: bookings } = await getUserBookings(userId);
  
  bookings.forEach(booking => {
    console.log(`
      Booking: ${booking.bookingId}
      Car: ${booking.carId.name}
      Dates: ${booking.startDate} to ${booking.endDate}
      Status: ${booking.status}
      Price: ₹${booking.totalPrice}
    `);
  });
} catch (error) {
  console.error(error.message);
}
```

### Get Booking Details
```javascript
try {
  const { data: booking } = await getBookingById('booking_id');
  
  console.log('Booking Details:');
  console.log(`- ID: ${booking.bookingId}`);
  console.log(`- Car: ${booking.carId.name} (${booking.carId.licensePlate})`);
  console.log(`- Customer: ${booking.userId.name}`);
  console.log(`- Period: ${booking.numberOfDays} days`);
  console.log(`- Price: ₹${booking.totalPrice}`);
  console.log(`- Status: ${booking.status}`);
  console.log(`- Payment: ${booking.paymentStatus}`);
} catch (error) {
  console.error(error.message);
}
```

### Create New Booking
```javascript
try {
  const bookingData = {
    userId: 'user_id',
    carId: 'car_id',
    startDate: '2024-04-15',
    endDate: '2024-04-20',
    pickupLocation: 'Airport Terminal 1',
    dropoffLocation: 'Hotel Downtown',
    totalPrice: 40000,
    specialRequests: 'Need GPS and extra luggage space',
    insurance: {
      included: true,
      type: 'comprehensive',
      cost: 2000
    }
  };
  
  const { data: newBooking } = await createBooking(bookingData);
  console.log('Booking created:', newBooking.bookingId);
  console.log('Stripe Session:', newBooking.stripeSessionId);
} catch (error) {
  console.error(error.message);
}
```

### Update Booking Status (Admin)
```javascript
try {
  const { data: updatedBooking } = await updateBookingStatus(
    'booking_id',
    'confirmed',  // Status: pending, confirmed, ongoing, completed, cancelled
    'Admin confirmed - vehicle ready'  // Optional notes
  );
  console.log(`Booking ${updatedBooking.bookingId} is now ${updatedBooking.status}`);
} catch (error) {
  console.error(error.message);
}
```

### Update Payment Status
```javascript
// When Stripe payment succeeds:
try {
  const { data: updatedBooking } = await updatePaymentStatus(
    'booking_id',
    'completed',
    'pi_1234567890'  // Stripe Payment Intent ID
  );
  console.log('Payment recorded:', updatedBooking.paymentStatus);
} catch (error) {
  console.error(error.message);
}
```

### Add Booking Review
```javascript
try {
  const { data: updatedBooking } = await addReview(
    'booking_id',
    5,  // Rating 1-5
    'Excellent service! Car was clean and in perfect condition.'
  );
  console.log('Review added:', updatedBooking.review);
} catch (error) {
  console.error(error.message);
}
```

### Cancel Booking (User)
```javascript
try {
  const { data: cancelledBooking } = await cancelBooking(
    'booking_id',
    'Need to cancel due to schedule change'  // Reason
  );
  console.log('Booking cancelled:', cancelledBooking.bookingId);
} catch (error) {
  console.error(error.message);
}
```

### Add Additional Charges (Admin)
```javascript
try {
  const { data: updatedBooking } = await addAdditionalCharges(
    'booking_id',
    'Fuel surcharge',
    1500,
    'fuel'  // Type: damage, fuel, extra_km, other
  );
  console.log('Charges added. New total: ₹' + updatedBooking.totalPrice);
} catch (error) {
  console.error(error.message);
}
```

---

## REPORT API Examples

### Get Booking Report (Admin)
```javascript
try {
  const { report, bookings } = await getBookingReport(
    '2024-01-01',     // Start date (optional)
    '2024-04-30',     // End date (optional)
    'completed'       // Filter by status (optional)
  );
  
  console.log('Booking Analytics:');
  console.log(`- Total Bookings: ${report.totalBookings}`);
  console.log(`- Total Revenue: ₹${report.totalRevenue}`);
  console.log(`- Completed: ${report.completedBookings}`);
  console.log(`- Cancelled: ${report.cancelledBookings}`);
  console.log(`- Average Value: ₹${report.averageBookingValue}`);
} catch (error) {
  console.error(error.message);
}
```

### Get Vehicle Report (Admin)
```javascript
try {
  const { summary, vehicleStats } = await getVehicleReport();
  
  console.log('Fleet Summary:');
  console.log(`- Total Cars: ${summary.totalCars}`);
  console.log(`- Available: ${summary.availableCars}`);
  console.log(`- Total Trips: ${summary.totalTrips}`);
  console.log(`- Total Earnings: ₹${summary.totalEarnings}`);
  
  vehicleStats.forEach(car => {
    console.log(`
      ${car.name} (${car.licensePlate}):
      - Trips: ${car.totalTrips}
      - Completed: ${car.completedTrips}
      - Earnings: ₹${car.earning}
    `);
  });
} catch (error) {
  console.error(error.message);
}
```

### Get User Report (Admin)
```javascript
try {
  const { summary, userStats } = await getUserReport();
  
  console.log('User Statistics:');
  console.log(`- Total Users: ${summary.totalUsers}`);
  console.log(`- Active Users: ${summary.activeUsers}`);
  console.log(`- Total Revenue: ₹${summary.totalRevenue}`);
  
  // Find top customers
  const topCustomers = userStats
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);
  
  console.log('Top 5 Customers:');
  topCustomers.forEach(user => {
    console.log(`- ${user.name}: ₹${user.totalSpend}`);
  });
} catch (error) {
  console.error(error.message);
}
```

### Get Summary Report (Admin)
```javascript
try {
  const { data: summary } = await getSummaryReport(
    '2024-01-01',
    '2024-03-31'
  );
  
  console.log('System Summary:');
  console.log(`Period: ${summary.periodStart} to ${summary.periodEnd}`);
  console.log(`\nFleet:`);
  console.log(`  Total Cars: ${summary.fleet.totalCars}`);
  console.log(`  Available: ${summary.fleet.availableCars}`);
  console.log(`\nBookings:`);
  console.log(`  Total: ${summary.bookings.totalBookings}`);
  console.log(`  Completed: ${summary.bookings.completedBookings}`);
  console.log(`  Cancelled: ${summary.bookings.cancelledBookings}`);
  console.log(`\nFinancial:`);
  console.log(`  Total Revenue: ₹${summary.financial.totalRevenue}`);
  console.log(`  Average Booking: ₹${summary.financial.averageBookingValue}`);
  console.log(`\nMetrics:`);
  console.log(`  Occupancy Rate: ${summary.metrics.occupancyRate}%`);
} catch (error) {
  console.error(error.message);
}
```

### Export Report (Admin)
```javascript
try {
  const { data: reportData } = await exportReport('booking', 'json');
  
  // Download as file
  const dataStr = JSON.stringify(reportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', 'booking_report.json');
  link.click();
} catch (error) {
  console.error(error.message);
}
```

---

## Error Handling Best Practice

```javascript
try {
  const result = await getCars();
  // Process result
} catch (error) {
  console.error('Error:', error.message);
  // Show toast notification
  toast.error(error.message);
}
```

---

## React Hooks Pattern

### Use Effect Hook for Fetching Cars
```javascript
import { useEffect, useState } from 'react';
import { getCars } from '../lib/api';

export function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const { data } = await getCars({ availability: true });
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <div>Loading cars...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {cars.map(car => (
        <div key={car._id}>{car.name}</div>
      ))}
    </div>
  );
}
```

### Use State for Booking Form
```javascript
import { useState } from 'react';
import { createBooking } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function BookingForm({ carId, userId }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    totalPrice: 0
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: booking } = await createBooking({
        userId,
        carId,
        ...formData
      });
      // Navigate to payment page
      navigate(`/payment/${booking._id}`);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Common Response Format

All API functions return responses in this format:

```javascript
{
  success: true | false,
  message: "Success or error message",
  data: { /* actual data */ } | null,
  
  // For reports:
  report: { /* report data */ } | null,
  bookings: [ /* booking data */ ] | null
}
```

When destructuring, typically use:
```javascript
const { data } = await getCars();
// or
const { success, data, message } = await getCars();
```
