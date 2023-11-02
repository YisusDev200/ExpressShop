const EnquirySchema = require("../models/enquiry.model");
const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils");

// * create new enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  const newEnquiry = await EnquirySchema.create(req.body);
  res.status(201).json({
    status: true,
    message: "enquiry created successfully",
    data: newEnquiry,
  });
});

// * get all enquiries
const getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await EnquirySchema.find();
  res.status(200).json({
    status: true,
    message: "enquiry retrieved successfully",
    data: enquiries,
  });
});

// * get enquiry by id
const getEnquiryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const enquiry = await EnquirySchema.findById(id);
  if (!enquiry) {
    res.status(404);
    throw new Error("enquiry not found");
  }
  res.status(200).json({
    status: true,
    message: "enquiry retrieved successfully",
    data: enquiry,
  });
});

// * delete enquiry by id
const deleteEnquiryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const enquiry = await EnquirySchema.findByIdAndDelete(id);
  if (!enquiry) {
    res.status(404);
    throw new Error("enquiry not found");
  }
  res.status(200).json({
    status: true,
    message: "enquiry deleted successfully",
    data: enquiry,
  });
});

// * update enquiry by id
const updateEnquiryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  const updateEnquiry = await EnquirySchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updateEnquiry) {
    res.status(404);
    throw new Error("enquiry not found");
  }
  res.status(200).json({
    status: true,
    message: "enquiry updated successfully",
    data: updateEnquiry,
  });
});

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  deleteEnquiryById,
  updateEnquiryById,
};
