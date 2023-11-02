const express = require("express");
const router = express.Router();

const {
  enquiryController: {
    getEnquiries,
    getEnquiryById,
    deleteEnquiryById,
    updateEnquiryById,
    createEnquiry,
  },
} = require("../controllers");

const {
  enquiryValidators: { validateEnquiry },
} = require("../validators");

const { isAdmin, authMiddleware } = require("../middlewares");

router.post("/", validateEnquiry, createEnquiry);
router.get("/", getEnquiries);
router.get("/:id", getEnquiryById);
router.put("/:id", authMiddleware, isAdmin, updateEnquiryById);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiryById);
module.exports = router;
