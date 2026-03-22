import express from 'express';
import {
  generatePayuRequestHash,
  verifyPayuResponse,
} from '../utils/payuHash.js';

const router = express.Router();

const MIN_RUPEES = 1;

/** txnid -> booking payload (until PayU callback or expiry) */
const pendingBookings = new Map();
/** txnid -> finalized booking + meta (claimed via GET /payu/result) */
const completedPayments = new Map();

function getPayuConfig() {
  const key = process.env.PAYU_MERCHANT_KEY?.trim();
  const salt = process.env.PAYU_MERCHANT_SALT?.trim();
  const mode = (process.env.PAYU_MODE || 'test').toLowerCase();
  const action =
    mode === 'prod' || mode === 'production'
      ? 'https://secure.payu.in/_payment'
      : 'https://test.payu.in/_payment';
  return { key, salt, action };
}

function backendBaseUrl(req) {
  return (
    process.env.BACKEND_PUBLIC_URL?.replace(/\/$/, '') ||
    `http://127.0.0.1:${process.env.PORT || 5000}`
  );
}

function frontendBaseUrl() {
  return (process.env.FRONTEND_URL || 'http://localhost:5174').replace(/\/$/, '');
}

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'payment', provider: 'payu' });
});

/**
 * Start PayU: returns form POST target + fields (hash computed server-side).
 */
router.post('/payu-init', (req, res) => {
  try {
    const { booking } = req.body || {};
    if (!booking || booking.totalPrice == null) {
      return res.status(400).json({ message: 'booking with totalPrice is required' });
    }

    const { key, salt, action } = getPayuConfig();
    if (!key || !salt) {
      return res.status(500).json({
        message:
          'PayU not configured. Set PAYU_MERCHANT_KEY and PAYU_MERCHANT_SALT in backend/.env',
      });
    }

    const amountNum = Number(booking.totalPrice);
    if (!Number.isFinite(amountNum) || amountNum < MIN_RUPEES) {
      return res.status(400).json({
        message: `Amount must be at least ₹${MIN_RUPEES}`,
      });
    }

    const amount = amountNum.toFixed(2);
    const txnid = `TXN${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
    pendingBookings.set(txnid, { ...booking, payuTxnid: txnid });

    const firstname = String(booking.name || 'Customer').trim().slice(0, 60);
    const email = String(booking.email || 'customer@example.com').trim();
    const phone = String(booking.phone || '9999999999').replace(/\D/g, '').slice(0, 10) || '9999999999';
    const productinfo = 'Car rental booking';

    const base = backendBaseUrl(req);
    const surl = `${base}/api/payment/payu/callback`;
    const furl = `${base}/api/payment/payu/callback`;

    const hashParams = {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
    };
    const hash = generatePayuRequestHash(hashParams, salt);

    const fields = {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      service_provider: 'payu',
    };

    return res.json({
      action,
      fields,
      txnid,
      demo: false,
    });
  } catch (err) {
    console.error('payu-init:', err);
    return res.status(500).json({ message: err.message || 'PayU init failed' });
  }
});

/**
 * PayU redirects here via POST (application/x-www-form-urlencoded).
 */
router.post('/payu/callback', (req, res) => {
  try {
    const body = req.body;
    const { salt } = getPayuConfig();
    if (!salt) {
      return res.status(500).send('PayU salt missing');
    }

    const txnid = body.txnid;
    const status = String(body.status || '').toLowerCase();

    if (!verifyPayuResponse(body, salt)) {
      console.warn('PayU hash mismatch for txnid', txnid);
      if (txnid) pendingBookings.delete(txnid);
      const fe = frontendBaseUrl();
      return res.redirect(302, `${fe}/payment?payu=failed&reason=hash`);
    }

    const pending = pendingBookings.get(txnid);
    pendingBookings.delete(txnid);

    const fe = frontendBaseUrl();

    if (status === 'success') {
      const finalized = pending
        ? {
            ...pending,
            paymentStatus: 'paid',
            paidAt: new Date().toISOString(),
            paymentSessionId: txnid,
            payuMihpayid: body.mihpayid || '',
            paymentProvider: 'payu',
            cancelled: false,
          }
        : { __clientOnly: true, txnid };
      completedPayments.set(txnid, finalized);
      return res.redirect(
        302,
        `${fe}/payment/success?txnid=${encodeURIComponent(txnid)}&provider=payu`
      );
    }

    if (txnid) pendingBookings.delete(txnid);
    return res.redirect(302, `${fe}/payment?payu=failed`);
  } catch (err) {
    console.error('payu/callback:', err);
    const fe = frontendBaseUrl();
    return res.redirect(302, `${fe}/payment?payu=error`);
  }
});

/**
 * Fetch finalized booking once after PayU success (server-side truth).
 */
router.get('/payu/result', (req, res) => {
  const txnid = req.query.txnid;
  if (!txnid) {
    return res.status(400).json({ message: 'txnid required' });
  }
  const row = completedPayments.get(txnid);
  if (!row) {
    return res.json({ paid: false });
  }
  completedPayments.delete(txnid);
  if (row.__clientOnly) {
    return res.json({ paid: true, booking: null, txnid });
  }
  return res.json({ paid: true, booking: row });
});

/** Legacy compatibility: frontend may still call session-status */
router.get('/session-status', (req, res) => {
  const txnid = req.query.session_id || req.query.txnid;
  if (!txnid) {
    return res.status(400).json({ message: 'session_id or txnid required' });
  }
  if (completedPayments.has(txnid)) {
    return res.json({ paid: true, provider: 'payu' });
  }
  return res.json({ paid: false });
});

export default router;
