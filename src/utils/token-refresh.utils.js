const jwt = require("jsonwebtoken");
const { REFRESH_TOKEN_EXPIRATION, JWT_SECRET } = require("../config");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};
module.exports = { generateRefreshToken };
