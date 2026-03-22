import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET?.trim();

export default async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  const token = header.slice(7);
  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'JWT_SECRET missing in .env' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
