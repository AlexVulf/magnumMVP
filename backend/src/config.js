require('dotenv').config();

const config = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
};

module.exports = config;
