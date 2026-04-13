import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => 'BK' + Date.now(),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropoffLocation: {
      type: String,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'wallet', 'cash'],
      default: 'stripe',
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    insurance: {
      included: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        enum: ['basic', 'premium', 'comprehensive'],
        default: 'basic',
      },
      cost: {
        type: Number,
        default: 0,
      },
    },
    additionalCharges: [
      {
        description: String,
        amount: Number,
        type: {
          type: String,
          enum: ['damage', 'fuel', 'extra_km', 'other'],
        },
      },
    ],
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      createdAt: Date,
    },
  },
  { timestamps: true }
);

// Calculate number of days before saving
bookingSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
