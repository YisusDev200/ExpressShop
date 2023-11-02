const { check } = require("express-validator");
const { validateResult } = require("../middlewares");

const validateTitle = [
  check("title")
    .notEmpty()
    .withMessage("The 'title' field is required")
    .isString()
    .withMessage("The 'title' field must be a string")
    .isLength({ min: 2 })
    .withMessage("The 'title' field must be at least 2 characters long"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateTitle,
};
