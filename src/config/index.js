const { connectDB } = require("./connect-db");

// * Environment variables
const {
  PORT,
  JWT_SECRET,
  AUTH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  EMAIL_USER,
  EMAIL_PASS,
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
} = process.env;

module.exports = {
  connectDB,
  PORT,
  JWT_SECRET,
  AUTH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  EMAIL_USER,
  EMAIL_PASS,
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
};
