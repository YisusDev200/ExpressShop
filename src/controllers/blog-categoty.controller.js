const { BlogCategorySchema } = require("../models");
const genericCrud = require("./generic-crud.controller");

const blogCatController = genericCrud(BlogCategorySchema);

module.exports = blogCatController;
