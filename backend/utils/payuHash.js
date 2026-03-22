import crypto from 'crypto';

/**
 * PayU India request hash (web checkout).
 * @see https://docs.payu.in/docs/hashing-request-and-response
 */
export function generatePayuRequestHash(params, salt) {
  const key = params.key;
  const txnid = params.txnid;
  const amount = params.amount;
  const productinfo = params.productinfo;
  const firstname = params.firstname;
  const email = params.email;
  const udf1 = params.udf1 ?? '';
  const udf2 = params.udf2 ?? '';
  const udf3 = params.udf3 ?? '';
  const udf4 = params.udf4 ?? '';
  const udf5 = params.udf5 ?? '';

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Reverse hash for PayU response (regular integration, no additional_charges).
 */
export function verifyPayuResponse(body, salt) {
  const key = body.key ?? '';
  const txnid = body.txnid ?? '';
  const amount = body.amount ?? '';
  const productinfo = body.productinfo ?? '';
  const firstname = body.firstname ?? '';
  const email = body.email ?? '';
  const status = body.status ?? '';
  const udf1 = body.udf1 ?? '';
  const udf2 = body.udf2 ?? '';
  const udf3 = body.udf3 ?? '';
  const udf4 = body.udf4 ?? '';
  const udf5 = body.udf5 ?? '';
  const receivedHash = body.hash ?? body.ihash ?? '';

  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculated = crypto.createHash('sha512').update(hashString).digest('hex');
  return String(receivedHash).toLowerCase() === calculated;
}
