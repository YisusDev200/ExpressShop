const express = require("express");
const router = express.Router();

const { productCategoryController } = require("../controllers");

const { commonValidators } = require("../validators/");

const { isAdmin, authMiddleware } = require("../middlewares");

router.post(
  "/",
  commonValidators.validateTitle,
  authMiddleware,
  isAdmin,
  productCategoryController.createOne
);
router.get("/", productCategoryController.getAll);
router.get("/:id", productCategoryController.getById);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  productCategoryController.updateById
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  productCategoryController.deleteById
);
module.exports = router;
