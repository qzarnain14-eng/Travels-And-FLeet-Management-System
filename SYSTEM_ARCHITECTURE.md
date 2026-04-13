# Travels & Fleet Management System - Architecture Implementation Guide

This document describes the complete system architecture based on the diagram you provided, and the current implementation status.

## System Overview

The system consists of four main modules:

```
┌─────────────────────────────────────────────────────────┐
│         Travels & Fleet Management System              │
├──────────────┬──────────────┬──────────────┬────────────┤
│    ADMIN     │     USER     │   VEHICLE    │   REPORT   │
│   MODULE     │   MODULE     │   MODULE     │   MODULE   │
└──────────────┴──────────────┴──────────────┴────────────┘
```

## ✅ Implemented Components

### 1. DATABASE MODELS

#### Car Model (`backend/models/carModel.js`)
```javascript
{
  name: String,                    // Car name
  brand: String,                   // Brand
  model: String,                   // Model
  type: Enum,                      // sedan, suv, van, truck, convertible, coupe
  year: Number,                    // Year
  price: Number,                   // Rental price per day
  availability: Boolean,           // Available for booking
  fuelType: Enum,                  // petrol, diesel, hybrid, electric
  transmission: Enum,              // manual, automatic
  seats: Number,                   // Number of seats
  mileage: Number,                 // Current mileage
  features: [String],              // List of features
  imageUrl: String,                // Car image URL
  description: String,             // Car description
  licensePlate: String,            // Unique license plate
  insurance: {                      // Insurance details
    provider: String,
    expiryDate: Date,
    policyNumber: String
  },
  maintenance: {                    // Maintenance tracking
    lastServiceDate: Date,
    nextServiceDate: Date
  },
  createdBy: ObjectId,             // Admin who added car
  timestamps: true                 // Created/updated dates
}
```

#### Booking Model (`backend/models/bookingModel.js`)
```javascript
{
  bookingId: String,               // Unique booking ID (BK + timestamp)
  userId: ObjectId,                // User who booked
  carId: ObjectId,                 // Car booked
  startDate: Date,                 // Rental start date
  endDate: Date,                   // Rental end date
  pickupLocation: String,          // Pickup location
  dropoffLocation: String,         // Dropoff location
  numberOfDays: Number,            // Calculated automatically
  totalPrice: Number,              // Total rental price
  status: Enum,                    // pending, confirmed, ongoing, completed, cancelled
  paymentStatus: Enum,             // pending, completed, failed, refunded
  paymentMethod: Enum,             // stripe, wallet, cash
  stripeSessionId: String,         // Stripe session ID
  stripePaymentIntentId: String,   // Stripe payment intent ID
  insurance: {                     // Insurance options
    included: Boolean,
    type: Enum,                    // basic, premium, comprehensive
    cost: Number
  },
  additionalCharges: [{            // Extra charges
    description: String,
    amount: Number,
    type: Enum                     // damage, fuel, extra_km, other
  }],
  review: {                        // Booking review/rating
    rating: Number,                // 1-5
    comment: String,
    createdAt: Date
  },
  notes: String,                   // Admin notes
  specialRequests: String,         // Customer special requests
  timestamps: true
}
```

