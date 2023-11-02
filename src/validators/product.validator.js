const { check } = require("express-validator");
const { validateResult } = require("../middlewares");

const validateCreateProduct = [
  check("title")
    .isString()
    .withMessage("The title should be a string")
    .notEmpty()
    .withMessage("The title is mandatory")
    .isLength({ min: 3 })
    .withMessage("The title should be at least 5 characters long"),

  check("description")
    .isString()
    .withMessage("The description should be a string")
    .notEmpty()
    .withMessage("The description is mandatory")
    .isLength({ min: 3 })
    .withMessage("The description should be at least 5 characters long"),

  check("price")
    .isNumeric()
    .withMessage("The price should be a number")
    .isInt({ min: 0 })
    .withMessage("The price should be greater than 0")
    .notEmpty()
    .withMessage("The price is mandatory"),

  check("category")
    .notEmpty()
    .withMessage("The 'category' field is required")
    .isMongoId()
    .withMessage("The 'category' field must be a valid MongoDB ObjectId"),

  check("brand")
    .notEmpty()
    .withMessage("The 'brand' field is required")
    .isMongoId()
    .withMessage("The 'brand' field must be a valid MongoDB ObjectId"),

  check("quantity")
    .isInt({ min: 0 })
    .withMessage("The quantity should be greater than 0")
    .notEmpty()
    .withMessage("The quantity is mandatory"),

  check("color")
    .isArray()
    .withMessage("The 'color' field should be an array")
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage(
      "You must provide at least one color, e.g., ['65319b1fd4f0732cdae223e5', '65319b26d4f0732cdae223ed']"
    ),
  check("tags")
    .isArray()
    .withMessage("The 'tags' field should be an array")
    .custom((value) => Array.isArray(value) && value.length > 0)
    .withMessage(
      "You must provide at least one tag, e.g., ['featured', 'popular']"
    ),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const ValidateAddToWishList = [
  check("prodId")
    .notEmpty()
    .withMessage("prodId is required")
    .isMongoId()
    .withMessage("prodId should be a valid MongoDB ID"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const ValidateRating = [
  check("star")
    .notEmpty()
    .withMessage("star is required")
    .isInt()
    .withMessage("star should be an integer")
    .isInt({ min: 1, max: 5 })
    .withMessage("star should be an integer between 1 and 5"),

  check("prodId")
    .notEmpty()
    .withMessage("prodId is required")
    .isMongoId()
    .withMessage("prodId should be a valid MongoDB ID"),

  check("comment")
    .isString()
    .withMessage("comment should be a string")
    .isLength({ min: 3 })
    .withMessage("The comment should be at least 3 characters long")
    .notEmpty()
    .withMessage("comment is required"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

const validateDeleteImg = [
  check("publicImageId")
    .notEmpty()
    .withMessage("The 'publicImageId' is required"),
  check("productId")
    .notEmpty()
    .withMessage("The 'productId' is required")
    .isMongoId()
    .withMessage("The 'productId' should be a valid MongoDB ID"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateCreateProduct,
  ValidateAddToWishList,
  ValidateRating,
  validateDeleteImg,
};
