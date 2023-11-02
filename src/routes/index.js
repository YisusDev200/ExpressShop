const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const blogRoutes = require("./blog.routes");
const couponRoutes = require("./coupon.routes");

const enquiryRoutes = require("./enquiry.routes");

const productCategoryRoutes = require("./product-categoty.routes");
const blogCategoryRoutes = require("./blog-category.routes");
const brandRoutes = require("./brand.routes");
const colorRoutes = require("./color.routes");

module.exports = {
  authRoutes,
  colorRoutes,
  productCategoryRoutes,
  blogCategoryRoutes,
  brandRoutes,
  productRoutes,
  blogRoutes,
  couponRoutes,
  enquiryRoutes,
};
