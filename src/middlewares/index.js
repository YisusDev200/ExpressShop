const { isAdmin } = require("./admin-check.middleware");
const { authMiddleware } = require("./token-validator.middleware");
const { notFound, errorHandler } = require("./error-handlers.middleware");
const { validateResult } = require("./validate-data.middleware");
const { uploadPhote } = require("./file-upload.middleware");

module.exports = {
  isAdmin,
  authMiddleware,
  notFound,
  errorHandler,
  validateResult,
  uploadPhote,
};
