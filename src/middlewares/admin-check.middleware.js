const { UserSchema } = require("../models");
const asyncHandler = require("express-async-handler");

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await UserSchema.findOne({ email });
  if (adminUser.role !== "admin") throw new Error("you are not admin");
  next();
});

module.exports = { isAdmin };
