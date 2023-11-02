const express = require("express");
const router = express.Router();

const { blogCategoryController } = require("../controllers/");

const { commonValidators } = require("../validators/");

const { isAdmin, authMiddleware } = require("../middlewares");

router.post(
  "/",
  commonValidators.validateTitle,
  authMiddleware,
  isAdmin,
  blogCategoryController.createOne
);
router.get("/", blogCategoryController.getAll);
router.get("/:id", blogCategoryController.getById);
router.put("/:id", authMiddleware, isAdmin, blogCategoryController.updateById);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  blogCategoryController.deleteById
);
module.exports = router;
