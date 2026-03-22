import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiUrl } from '../lib/api';
import { ShieldCheck, Lock, CreditCard, Smartphone, Wallet, Loader2 } from 'lucide-react';
import BookingStepper from '../components/BookingStepper';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromState = location.state?.booking;
    if (fromState) {
      setBooking(fromState);
      sessionStorage.setItem('pendingBooking', JSON.stringify(fromState));
      return;
    }
    try {
      const raw = sessionStorage.getItem('pendingBooking');
      if (raw) {
        setBooking(JSON.parse(raw));
        return;
      }
    } catch {
      /* ignore */
    }
    toast.error('No booking to pay for.');
    navigate('/cars', { replace: true });
  }, [location.state, navigate]);

  const submitToPayu = () => {
    if (!booking) return;
    setLoading(true);
    fetch(apiUrl('/api/payment/payu-init'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking,
        clientOrigin: window.location.origin,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            data.message ||
              (res.status === 404
                ? 'Payment API not found. Run backend (npm start in backend) on port 5000.'
                : 'Could not start PayU')
          );
        }
        const { action, fields } = data;
        if (!action || !fields) {
          throw new Error('Invalid PayU response');
        }
        sessionStorage.setItem('payuLastTxnid', data.txnid || '');
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = action;
        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = String(value ?? '');
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      })
      .catch((e) => {
        const msg =
          e instanceof TypeError && String(e.message).includes('fetch')
            ? 'Cannot reach the API. Start the backend (npm start in backend).'
            : e.message || 'Payment failed';
        toast.error(msg);
        setLoading(false);
      });
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-4 max-w-2xl mx-auto w-full">
        <div className="mb-10">
          <BookingStepper step={2} />
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
            <ShieldCheck className="w-5 h-5" />
            Secure checkout via PayU India
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Complete payment
          </h1>
          <p className="text-gray-400">
            You will be redirected to PayU to pay with cards, UPI, net banking, and
            wallets supported by PayU.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Booking summary</h2>
          <div className="space-y-2 text-gray-300 text-sm">
            <div className="flex justify-between">
              <span>Vehicle</span>
              <span className="text-white font-medium">{booking.carName}</span>
            </div>
            <div className="flex justify-between">
              <span>Rental period</span>
              <span className="text-white">
                {booking.days} day{booking.days !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pickup</span>
              <span className="text-white">
                {new Date(booking.pickupDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Return</span>
              <span className="text-white">
                {new Date(booking.returnDate).toLocaleDateString()}
              </span>
            </div>
            <div className="border-t border-gray-600 my-4 pt-4 flex justify-between items-center">
              <span className="text-gray-400">Total due</span>
              <span className="text-2xl font-bold text-orange-400">
                ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700/80 bg-gray-900/40 p-5 mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Supported on PayU India
          </p>
          <div className="flex flex-wrap gap-4 text-gray-300">
            <span className="inline-flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-orange-400" /> Visa, Mastercard,
              RuPay
            </span>
            <span className="inline-flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4 text-green-400" /> UPI
            </span>
            <span className="inline-flex items-center gap-2 text-sm">
              <Wallet className="w-4 h-4 text-blue-400" /> Net banking &amp; wallets
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={submitToPayu}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg hover:from-orange-500 hover:to-amber-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Opening PayU…
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Pay securely with PayU
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-3 py-3 text-gray-400 hover:text-white text-sm"
        >
          Back to booking details
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentPage;
