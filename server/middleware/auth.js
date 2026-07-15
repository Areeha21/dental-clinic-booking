const jwt = require('jsonwebtoken');

// Checks that a valid token was sent with the request.
// Any route using this middleware requires the user to be logged in.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      data: {},
    });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>" -> just the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now available in every controller after this: req.user.id, req.user.role
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token',
      data: {},
    });
  }
};

// Use AFTER `protect` on any route only admins should access
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied — admin only',
      data: {},
    });
  }
  next();
};

module.exports = { protect, isAdmin };
