const express = require("express");
const router = express.Router();

const { colorController } = require("../controllers");

const { commonValidators } = require("../validators/");

const { isAdmin, authMiddleware } = require("../middlewares");

router.post(
  "/",
  commonValidators.validateTitle,
  authMiddleware,
  isAdmin,
  colorController.createOne
);
router.get("/", colorController.getAll);
router.get("/:id", colorController.getById);
router.put("/:id", authMiddleware, isAdmin, colorController.updateById);
router.delete("/:id", authMiddleware, isAdmin, colorController.deleteById);
module.exports = router;
