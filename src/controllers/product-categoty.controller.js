const { ProductCategorySchema } = require("../models");
const genericCrud = require("./generic-crud.controller");

const productCatController = genericCrud(ProductCategorySchema);

module.exports = productCatController;
