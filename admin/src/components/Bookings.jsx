import React, { useMemo, useState } from 'react';
import { AddCarPageStyles, BookingPageStyles as s } from '../assets/dummyStyles';
import { Search, Calendar } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'cancelled', label: 'Cancelled' },
];

const BOOKINGS = [];

const Bookings = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const bookings = BOOKINGS;

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = !status || b.status === status;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.email && b.email.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, status]);

  const resetFilters = () => {
    setSearch('');
    setStatus('');
  };

  return (
    <div className={AddCarPageStyles.pageContainer}>
      <div className={AddCarPageStyles.fixedBackground}>
        <div className={AddCarPageStyles.gradientBlob1}></div>
        <div className={AddCarPageStyles.gradientBlob2}></div>
        <div className={AddCarPageStyles.gradientBlob3}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className={`${s.headerContainer} pt-20`}>
          <div className={AddCarPageStyles.headerDivider}>
            <div className={AddCarPageStyles.headerDividerLine}></div>
          </div>
          <h1 className={AddCarPageStyles.title}>
            <span className={AddCarPageStyles.titleGradient}>Booking Dashboard</span>
          </h1>
          <p className={AddCarPageStyles.subtitle}>
            Manage all bookings with detailed information and status updates
          </p>
        </div>

        <div className={s.searchFilterContainer}>
          <div className={s.searchFilterGrid}>
            <div className="relative">
              <label className={s.filterLabel}>Search Bookings</label>
              <div className="relative">
                <Search className={s.filterIconContainer} size={18} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer or email..."
                  className={s.filterInput}
                />
              </div>
            </div>
            <div>
              <label className={s.filterLabel}>Filter by Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 w-full px-4 py-2.5 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value || 'all'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className={s.filterLabel}>Total Bookings</label>
              <div className={s.totalBookingsContainer}>
                <span className={s.totalBookingsValue}>{filtered.length}</span>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className={s.noBookingsContainer}>
            <div className={s.noBookingsIconContainer}>
              <div className={s.noBookingsIcon}>
                <Calendar className={s.noBookingsIconSvg} />
              </div>
            </div>
            <h3 className={s.noBookingsTitle}>No bookings found</h3>
            <p className={s.noBookingsText}>
              Try adjusting your search or filter criteria
            </p>
            <button type="button" onClick={resetFilters} className={s.noBookingsButton}>
              Reset Filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Bookings;
