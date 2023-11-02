const { check } = require("express-validator");
const { validateResult } = require("../middlewares");

const validadorCoupon = [
  check("name")
    .notEmpty()
    .withMessage("The 'name' is required")
    .isString()
    .withMessage("The 'name' should be a string"),

  check("expiry")
    .notEmpty()
    .withMessage("The 'expiry' is required")
    .isISO8601()
    .withMessage(
      "The 'expiry' should be a valid date in ISO8601 format (e.g., '2023-10-17T21:06:46.000Z')"
    ),

  check("discount")
    .notEmpty()
    .withMessage("The 'discount' is required")
    .isInt()
    .withMessage("The 'discount' should be an integer")
    .isInt({ min: 1, max: 100 })
    .withMessage("The 'discount' should be between 1 and 99"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validadorCoupon,
};
