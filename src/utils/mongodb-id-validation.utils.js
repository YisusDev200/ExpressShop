const mongoose = require("mongoose");
const validateMongoId = (id, type = "id") => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error(
      `Invalid ${type} ${id} format for MongoDB, please check again`
    );
  }
};

module.exports = {
  validateMongoId,
};
