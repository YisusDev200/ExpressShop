const { validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors.array().map((error) => ({
    message: error.msg,
  }));

  res.status(400).json({ errors: errorMessages });
};

module.exports = { validateResult };
