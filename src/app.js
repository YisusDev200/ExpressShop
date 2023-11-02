const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config");
const { notFound, errorHandler } = require("./middlewares");

// * Import routes
const {
  authRoutes,
  colorRoutes,
  brandRoutes,
  blogCategoryRoutes,
  productCategoryRoutes,
  productRoutes,
  blogRoutes,
  couponRoutes,
  enquiryRoutes,
} = require("./routes");

// * Connect to the database
connectDB();

// * Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// * Routes
app.use("/api/user", authRoutes);
app.use("/api/color", colorRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/product-category", productCategoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/enquiry", enquiryRoutes);

// * Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
