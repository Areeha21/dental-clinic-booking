const jwt = require('jsonwebtoken');

// Creates a signed token containing the user's id and role.
// The frontend stores this and sends it back on every request
// that needs to know "who is logged in".
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // token stays valid for 7 days
  );
};

module.exports = generateToken;
