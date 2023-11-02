const asyncHandler = require("express-async-handler");
const { validateMongoId } = require("../utils");

const genericCrud = (Model) => ({
  createOne: asyncHandler(async (req, res) => {
    try {
      let { title } = req.body;
      title = title.toLowerCase();

      const doc = await Model.findOne({ title });

      if (doc) {
        return res.status(400).json({
          success: false,
          message: `${title} already exists`,
        });
      }
      const newDoc = await Model.create({ title });
      res.status(201).json({
        success: true,
        message: `${Model.modelName} created successfully`,
        data: newDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error creating ${Model.modelName}`,
        error: error.message,
      });
    }
  }),

  getAll: asyncHandler(async (req, res) => {
    try {
      const docs = await Model.find();
      res.status(200).json({
        success: true,
        message: `${Model.modelName} retrieved successfully`,
        data: docs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error retrieving ${Model.modelName}`,
        error: error.message,
      });
    }
  }),

  getById: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const doc = await Model.findById(id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: `${Model.modelName} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `${Model.modelName} retrieved successfully`,
        data: doc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error retrieving ${Model.modelName}`,
        error: error.message,
      });
    }
  }),

  updateById: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedDoc) {
        return res.status(404).json({
          success: false,
          message: `${Model.modelName} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `${Model.modelName} updated successfully`,
        data: updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error updating ${Model.modelName}`,
        error: error.message,
      });
    }
  }),

  deleteById: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      validateMongoId(id);
      const deletedDoc = await Model.findByIdAndDelete(id);
      if (!deletedDoc) {
        return res.status(404).json({
          success: false,
          message: `${Model.modelName} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `${Model.modelName} deleted successfully`,
        data: {
          id: deletedDoc._id,
          title: deletedDoc.title,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error deleting ${Model.modelName}`,
        error: error.message,
      });
    }
  }),
});

module.exports = genericCrud;