#### User Model (Updated - `backend/models/userModel.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,                   // NEW
  address: String,                 // NEW
  role: Enum,                      // NEW - 'user' or 'admin'
  isAdmin: Boolean,                // NEW - Admin flag
  profileImage: String,            // NEW
  timestamps: true
}
```

### 2. BACKEND CONTROLLERS

#### Car Controller (`backend/controllers/carController.js`)
Functions:
- `getCars(filters)` - Get all cars with optional filters
- `getCarById(id)` - Get single car details
- `getAvailableCars(startDate, endDate, type)` - Get available cars for date range
- `addCar(data)` - Add new car (Admin only)
- `updateCar(id, data)` - Update car details (Admin only)
- `deleteCar(id)` - Delete car (Admin only)

#### Booking Controller (`backend/controllers/bookingController.js`)
Functions:
- `getAllBookings(filters)` - Get all bookings (Admin)
- `getUserBookings(userId)` - Get user's bookings
- `getBookingById(id)` - Get booking details
- `createBooking(data)` - Create new booking
- `updateBookingStatus(id, status)` - Update booking status
- `updatePaymentStatus(id, status, stripeId)` - Update payment status
- `addReview(id, rating, comment)` - Add booking review
- `cancelBooking(id, reason)` - Cancel booking
- `addAdditionalCharges(id, description, amount, type)` - Add charges

#### Report Controller (`backend/controllers/reportController.js`)
Functions:
- `getBookingReport(startDate, endDate, status)` - Booking analytics
- `getVehicleReport()` - Vehicle fleet statistics
- `getUserReport()` - User activity statistics
- `getSummaryReport(startDate, endDate)` - Overview report
- `exportReport(type, format)` - Export reports as JSON/PDF

### 3. BACKEND ROUTES

#### Car Routes (`backend/routes/carRoutes.js`)
```
GET    /api/cars                    # List cars (public)
GET    /api/cars/search/available   # Available cars (public)
GET    /api/cars/:id                # Car details (public)
POST   /api/cars                    # Add car (admin)
PUT    /api/cars/:id                # Update car (admin)
DELETE /api/cars/:id                # Delete car (admin)
```

#### Booking Routes (`backend/routes/bookingRoutes.js`)
```
GET    /api/bookings                # All bookings (admin)
GET    /api/bookings/user/:userId   # User bookings (auth)
GET    /api/bookings/:id            # Booking details (auth)
POST   /api/bookings                # Create booking (auth)
PUT    /api/bookings/:id/status     # Update status (admin)
PUT    /api/bookings/:id/payment    # Update payment
PUT    /api/bookings/:id/review     # Add review (auth)
PUT    /api/bookings/:id/cancel     # Cancel booking (auth)
PUT    /api/bookings/:id/charges    # Add charges (admin)
```

#### Report Routes (`backend/routes/reportRoutes.js`)
```
GET    /api/reports/booking         # Booking report (admin)
GET    /api/reports/vehicle         # Vehicle report (admin)
GET    /api/reports/user            # User report (admin)
GET    /api/reports/summary         # Summary report (admin)
GET    /api/reports/export          # Export report (admin)
```

### 4. MIDDLEWARE

#### Admin Authorization (`backend/middlewares/adminAuth.js`)
- `isAdmin` - Verifies JWT token and checks admin role
- `verifyToken` - Verifies JWT token without role check

### 5. FRONTEND API HELPER

Enhanced `frontend/src/lib/api.js` with functions:

**Car APIs:**
- `getCars(filters)` - List cars
- `getCarById(id)` - Get car details
- `getAvailableCars(startDate, endDate, type)` - Available cars
- `addCar(data)` - Add car (admin)
- `updateCar(id, data)` - Update car (admin)
- `deleteCar(id)` - Delete car (admin)

**Booking APIs:**
- `getUserBookings(userId)` - User's bookings
- `getBookingById(id)` - Booking details
- `createBooking(data)` - New booking
- `updateBookingStatus(id, status)` - Update status
- `updatePaymentStatus(id, status, stripeId)` - Payment update
- `addReview(id, rating, comment)` - Add review
- `cancelBooking(id, reason)` - Cancel booking
- `addAdditionalCharges(id, desc, amount, type)` - Add charges

**Report APIs:**
- `getBookingReport(startDate, endDate, status)` - Booking report
- `getVehicleReport()` - Vehicle report
- `getUserReport()` - User report
- `getSummaryReport(startDate, endDate)` - Summary report
- `exportReport(type, format)` - Export report

## 📋 Module Descriptions

### ADMIN MODULE
**Responsibilities:**
- Manage vehicles (add, update, delete, list)
- Manage bookings (view, update status, add charges)
- Generate reports (booking, vehicle, user, summary)
- Manage testimonials

**API Endpoints:**
- POST `/api/cars` - Add vehicle
- PUT `/api/cars/:id` - Update vehicle
- DELETE `/api/cars/:id` - Delete vehicle
- GET `/api/bookings` - View all bookings
- PUT `/api/bookings/:id/status` - Update booking status
- PUT `/api/bookings/:id/charges` - Add charges
- GET `/api/reports/*` - Generate reports

### USER MODULE
**Responsibilities:**
- Register/Login
- Browse vehicles
- Create bookings
- View booking history
- Make payments
- Leave reviews

**API Endpoints:**
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/cars` - Browse cars
- POST `/api/bookings` - Create booking
- GET `/api/bookings/user/:userId` - View bookings
- PUT `/api/bookings/:id/cancel` - Cancel booking
- PUT `/api/bookings/:id/review` - Leave review

### VEHICLE MODULE
**Responsibilities:**
- Store car information
- Track availability
- Manage maintenance schedules
- Track insurance
- Store vehicle specifications

**Data:**
- Car collection in MongoDB
- Availability tracking based on bookings
- Maintenance and insurance records
- Vehicle features and specifications

### REPORT MODULE
**Responsibilities:**
- Generate booking analytics
- Fleet vehicle statistics
- User activity reports
- System summaries
- Export reports

**Report Types:**
1. **Booking Report** - Total bookings, revenue, completion rate
2. **Vehicle Report** - Fleet stats, trips per car, earnings
3. **User Report** - User activity, total spend, booking history
4. **Summary Report** - Overall system metrics, occupancy rate
5. **Export** - Download reports as JSON/PDF

## 🔄 Data Flow

### Booking Flow
```
User browses cars → Views car details → Creates booking → 
Checks availability → Confirms booking → Makes payment → 
Payment processed → Booking confirmed → Trip starts → 
Trip completes → Leaves review → Booking archived
```

### Admin Flow
```
Admin logs in → Views dashboard → Manages vehicles (add/edit/delete) → 
Views bookings → Updates booking status → Adds charges → 
Generates reports → Exports data
```

## 🔐 Authentication & Authorization

### JWT Tokens
- User receives JWT token on login/register
- Token stored in localStorage (frontend)
- Token sent with Authorization header in requests
- Token verified on protected routes

### Role-Based Access Control
```
User Routes:        require verifyToken
Admin Routes:       require isAdmin middleware
Public Routes:      no authentication needed
```

## 📊 Key Features

### 1. Car Management
- Full CRUD operations
- Availability checking
- Insurance tracking
- Maintenance scheduling
- Filter by type, brand, price

### 2. Booking System
- Date conflict checking
- Automatic day calculation
- Payment tracking
- Status workflow
- Cancellation with refund

### 3. Payment Integration
- Stripe integration
- Payment status tracking
- Multiple payment methods
- Additional charges support

### 4. Reviews & Ratings
- Booking-linked reviews
- 5-star rating system
- Review comments
- Prevents duplicate reviews

### 5. Reports & Analytics
- Real-time metrics
- Revenue tracking
- Occupancy rates
- User statistics
- Export capabilities

## 🚀 To Complete the System

### Frontend Integration (Priority)
1. Update `Cars.jsx` to fetch from `/api/cars`
2. Update `CarDetailPage.jsx` to use API
3. Connect booking form to `/api/bookings`
4. Update `MyBookingsPage.jsx` to show real bookings
5. Create admin dashboard pages
6. Integrate report viewing

### Payment Integration
1. Save Stripe payment intent ID to booking
2. Implement webhook for payment confirmation
3. Update booking status on payment success
4. Handle payment failures/refunds

### Additional Features
1. Email notifications for bookings
2. SMS reminders
3. User profile management
4. Admin dashboard UI
5. Report downloading
6. Payment receipts

### Production Deployment
1. Set up MongoDB cloud (Atlas)
2. Configure production Stripe keys
3. Set up email service
4. Configure CORS for production domains
5. Setup SSL certificates
6. Environment variables configuration

## 📝 Configuration

### Environment Variables (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

### Environment Variables (frontend/.env)
```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📚 Database Collections

1. **users** - User accounts and profiles
2. **cars** - Vehicle inventory
3. **bookings** - Booking records and payment info
4. **testimonials** - Customer reviews and testimonials

## 🔗 API Base URLs

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## 📞 Support & Questions

Refer to individual controller files for detailed function documentation and parameter requirements.
