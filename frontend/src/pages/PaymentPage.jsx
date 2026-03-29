import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingStepper from '../components/BookingStepper';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      toast.error('No booking information found');
      navigate('/cars');
    }
  }, [booking, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ bookingData: booking }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        toast.error(data.error || 'Failed to initialize payment session');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12"><BookingStepper step={2} /></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-orange-600 rounded-full"></span>
                Booking Summary
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-6 border-b border-white/10">
                  <div>
                    <h3 className="text-xl font-semibold text-orange-500">{booking.carName}</h3>
                    <p className="text-gray-400 mt-1">{booking.days} Days Rental</p>
                  </div>
                  <div className="text-right"><p className="text-2xl font-bold">₹{booking.totalPrice}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Pick-up</p>
                    <p className="text-gray-200 font-medium">{booking.pickupDate}</p>
                    <p className="text-sm text-gray-400">{booking.pickupLocation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Return</p>
                    <p className="text-gray-200 font-medium">{booking.returnDate}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4 text-sm text-gray-400">
                You will be redirected to Stripe's secure payment page to complete your transaction.
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl text-center">
              <h2 className="text-2xl font-bold mb-8 text-left">Complete Payment</h2>
              <p className="text-gray-400 mb-8 text-left">Total amount to pay:</p>
              <div className="text-5xl font-black text-orange-500 mb-12">₹{booking.totalPrice}</div>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Proceed to Secure Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
