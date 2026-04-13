# Frontend Migration Guide - From Dummy Data to Real API

This guide helps you migrate your existing frontend components from using dummy data (localStorage and hardcoded arrays) to using the real backend API.

## Migration Checklist

- [ ] Update Cars.jsx to fetch from API
- [ ] Update CarDetailPage.jsx to fetch car details
- [ ] Update Cars component to fetch car listings
- [ ] Update ManageCars.jsx (admin) to fetch/manage cars
- [ ] Update MyBookingsPage.jsx to fetch real bookings
- [ ] Create admin Bookings management page
- [ ] Create admin Reports page
- [ ] Update payment flow to persist data
- [ ] Update FleetContext to use API instead of localStorage
- [ ] Remove dummy data files (optional cleanup)

---

## Step-by-Step Migration

### 1. Update Cars.jsx (Browse All Cars)

**Before (Using Dummy Data):**
```javascript
import carsData from '../assets/carsData';

export default function Cars() {
  return (
    <div>
      {carsData.map((car) => (
        <div key={car.id}>{car.name}</div>
      ))}
    </div>
  );
}
```

**After (Using API):**
```javascript
import { useState, useEffect } from 'react';
import { getCars } from '../lib/api';
import { toast } from 'react-toastify';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const { data } = await getCars({ availability: true });
        setCars(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <div>Loading cars...</div>;

  return (
    <div>
      {cars.map((car) => (
        <div key={car._id}>{car.name}</div>
      ))}
    </div>
  );
}
```

### 2. Update CarDetailPage.jsx

**Before:**
```javascript
const { carId } = useParams();
const car = carsData.find(c => c.id === carId);
// Problem: carId from URL might not match dummy data IDs
```

**After:**
```javascript
import { getCarById } from '../lib/api';

export default function CarDetailPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const { data } = await getCarById(carId);
        setCar(data);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    if (carId) fetchCar();
  }, [carId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div>
      <h1>{car.name}</h1>
      <p>Price: ₹{car.price}/day</p>
      <BookingForm car={car} />
    </div>
  );
}
```

### 3. Update Booking Form

**Before (Storing in localStorage):**
```javascript
const handleBooking = (formData) => {
  const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
  bookings.push(formData);
  localStorage.setItem('userBookings', JSON.stringify(bookings));
  // Problem: Data lost on browser clear, no persistence
};
```

