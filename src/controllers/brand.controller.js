const { BrandSchema } = require("../models");
const genericCrud = require("./generic-crud.controller");

const brandController = genericCrud(BrandSchema);

module.exports = brandController;
