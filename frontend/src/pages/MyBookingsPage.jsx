import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTrashAlt,
  FaCheckCircle,
  FaClock,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FILTER_TABS = [
  { id: 'all', label: 'All bookings' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function getBookingCategory(booking) {
  if (booking.cancelled) return 'cancelled';
  const end = new Date(booking.returnDate);
  end.setHours(23, 59, 59, 999);
  if (end < new Date()) return 'completed';
  return 'upcoming';
}

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userBookings') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings;
    return bookings.filter((b) => getBookingCategory(b) === filter);
  }, [bookings, filter]);

  const cancelBooking = (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, cancelled: true } : b
    );
    setBookings(updated);
    localStorage.setItem('userBookings', JSON.stringify(updated));
    toast.success('Booking cancelled successfully');
  };

  const badgeFor = (booking) => {
    const cat = getBookingCategory(booking);
    const map = {
      upcoming: {
        className: 'bg-amber-900/30 text-amber-400 border-amber-700',
        label: 'Upcoming',
      },
      completed: {
        className: 'bg-green-900/30 text-green-400 border-green-700',
        label: 'Completed',
      },
      cancelled: {
        className: 'bg-red-900/30 text-red-400 border-red-700',
        label: 'Cancelled',
      },
    };
    return map[cat];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      <Navbar />
      <div className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and track your car rental bookings
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    filter === tab.id
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-500'
                      : 'bg-gray-800/60 text-gray-300 border-gray-700 hover:border-orange-500/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="text-center py-16 border border-gray-700 rounded-2xl bg-gray-800/50 backdrop-blur-sm">
              <FaClock className="mx-auto text-6xl text-gray-500 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">
                No Bookings Yet
              </h2>
              <p className="text-gray-400 mb-6">
                You haven&apos;t made any bookings. Start your journey with us
                today!
              </p>
              <button
                onClick={() => navigate('/cars')}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                Explore Cars
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-gray-700 rounded-2xl bg-gray-800/50 backdrop-blur-sm">
              <p className="text-gray-400 mb-4">
                No bookings in this category. Try another filter.
              </p>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="text-orange-400 hover:underline"
              >
                Show all bookings
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((booking) => {
                const badge = badgeFor(booking);
                const cat = getBookingCategory(booking);
                return (
                  <div
                    key={booking.id}
                    className="border border-gray-700 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 hover:border-orange-500/50 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {booking.carName}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">{booking.category}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        {booking.paymentStatus === 'paid' && (
                          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                            <FaCheckCircle /> Paid
                            {booking.paidAt &&
                              ` · ${new Date(booking.paidAt).toLocaleDateString()}`}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-2 flex items-center">
                          <FaCalendarAlt className="mr-2 text-orange-400" />
                          Pickup Date
                        </p>
                        <p className="text-white font-semibold">
                          {new Date(booking.pickupDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-400 text-sm mt-4 flex items-center">
                          <FaCalendarAlt className="mr-2 text-orange-400" />
                          Return Date
                        </p>
                        <p className="text-white font-semibold">
                          {new Date(booking.returnDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-2 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-orange-400" />
                          Pickup Location
                        </p>
                        <p className="text-white font-semibold">
                          {booking.pickupLocation}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-2">Total Price</p>
                        <p className="text-3xl font-bold text-orange-400">
                          ₹{booking.totalPrice}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          ₹{booking.dailyPrice}/day × {booking.days} days
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center text-gray-400">
                        <FaEnvelope className="text-orange-400 mr-3" />
                        <span>{booking.email}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FaPhone className="text-orange-400 mr-3" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FaCheckCircle className="text-green-400 mr-3" />
                        <span>Booking ID: {booking.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-end flex-wrap">
                      <button
                        onClick={() => navigate(`/car/${booking.carId}`)}
                        className="px-6 py-2 rounded-lg border border-orange-500 text-orange-400 hover:bg-orange-500/10 transition-all"
                      >
                        View Car Details
                      </button>
                      {cat !== 'completed' && cat !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="px-6 py-2 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 transition-all flex items-center gap-2"
                        >
                          <FaTrashAlt /> Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
