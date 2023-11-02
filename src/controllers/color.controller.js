const { ColorSchema } = require("../models");
const genericCrud = require("./generic-crud.controller");

const colorController = genericCrud(ColorSchema);

module.exports = colorController;
