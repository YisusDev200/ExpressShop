const express = require("express");
const router = express.Router();
const {
  productController: {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    deleteRating,
    uploadImages,
    deleteImages,
  },
} = require("../controllers");

const { isAdmin, authMiddleware, uploadPhote } = require("../middlewares");

const {
  productValidators: {
    validateCreateProduct,
    ValidateAddToWishList,
    ValidateRating,
    validateDeleteImg,
  },
} = require("../validators/");

router.post("/", validateCreateProduct, authMiddleware, isAdmin, createProduct);

router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhote.array("images", 2),
  uploadImages
);
router.get("/:id", getProduct);

router.put("/wishlist", ValidateAddToWishList, authMiddleware, addToWishList);
router.put("/rating", ValidateRating, authMiddleware, rating);
router.delete("/rating/:id", authMiddleware, deleteRating);
router.delete(
  "/delete-img",
  validateDeleteImg,
  authMiddleware,
  isAdmin,
  deleteImages
);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getProducts);

module.exports = router;
