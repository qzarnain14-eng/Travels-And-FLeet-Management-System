/**
 * API URL for fetch().
 *
 * - Set `VITE_API_URL` in `frontend/.env` (e.g. http://127.0.0.1:5000) if you need a fixed backend URL.
 * - In Vite dev (`npm run dev`), paths stay relative (`/api/...`) so the dev server proxies to the backend.
 * - `npm run preview`: use `VITE_API_URL` or we fall back to http://127.0.0.1:5000 on localhost.
 */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const envBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');

  if (envBase) {
    if (envBase.endsWith('/api') && p.startsWith('/api/')) {
      return `${envBase}${p.slice(4)}`;
    }
    return `${envBase}${p}`;
  }

  if (import.meta.env.DEV) {
    return p;
  }

  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    const local =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]';
    if (local && port && port !== '5000') {
      return `http://127.0.0.1:5000${p}`;
    }
  }

  return p;
}

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Get request headers with auth token
function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
}

// ============ CAR API ============
export async function getCars(filters = {}) {
  const params = new URLSearchParams(filters);
  const url = apiUrl(`/api/cars?${params}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch cars');
  return response.json();
}

export async function getCarById(id) {
  const url = apiUrl(`/api/cars/${id}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch car');
  return response.json();
}

export async function getAvailableCars(startDate, endDate, type = null) {
  const params = new URLSearchParams({ startDate, endDate });
  if (type) params.append('type', type);
  const url = apiUrl(`/api/cars/search/available?${params}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch available cars');
  return response.json();
}

export async function addCar(carData) {
  const url = apiUrl('/api/cars');
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(carData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add car');
  }
  return response.json();
}

export async function updateCar(id, carData) {
  const url = apiUrl(`/api/cars/${id}`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(carData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update car');
  }
  return response.json();
}

export async function deleteCar(id) {
  const url = apiUrl(`/api/cars/${id}`);
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete car');
  }
  return response.json();
}

// ============ BOOKING API ============
export async function getAllBookings(filters = {}) {
  const params = new URLSearchParams(filters);
  const url = apiUrl(`/api/bookings?${params}`);
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
}

export async function getUserBookings(userId) {
  const url = apiUrl(`/api/bookings/user/${userId}`);
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch user bookings');
  return response.json();
}

export async function getBookingById(id) {
  const url = apiUrl(`/api/bookings/${id}`);
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch booking');
  return response.json();
}

export async function createBooking(bookingData) {
  const url = apiUrl('/api/bookings');
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create booking');
  }
  return response.json();
}

export async function updateBookingStatus(id, status, notes = null) {
  const url = apiUrl(`/api/bookings/${id}/status`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ status, ...(notes && { notes }) }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update booking status');
  }
  return response.json();
}

export async function updatePaymentStatus(id, paymentStatus, stripePaymentIntentId = null) {
  const url = apiUrl(`/api/bookings/${id}/payment`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(false),
    body: JSON.stringify({ paymentStatus, ...(stripePaymentIntentId && { stripePaymentIntentId }) }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update payment status');
  }
  return response.json();
}

export async function addReview(id, rating, comment) {
  const url = apiUrl(`/api/bookings/${id}/review`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ rating, comment }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add review');
  }
  return response.json();
}

export async function cancelBooking(id, reason = null) {
  const url = apiUrl(`/api/bookings/${id}/cancel`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ ...(reason && { reason }) }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel booking');
  }
  return response.json();
}

export async function addAdditionalCharges(id, description, amount, type) {
  const url = apiUrl(`/api/bookings/${id}/charges`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ description, amount, type }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add charges');
  }
  return response.json();
}

// ============ REPORT API ============
export async function getBookingReport(startDate = null, endDate = null, status = null) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (status) params.append('status', status);
  const url = apiUrl(`/api/reports/booking?${params}`);
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch booking report');
  return response.json();
}

export async function getVehicleReport() {
  const url = apiUrl('/api/reports/vehicle');
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch vehicle report');
  return response.json();
}

export async function getUserReport() {
  const url = apiUrl('/api/reports/user');
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch user report');
  return response.json();
}

export async function getSummaryReport(startDate = null, endDate = null) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const url = apiUrl(`/api/reports/summary?${params}`);
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to fetch summary report');
  return response.json();
}

export async function exportReport(type, format = 'json') {
  const params = new URLSearchParams({ type, format });
  const url = apiUrl(`/api/reports/export?${params}`);
  const response = await fetch(url, {
    headers: getHeaders(true),
  });
  if (!response.ok) throw new Error('Failed to export report');
  return response.json();
}
