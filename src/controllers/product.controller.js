const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  ProductSchema,
  UserSchema,
  ColorSchema,
  ProductCategorySchema,
  BrandSchema,
} = require("../models");

const {
  validateMongoId,
  cloudinaryUploadImage,
  cloudinaryDeleteImage,
} = require("../utils");

// * create a new product
const createProduct = asyncHandler(async (req, res) => {
  validateMongoId(req.body.category);
  const productCategory = await ProductCategorySchema.findById(
    req.body.category
  );
  if (!productCategory) throw new Error("Product category not found");

  validateMongoId(req.body.brand);
  const brand = await BrandSchema.findById(req.body.brand);

  if (!BrandSchema) throw new Error("Brand not found");

  const colors = req.body.color;
  await validateColors(colors);

  const newProduct = await ProductSchema.create(req.body);
  res.status(201).json({
    success: true,
    message: "The product has been created successfully.",
    product: newProduct,
  });
});

// * update a product
const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoId(id);

  if (req.body.color) {
    const colors = req.body.color;
    await validateColors(colors);
  }

  if (req.body.category) {
    validateMongoId(req.body.category);
    const productCategory = await ProductCategorySchema.findById(
      req.body.category
    );
    if (!productCategory) throw new Error("Product category not found");
  }

  if (req.body.brand) {
    validateMongoId(req.body.brand);
    const brand = await BrandSchema.findById(req.body.brand);
    if (!BrandSchema) throw new Error("Brand not found");
  }

  const updatedProduct = await ProductSchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedProduct) throw new Error("Product not found");

  res.status(200).json({
    success: true,
    message: "the product has been updated successfully",
    updatedProduct,
  });
});

// * get all products
const getProducts = asyncHandler(async (req, res) => {
  //filtros
  const queryObj = { ...req.query };
  const excludeField = ["page", "sort", "limit", "fields"];

  excludeField.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = ProductSchema.find(JSON.parse(queryStr));

  //ordenar
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //limiting the fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query.select(fields);
  } else {
    query.select("-__v");
  }

  //paginacion
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const numProducts = await ProductSchema.countDocuments();
  if (skip >= numProducts) {
    throw new Error("This page does not exist o not have products");
  }
  query.skip(skip).limit(limit);
  const products = await query
    .populate({ path: "color", select: "title _id" })
    .populate({ path: "category", select: "title _id" })
    .populate({ path: "brand", select: "title _id" });
  if (!products) {
    throw new Error("No products");
  }

  // Calcular la página anterior y la página siguiente
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = skip + limit < numProducts ? page + 1 : null;

  res.json({
    success: true,
    message: "The products have been found successfully",
    products,
    pagination: {
      page,
      limit,
      previousPage,
      nextPage,
    },
    total: numProducts,
  });
});

// * get a product
const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoId(id);
  const product = await ProductSchema.findById(id)
    .populate({ path: "color", select: "title _id" })
    .populate({ path: "category", select: "title _id" })
    .populate({ path: "brand", select: "title _id" });
  if (!product) throw new Error("Product not found");

  res.json({
    success: true,
    message: "The product has been found successfully",
    product,
  });
});

// * delete producto
const deleteProduct = asyncHandler(async (req, res) => {
  validateMongoId(req.params.id);
  const product = await ProductSchema.findByIdAndDelete(req.params.id);
  if (!product) throw new Error("Product not found");
  res.json({
    success: true,
    message: "Product removed",
    deletedProduct: {
      _id: product._id,
      name: product.title,
    },
  });
});

// * add to wishlist
const addToWishList = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { prodId } = req.body;

  const user = await UserSchema.findById(id);
  if (!user) throw new Error("User not found");

  const product = await ProductSchema.findById(prodId);
  if (!product) throw new Error("Product not found");

  const alreadyInWishList = user.wishlist.find(
    (id) => id.toString() === prodId
  );

  if (alreadyInWishList) {
    let user = await UserSchema.findByIdAndUpdate(
      id,
      { $pull: { wishlist: prodId } },
      { new: true }
    ).populate("wishlist");
    res.json({
      success: true,
      message: "Product removed from wishlist",
      user: { _id: user._id, firstname: user.firstname },
      wishlist: user.wishlist,
    });
  } else {
    let user = await UserSchema.findByIdAndUpdate(
      id,
      { $push: { wishlist: prodId } },
      { new: true }
    ).populate("wishlist");
    res.json({
      success: true,
      message: "Product added to wishlist",
      user: { _id: user._id, firstname: user.firstname },
      wishlist: user.wishlist,
    });
  }
});

