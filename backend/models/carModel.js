import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a car name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide a model'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['sedan', 'suv', 'van', 'truck', 'convertible', 'coupe'],
      required: [true, 'Please specify car type'],
    },
    year: {
      type: Number,
      required: [true, 'Please provide year'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide rental price per day'],
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'hybrid', 'electric'],
      default: 'petrol',
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      default: 'automatic',
    },
    seats: {
      type: Number,
      default: 5,
      min: 1,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    features: [String],
    imageUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    licensePlate: {
      type: String,
      unique: true,
      sparse: true,
    },
    insurance: {
      provider: String,
      expiryDate: Date,
      policyNumber: String,
    },
    maintenance: {
      lastServiceDate: Date,
      nextServiceDate: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Car = mongoose.model('Car', carSchema);

export default Car;
