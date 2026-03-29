import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      toast.success('Payment Successful! Your booking is being processed.');

      try {
        const pending = sessionStorage.getItem('pendingBooking');
        if (pending) {
          const booking = JSON.parse(pending);
          booking.paymentStatus = 'paid';
          booking.paidAt = new Date().toISOString();
          booking.paymentSessionId = sessionId;
          booking.paymentProvider = 'stripe';

          const existing = JSON.parse(localStorage.getItem('userBookings') || '[]');
          const alreadyExists = existing.some((item) => item.id === booking.id);
          const updated = alreadyExists ? existing.map((item) => (item.id === booking.id ? booking : item)) : [booking, ...existing];

          localStorage.setItem('userBookings', JSON.stringify(updated));
          sessionStorage.removeItem('pendingBooking');
        }
      } catch (e) {
        console.error('Error saving booking after payment success:', e);
      }
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-40 pb-20 px-4 text-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
        <p className="text-gray-400 text-lg mb-12">
          Thank you for choosing us. Your car rental booking has been confirmed.
          We have sent the receipt to your email.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/bookings')}
            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold transition-all"
          >
            View My Bookings
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
