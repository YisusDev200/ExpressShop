const express = require("express");
const router = express.Router();

const { brandController } = require("../controllers");
const { commonValidators } = require("../validators/");

const { isAdmin, authMiddleware } = require("../middlewares");
router.post(
  "/",
  commonValidators.validateTitle,
  authMiddleware,
  isAdmin,
  brandController.createOne
);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getById);
router.put("/:id", authMiddleware, isAdmin, brandController.updateById);
router.delete("/:id", authMiddleware, isAdmin, brandController.deleteById);
module.exports = router;
