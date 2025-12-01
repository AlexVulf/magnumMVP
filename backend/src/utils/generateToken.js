const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

module.exports = generateToken;
