const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach user info to the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