**After (Using Backend API):**
```javascript
import { createBooking, updatePaymentStatus } from '../lib/api';

const handleBooking = async (formData) => {
  try {
    setLoading(true);
    
    // Create booking on backend
    const { data: booking } = await createBooking({
      userId: currentUser._id,
      carId: car._id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      totalPrice: formData.totalPrice,
      notes: formData.notes
    });

    // Proceed to payment
    navigate(`/payment/${booking._id}`);
    
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Update MyBookingsPage.jsx

**Before (Using localStorage):**
```javascript
const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
```

**After (Using API):**
```javascript
import { getUserBookings, cancelBooking } from '../lib/api';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await getUserBookings(currentUser._id);
        setBookings(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser._id) fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, 'User cancelled');
      setBookings(bookings.filter(b => b._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.carId.name}</h3>
          <p>Status: {booking.status}</p>
          <p>Payment: {booking.paymentStatus}</p>
          <button onClick={() => handleCancel(booking._id)}>
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 5. Update AdminManageCars.jsx

**Before (Using FleetContext):**
```javascript
const { cars, addCar, deleteCar, updateCar } = useContext(FleetContext);
// Problem: Changes only saved to localStorage, not database
```

**After (Using API):**
```javascript
import { getCars, addCar, updateCar, deleteCar } from '../lib/api';

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await getCars();
        setCars(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Add car
  const handleAddCar = async (carData) => {
    try {
      const { data: newCar } = await addCar(carData);
      setCars([...cars, newCar]);
      toast.success('Car added successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update car
  const handleUpdateCar = async (carId, updates) => {
    try {
      const { data: updatedCar } = await updateCar(carId, updates);
      setCars(cars.map(c => c._id === carId ? updatedCar : c));
      toast.success('Car updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete car
  const handleDeleteCar = async (carId) => {
    if (window.confirm('Delete this car?')) {
      try {
        await deleteCar(carId);
        setCars(cars.filter(c => c._id !== carId));
        toast.success('Car deleted successfully');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <table>
      <tbody>
        {cars.map(car => (
          <tr key={car._id}>
            <td>{car.name}</td>
            <td>{car.price}</td>
            <td>{car.availability ? 'Available' : 'Booked'}</td>
            <td>
              <button onClick={() => setEditCar(car)}>Edit</button>
              <button onClick={() => handleDeleteCar(car._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 6. Create Admin Bookings Management Page

**New File: admin/src/components/ManageBookings.jsx**
```javascript
import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../lib/api';
import { toast } from 'react-toastify';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '' });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getAllBookings({
        ...(filters.status && { status: filters.status })
      });
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { data: updated } = await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b._id === bookingId ? updated : b));
      toast.success(`Booking updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2>Manage Bookings</h2>
      
      <div>
        <label>Filter by Status:</label>
        <select 
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Car</th>
            <th>Dates</th>
            <th>Price</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking.bookingId}</td>
              <td>{booking.userId.name}</td>
              <td>{booking.carId.name}</td>
              <td>{booking.startDate} to {booking.endDate}</td>
              <td>₹{booking.totalPrice}</td>
              <td>{booking.status}</td>
              <td>{booking.paymentStatus}</td>
              <td>
                <select 
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                >
                  <option value="">Change Status</option>
                  <option value="confirmed">Confirm</option>
                  <option value="ongoing">Start</option>
                  <option value="completed">Complete</option>
                  <option value="cancelled">Cancel</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 7. Create Admin Reports Page

**New File: admin/src/components/Reports.jsx**
```javascript
import { useState } from 'react';
import { 
  getBookingReport, 
  getVehicleReport, 
  getSummaryReport 
} from '../../lib/api';
import { toast } from 'react-toastify';

export default function Reports() {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleSummary = async () => {
    try {
      setLoading(true);
      const { data: summary } = await getSummaryReport();
      setReports({ summary });
      setActiveTab('summary');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleReport = async () => {
    try {
      setLoading(true);
      const { summary, vehicleStats } = await getVehicleReport();
      setReports({ vehicleSummary: summary, vehicleStats });
      setActiveTab('vehicle');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingReport = async () => {
    try {
      setLoading(true);
      const { report, bookings } = await getBookingReport();
      setReports({ bookingReport: report, bookings });
      setActiveTab('booking');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reports & Analytics</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleSummary}>Summary</button>
        <button onClick={handleVehicleReport}>Vehicle Stats</button>
        <button onClick={handleBookingReport}>Bookings</button>
      </div>

      {loading ? (
        <div>Loading report...</div>
      ) : activeTab === 'summary' && reports.summary ? (
        <div>
          <h3>System Summary</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Revenue</h4>
              <p>₹{reports.summary.financial.totalRevenue}</p>
            </div>
            <div className="stat-card">
              <h4>Total Bookings</h4>
              <p>{reports.summary.bookings.totalBookings}</p>
            </div>
            <div className="stat-card">
              <h4>Occupancy Rate</h4>
              <p>{reports.summary.metrics.occupancyRate}%</p>
            </div>
            <div className="stat-card">
              <h4>Fleet Size</h4>
              <p>{reports.summary.fleet.totalCars}</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'vehicle' && reports.vehicleStats ? (
        <div>
          <h3>Vehicle Statistics</h3>
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Trips</th>
                <th>Revenue</th>
                <th>Avg/Trip</th>
              </tr>
            </thead>
            <tbody>
              {reports.vehicleStats.map(car => (
                <tr key={car.carId}>
                  <td>{car.name}</td>
                  <td>{car.totalTrips}</td>
                  <td>₹{car.earning}</td>
                  <td>₹{car.averageEarningPerTrip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'booking' && reports.bookingReport ? (
        <div>
          <h3>Booking Analytics</h3>
          <div>
            <p>Total Bookings: {reports.bookingReport.totalBookings}</p>
            <p>Revenue: ₹{reports.bookingReport.totalRevenue}</p>
            <p>Completed: {reports.bookingReport.completedBookings}</p>
            <p>Cancelled: {reports.bookingReport.cancelledBookings}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
```

### 8. Handle Payment Persistence

**Update PaymentPage.jsx/PaymentSuccess.jsx:**
```javascript
import { updatePaymentStatus } from '../lib/api';

const handlePaymentSuccess = async (stripeSessionId, stripePaymentIntentId) => {
  try {
    // Update booking payment status
    await updatePaymentStatus(bookingId, 'completed', stripePaymentIntentId);
    
    // Show success message
    toast.success('Payment received! Your booking is confirmed.');
    
    // Redirect to success page
    navigate(`/payment-success/${bookingId}`);
  } catch (error) {
    toast.error('Failed to save payment: ' + error.message);
  }
};
```

---

## Testing Your Migration

### Checklist Before Full Migration
1. ✅ All new API functions are imported
2. ✅ Error handling with try-catch blocks
3. ✅ Loading states displayed
4. ✅ Token authentication working
5. ✅ Data correctly displayed in components
6. ✅ Forms submitting to backend
7. ✅ Admin pages showing correct data
8. ✅ Payment integration working

### Testing Steps
1. Clear browser localStorage: `localStorage.clear()`
2. Refresh page and test car browsing
3. Test booking creation
4. Verify booking appears in admin panel
5. Test booking cancellation
6. Check reports show correct data
7. Test admin add/edit/delete car
8. Verify all data persists after refresh

---

## Common Issues & Solutions

### Issue: 401 Unauthorized Error
**Cause:** User not logged in or token expired
**Solution:** Ensure user is logged in before accessing protected routes
```javascript
const token = localStorage.getItem('authToken');
if (!token) {
  navigate('/login');
}
```

### Issue: CORS Error
**Cause:** API URL incorrect or server not running
**Solution:** Check VITE_API_URL and ensure backend is running on port 5000

### Issue: 404 Not Found
**Cause:** Endpoint not registered on server
**Solution:** Verify all routes are registered in server.js

### Issue: Data Not Updating After API Call
**Cause:** State not updated after successful API call
**Solution:** Always update state after successful API call
```javascript
const { data: newCar } = await addCar(carData);
setCars([...cars, newCar]); // ← Update state
```

---

## Optional: Cleanup Dummy Data

Once fully migrated, you can optionally remove dummy data files:
- Delete `frontend/src/assets/carsData.js`
- Delete `frontend/src/assets/HcarsData.js`
- Update component imports accordingly

Keep testimonialdata.js as these are currently managing testimonials.

---

## Performance Tips

1. **Use useCallback** to memoize API calls:
```javascript
const fetchCars = useCallback(async () => {
  const { data } = await getCars();
  setCars(data);
}, []);
```

2. **Implement pagination** for large datasets:
```javascript
const { data, pagination } = await getCars({ page: 1, limit: 10 });
```

3. **Cache data** using a context or state management:
```javascript
const [carCache, setCarCache] = useState({});
if (carCache[carId]) return carCache[carId];
```

4. **Lazy load** images and components to reduce initial load

---

## Support

Refer to `API_INTEGRATION_GUIDE.md` for detailed API function usage examples.
