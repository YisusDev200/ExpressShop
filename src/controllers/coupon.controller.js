const asyncHandler = require("express-async-handler");
const { CouponSchema } = require("../models");
const { validateMongoId } = require("../utils");

// * create new coupon
const createCoupon = asyncHandler(async (req, res) => {
  const newCoupon = await CouponSchema.create(req.body);
  res.status(201).json({
    status: true,
    message: "coupon created successfully",
    data: newCoupon,
  });
});

// * get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await CouponSchema.find();
  res.status(200).json({
    status: true,
    message: "coupons fetched successfully",
    data: coupons,
  });
});

// * update coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body.name) req.body.name = req.body.name.toLowerCase();
  validateMongoId(id);
  const coupon = await CouponSchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!coupon) throw new Error("coupon not found");

  res.status(200).json({
    status: true,
    message: "coupon updated successfully",
    data: coupon,
  });
});

// * delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const coupon = await CouponSchema.findByIdAndDelete(id);
  if (!coupon) throw new Error("coupon not found");
  res.status(200).json({
    status: true,
    message: "coupon deleted successfully",
    data: coupon,
  });
});

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
