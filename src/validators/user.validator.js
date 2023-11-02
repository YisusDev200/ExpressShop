const { check } = require("express-validator");
const { validateResult } = require("../middlewares");

const validateCreate = [
  check("firstname")
    .isString()
    .withMessage("firstname must be a string")
    .isLength({ min: 4 })
    .withMessage("firstname must be at least 4 characters long")
    .notEmpty()
    .withMessage("firstname is required"),
  check("lastname")
    .isString()
    .withMessage("lastname must be a string")
    .isLength({ min: 4 })
    .withMessage("lastname must be at least 4 characters long")
    .notEmpty()
    .withMessage("lastname is required"),
  check("email")
    .isEmail()
    .withMessage("The email is not valid")
    .notEmpty()
    .withMessage("email is required"),
  check("mobile")
    .isMobilePhone("es-MX", { strictMode: false })
    .withMessage("Mobile number is not valid (MX)")
    .notEmpty()
    .withMessage("mobile is required"),
  check("password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateLogin = [
  check("email")
    .isEmail()
    .withMessage("The email is not valid")
    .notEmpty()
    .withMessage("email is required"),

  check("password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateUpdatePassword = [
  check("password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .notEmpty()
    .withMessage("Password is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateForgotPasswordToken = [
  check("email")
    .isEmail()
    .withMessage("The email is not valid")
    .notEmpty()
    .withMessage("email is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateCreateCart = [
  check("cart")
    .isArray()
    .withMessage("Cart must be an array")
    .notEmpty()
    .withMessage("Cart cannot be empty")
    .custom((cart) => {
      if (cart.length === 0) {
        throw new Error("Cart cannot be empty");
      }
      for (const item of cart) {
        if (!item._id || !item.count || !item.color) {
          throw new Error(
            "Each item in the cart must have _id, count, and color"
          );
        }
      }
      return true;
    }),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateCoupon = [
  check("coupon")
    .isString()
    .withMessage("Coupon must be a string")
    .notEmpty()
    .withMessage("Coupon is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateCreateOrder = [
  check("COD")
    .isBoolean()
    .withMessage("COD must be a boolean value")
    .notEmpty()
    .withMessage("COD is required"),
  check("cuoponApplied")
    .isBoolean()
    .withMessage("cuoponApplied must be a boolean value")
    .notEmpty()
    .withMessage("cuoponApplied is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateAddAddress = [
  check("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const allowedStatusValues = [
  "Not processed",
  "Cash on Delivery",
  "processing",
  "Discaptched",
  "Cancelled",
  "Delivered",
];

const validateUpdateOrderStatus = [
  check("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(allowedStatusValues)
    .withMessage(
      `status must be one of the allowed values "${allowedStatusValues}"`
    ),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateCreate,
  validateLogin,
  validateUpdatePassword,
  validateForgotPasswordToken,
  validateCreateOrder,
  validateCoupon,
  validateCreateCart,
  validateAddAddress,
  validateUpdateOrderStatus,
};
