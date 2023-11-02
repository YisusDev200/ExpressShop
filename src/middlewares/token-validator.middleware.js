const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = require("../config");
const { UserSchema } = require("../models");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserSchema.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized, token expired, please login again");
    }
  } else {
    throw new Error("there is not token attached to the header");
  }
});

module.exports = {
  authMiddleware,
};
