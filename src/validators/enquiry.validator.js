const { check } = require("express-validator");
const { validateResult } = require("../middlewares");

const validateEnquiry = [
  check("name")
    .notEmpty()
    .withMessage("The 'name' is required")
    .isString()
    .withMessage("The 'name' should be a string"),

  check("email")
    .notEmpty()
    .withMessage("The 'email' is required")
    .isEmail()
    .withMessage("Invalid email format"),

  check("mobile")
    .isMobilePhone("es-MX", { strictMode: false })
    .withMessage("Mobile number is not valid (MX)")
    .notEmpty()
    .withMessage("mobile is required"),

  check("comment")
    .notEmpty()
    .withMessage("The 'comment' is required")
    .isString()
    .withMessage("The 'comment' should be a string"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateEnquiry,
};
