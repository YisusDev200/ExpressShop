const { check } = require("express-validator");
const { validateResult } = require("../middlewares");

const validateBlog = [
  check("title")
    .notEmpty()
    .withMessage("The 'title' is required")
    .isString()
    .withMessage("The 'title' should be a string")
    .isLength({ min: 3 })
    .withMessage("The 'title' should be at least 5 characters long"),

  check("description")
    .notEmpty()
    .withMessage("The 'description' is required")
    .isString()
    .withMessage("The 'description' should be a string")
    .isLength({ min: 5 })
    .withMessage("The 'description' should be at least 5 characters long"),

  check("category")
    .notEmpty()
    .withMessage("The 'category' is required")
    .isMongoId()
    .withMessage("The 'category' should be a valid MongoDB ID"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validatelLikes = [
  check("blogId")
    .notEmpty()
    .withMessage("The 'blogId' is required")
    .isMongoId()
    .withMessage("The 'blogId' should be a valid MongoDB ID"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateDeleteImg = [
  check("publicImageId")
    .notEmpty()
    .withMessage("The 'publicImageId' is required"),
  check("blogId")
    .notEmpty()
    .withMessage("The 'blogId' is required")
    .isMongoId()
    .withMessage("The 'blogId' should be a valid MongoDB ID"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateBlog,
  validatelLikes,
  validateDeleteImg,
};
