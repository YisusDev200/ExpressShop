const express = require("express");
const router = express.Router();

const { isAdmin, authMiddleware } = require("../middlewares");

const {
  couponValidators: { validadorCoupon },
} = require("../validators");

const {
  couponController: { createCoupon, getAllCoupons, updateCoupon, deleteCoupon },
} = require("../controllers");

router.post("/", validadorCoupon, authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
