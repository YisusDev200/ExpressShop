const jwt = require("jsonwebtoken");

const { JWT_SECRET, AUTH_TOKEN_EXPIRATION } = require("../config");

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: AUTH_TOKEN_EXPIRATION,
  });
};
module.exports = { generateToken };
