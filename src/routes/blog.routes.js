const express = require("express");
const router = express.Router();
const {
  blogController: {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    disliketheBlog,
    uploadImages,
    deleteImages,
  },
} = require("../controllers");

const { isAdmin, authMiddleware, uploadPhote } = require("../middlewares");

const {
  blogValidators: { validateBlog, validatelLikes, validateDeleteImg },
} = require("../validators");

router.post("/", validateBlog, authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhote.array("images", 2),
  uploadImages
);
router.delete(
  "/delete-img",
  validateDeleteImg,
  authMiddleware,
  isAdmin,
  deleteImages
);

router.put("/likes", validatelLikes, authMiddleware, likeBlog);
router.put("/dislikes", validatelLikes, authMiddleware, disliketheBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