// * add rating
const rating = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const { prodId, star, comment } = req.body;

  const produc = await ProductSchema.findById(prodId);
  if (!produc) throw new Error("Product not found");

  let alreadyRated = produc.retings.find(
    (r) => r.postedBy.toString() === id.toString()
  );

  if (alreadyRated) {
    await ProductSchema.updateOne(
      { retings: { $elemMatch: alreadyRated } },
      { $set: { "retings.$.star": star, "retings.$.comment": comment } },
      { new: true }
    );
  } else {
    await ProductSchema.findByIdAndUpdate(
      prodId,
      {
        $push: { retings: { star, comment, postedBy: id } },
      },
      { new: true }
    );
  }

  const getallratings = await ProductSchema.findById(prodId);

  let totalRating = getallratings.retings.length;

  let ratingsum = getallratings.retings
    .map((item) => item.star)
    .reduce((prev, curr) => prev + curr, 0);

  let actualRating = Math.round(ratingsum / totalRating);

  let finalproduct = await ProductSchema.findByIdAndUpdate(
    prodId,
    {
      totalrating: actualRating,
    },
    { new: true }
  );
  res.json({
    success: true,
    message: "Rating updated successfully",
    product: {
      id: finalproduct._id,
      totalrating: finalproduct.totalrating,
      retings: finalproduct.retings,
    },
  });
});

// * delete rating
const deleteRating = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const prodId = req.params.id;
  validateMongoId(prodId);

  try {
    const product = await ProductSchema.findById(prodId);
    if (!product) throw new Error("Product not found");

    const rating = product.retings.find(
      (r) => r.postedBy.toString() === userId.toString()
    );

    if (!rating) throw new Error("Rating not found");

    await ProductSchema.updateOne(
      { _id: prodId },
      { $pull: { retings: { _id: rating._id } } }
    );

    const updatedProduct = await ProductSchema.findById(prodId);

    res.json({
      success: true,
      message: "Rating deleted successfully",
      product: {
        _id: updatedProduct._id,
        retings: updatedProduct.retings,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// * update images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;

    const maxImages = 2;

    const productId = req.params.id;
    const product = await ProductSchema.findById(productId);
    if (!product) throw new Error("Product not found");

    if (product.images.length >= maxImages) {
      for (const file of files) {
        const { path } = file;
        fs.unlinkSync(path);
      }
      throw new Error("Maximum number of images reached: " + maxImages);
    }

    for (const file of files) {
      const { path } = file;
      console.log(path);
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const images = urls.map((file) => {
      return file;
    });

    product.images = product.images.concat(images);
    await product.save();
    res.json({
      message: "Images uploaded successfully",
      data: {
        id: product._id,
        images: product.images,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * delete images
const deleteImages = asyncHandler(async (req, res) => {
  const id = req.body.publicImageId;
  const productId = req.body.productId;
  try {
    await cloudinaryDeleteImage(id, "images");

    const product = await ProductSchema.findByIdAndUpdate(
      productId,
      { $pull: { images: { public_id: id } } },
      { new: true }
    );
    res.json({
      message: "Image deleted",
      data: {
        id: product._id,
        images: product.images,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
});

const validateColors = async (colors) => {
  try {
    const uniqueColors = new Set(colors);
    if (uniqueColors.size !== colors.length)
      throw new Error(`Color IDs cannot be duplicated ${colors}`);
    colors.forEach((color) => validateMongoId(color));
    const foundColors = await ColorSchema.find({ _id: { $in: colors } });
    if (foundColors.length !== colors.length) {
      const foundColorIds = foundColors.map((color) => color._id.toString());
      const missingColorIds = colors.filter(
        (color) => !foundColorIds.includes(color)
      );
      throw new Error(
        `The following color IDs do not exist: ${missingColorIds.join(", ")}`
      );
    }
  } catch (error) {
    throw new Error(`Error validating colors: ${error.message}`);
  }
};

module.exports = {
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
};
