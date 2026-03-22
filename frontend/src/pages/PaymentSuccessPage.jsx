import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { apiUrl } from '../lib/api';
import { Loader2, CheckCircle2 } from 'lucide-react';
import BookingStepper from '../components/BookingStepper';

function saveBookingToLocal(finalized) {
  const existing = JSON.parse(localStorage.getItem('userBookings') || '[]');
  const withoutDup = existing.filter((b) => b.id !== finalized.id);
  withoutDup.unshift(finalized);
  localStorage.setItem('userBookings', JSON.stringify(withoutDup));
  sessionStorage.removeItem('pendingBooking');
  sessionStorage.removeItem('payuLastTxnid');
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const txnid = searchParams.get('txnid');

      if (!txnid) {
        toast.error('Missing transaction reference.');
        navigate('/bookings', { replace: true });
        return;
      }

      try {
        const existingBookings = JSON.parse(
          localStorage.getItem('userBookings') || '[]'
        );
        const alreadyPaid = existingBookings.some(
          (b) =>
            b.paymentSessionId === txnid &&
            b.paymentStatus === 'paid'
        );
        if (alreadyPaid) {
          navigate('/bookings', { replace: true });
          return;
        }

        const res = await fetch(
          `${apiUrl('/api/payment/payu/result')}?txnid=${encodeURIComponent(txnid)}`
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (!data.paid) {
          throw new Error('Payment not confirmed');
        }

        let finalized = data.booking;
        if (!finalized) {
          try {
            const pending = JSON.parse(
              sessionStorage.getItem('pendingBooking') || 'null'
            );
            const lastTxn = sessionStorage.getItem('payuLastTxnid');
            if (pending && lastTxn === txnid) {
              finalized = {
                ...pending,
                paymentStatus: 'paid',
                paidAt: new Date().toISOString(),
                paymentSessionId: txnid,
                paymentProvider: 'payu',
                cancelled: false,
              };
            }
          } catch {
            /* ignore */
          }
        }

        if (!finalized) {
          toast.error('Booking data was lost. Please contact support.');
          navigate('/cars', { replace: true });
          return;
        }

        saveBookingToLocal(finalized);

        setStatus('done');
        toast.success('Payment successful! Your booking is confirmed.');
        setTimeout(() => navigate('/bookings', { replace: true }), 1200);
      } catch (e) {
        if (!cancelled) {
          toast.error(e.message || 'Could not verify payment');
          navigate('/payment', { replace: true });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <div className="w-full max-w-lg mb-10">
          <BookingStepper step={3} />
        </div>
        {status === 'verifying' ? (
          <>
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-white text-lg font-medium">Confirming payment…</p>
            <p className="text-gray-400 text-sm mt-2 text-center max-w-md">
              Please wait while we confirm your PayU payment.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-white text-xl font-semibold">Booking confirmed</p>
            <p className="text-gray-400 text-sm mt-2">Taking you to My Bookings…</p>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
