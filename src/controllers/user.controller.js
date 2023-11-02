const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uuid = require("uuid");

const {
  generateToken,
  generateRefreshToken,
  sendEmail,
  validateMongoId,
} = require("../utils");

const {
  UserSchema,
  CartSchema,
  ProductSchema,
  CouponSchema,
  OrderSchema,
} = require("../models");

// * Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;
  const user = await UserSchema.findOne({
    $or: [{ email }, { mobile }],
  });

  if (user) {
    let errorMessage = "";
    if (user.email === email)
      errorMessage = `User already exists with email: ${email}`;
    else if (user.mobile === mobile)
      errorMessage = `User already exists with mobile number: ${mobile}`;
    throw new Error(errorMessage);
  }

  const newUser = await UserSchema.create(req.body);
  newUser.password = undefined;
  res.status(201).json({
    status: true,
    message: "User created successfully",
    user: newUser,
  });
});

// * Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Credentials do not match");
  }

  // Generate a refreshToken for the current user and store it in the database
  const refreshToken = generateRefreshToken(user._id);
  const userRefresh = await UserSchema.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true }
  );

  // Set a cookie in the user's browser to store the refreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000, // The cookie expires in 72 hours
  });

  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "User logged in successfully",
    data: userRefresh,
    token: generateToken(user._id),
  });
});

// * Refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const { JWT_SECRET } = process.env;

  const token = req.cookies;
  if (!token?.refreshToken) {
    throw new Error("Please provide refresh token");
  }
  const refreshToken = token.refreshToken;
  const user = await UserSchema.findOne({ refreshToken });
  if (!user) {
    throw new Error("no refresh token present in db");
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decode) => {
    if (err || user._id != decode.id) {
      throw new Error("There is something wrong with refresh token");
    } else {
      const accessToken = generateToken(user._id);
      res.json({ accessToken });
    }
  });
});

// * Logout a user
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("Refresh token is missing");
  }
  const refreshToken = cookie.refreshToken;

  const user = await UserSchema.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(403);
  }

  user.refreshToken = null;
  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(403);
});

// * Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await UserSchema.find({});
  res.status(200).json({
    status: true,
    message: "All users",
    users,
  });
});

// * Get user
const getUser = asyncHandler(async (req, res) => {
  validateMongoId(req.params.id);
  const user = await UserSchema.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "User find successfully",
    user,
  });
});

// * Delete user
const deleteUser = asyncHandler(async (req, res) => {
  validateMongoId(req.params.id);
  const user = await UserSchema.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  res.status(200).json({
    status: true,
    message: "User deleted successfully",
    deletedUserId: user._id,
  });
});

// * Update user
const updateUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoId(id);

  if (req.body && "role" in req.body) {
    throw new Error(
      "Permission denied. Only administrators can update 'role'."
    );
  }
  const updateUser = await UserSchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updateUser) throw new Error("User not found");
  updateUser.password = undefined;
  res.status(200).json({
    status: true,
    message: "User updated successfully",
    user: updateUser,
  });
});

// * Block user
const blockUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoId(id);
  const userBlock = await UserSchema.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  if (!userBlock) throw new Error("User not found");
  console.log(userBlock);

  res.status(200).json({
    status: true,
    message: "User blocked successfully",
    user: {
      id: userBlock._id,
      firstname: userBlock.firstname,
      isBlocked: userBlock.isBlocked,
    },
  });
});

// * Unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoId(id);
  const userBlock = await UserSchema.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  if (!userBlock) throw new Error("User not found");

  res.status(200).json({
    status: true,
    message: "User unblocked successfully",
    user: {
      id: userBlock._id,
      firstname: userBlock.firstname,
      isBlocked: userBlock.isBlocked,
    },
  });
});

// * Update password user
const updatePassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const id = req.user._id;
  validateMongoId(id);

  const user = await UserSchema.findById(id);

  if (!user) throw new Error("User not found");
  user.password = password;

  await user.save();

  res.status(200).json({
    status: true,
    message: "Password updated successfully",
  });
});

// * password forgot gmail
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserSchema.findOne({ email });

  if (!user) throw new Error("User not found");

  try {
    const token = await user.createPasswordResetToken();

    await user.save();
    const url = `http://localhost:4000/api/user/reset-password/${token}`;
    const resetURL = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .container {
            background-color: #222;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            color: #fff;
            text-align: center;
            padding: 30px;
        }
        h1 {
            color: #007bff;
        }
        p {
            color: #ccc;
            font-size: 18px;
        }
        a {
            background-color: #007bff;
            color: black;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset</h1>
        <p>Hello, ${user.firstname} ${user.lastname}</p>
        <p>We have received a request to reset your account password. Please click the link below to proceed with the reset process:</p>
        <p><a href="${url}">Reset Password</a></p>
        <p>If you did not request a password reset, you can ignore this email.</p>
        <p>Thank you,</p>
        <p>Your Support Team E-commers</p>
    </div>
</body>
</html>

`;
    const data = {
      to: email,
      text: "Reset Password",
      html: resetURL,
    };
    sendEmail(data);
    res.status(200).json({
      status: true,
      message: "Email sent successfully",
      token,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * password forgot reset
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) throw new Error("Please provide token");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserSchema.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new Error("Token is invalid or has expired, please try again");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    status: true,
    message: "Password reset successfully",
    data: {
      userId: user._id,
      username: user.firstname,
    },
  });
});

// * login user admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserSchema.findOne({ email });
  if (user.role !== "admin") {
    throw new Error("You are not admin");
  }

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Credentials do not match");
  }
  const refreshToken = generateRefreshToken(user._id);

  await UserSchema.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000, // 7 days
  });

  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "User Admin logged in successfully",
    user,
    token: generateToken(user._id),
  });
});

// -------------------------------------//

// * get all wishlist a user
const getWishList = asyncHandler(async (req, res) => {
  const id = req.user._id;
  validateMongoId(id);
  const user = await UserSchema.findById(id).populate("wishlist");
  if (!user) throw new Error("User not found");
  user.password = undefined;

  res.status(200).json({
    status: true,
    message: "Wishlist",
    user: {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      wishlist: user.wishlist,
    },
  });
});

// * add product to cart
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);

  for (const item of cart) {
    validateMongoId(item._id, "_id");
    validateMongoId(item.color, "color");
    const product = await ProductSchema.findById(cart[0]._id);
    if (!product) throw new Error("Product not found");
    if (product.quantity < item.count)
      throw new Error("Product is out of stock");
    if (!product.color.includes(item.color)) {
      throw new Error(
        `Color ${item.color} not available for product ${product.title}`
      );
    }
  }

  try {
    let products = [];
    //check if user already have product in cart
    const alreadyExistCart = await CartSchema.findOne({ orderBy: _id });
    if (alreadyExistCart)
      await CartSchema.deleteOne({ _id: alreadyExistCart._id });

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await ProductSchema.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let j = 0; j < products.length; j++) {
      cartTotal += products[j].price * products[j].count;
    }

    let newCart = await new CartSchema({
      products,
      cartTotal,
      orderBy: _id,
    }).save();

    res.status(200).json({
      status: true,
      message: "Cart updated successfully",
      cart: newCart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const cart = await CartSchema.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    if (!cart) throw new Error("Cart not found");
    res.status(200).json({
      status: true,
      message: "Cart",
      cart,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * empty user cart
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const user = await UserSchema.findById(_id);
    if (!user) throw new Error("User not found");
    const cart = await CartSchema.findOneAndRemove({ orderBy: user._id });
    if (!cart) throw new Error("Cart not found");
    res.status(204).json({ message: "Cart emptied successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// * apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoId(_id);

  const validCoupon = await CouponSchema.findOne({ name: coupon });
  if (!validCoupon) {
    throw new Error(`Invalid coupon ${coupon}`);
  }

  const user = await UserSchema.findById(_id);
  if (!user) throw new Error("User not found");

  const { cartTotal } = await CartSchema.findOne({
    orderBy: _id,
  }).populate("products.product");

  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  const cartAfter = await CartSchema.findOneAndUpdate(
    { orderBy: _id },
    { totalAfterDiscount, couponApplied: true },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: "Discount applied successfully",
    cartAfter,
  });
});

// * create order
const createOrder = asyncHandler(async (req, res) => {
  const { COD, cuoponApplied } = req.body;
  const { _id } = req.user;

  validateMongoId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");

    const user = await UserSchema.findById(_id);
    const userCart = await CartSchema.findOne({ orderBy: user._id });
    let finalAmount = 0;
    if (cuoponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new OrderSchema({
      products: userCart.products,
      paymentIntent: {
        id: uuid.v4(),
        method: "COD",
        amount: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    let updated = await ProductSchema.bulkWrite(update, {});

    res.json({ ok: true, newOrder });
  } catch (error) {
    throw new Error(error);
  }
});

// * get all orders
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoId(_id);
  try {
    const orders = await OrderSchema.find({ orderBy: _id })
      .populate("products.product")
      .exec();
    if (!orders) throw new Error("Orders not found");
    res.status(200).json({
      status: true,
      message: "orders",
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * save address
const saveAddress = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  validateMongoId(id);
  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) throw new Error("User not found");
    res.status(200).json({
      status: true,
      message: "addres updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// * update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updateOrderStatus = await OrderSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          orderStatus: status,
          "paymentIntent.status": status,
        },
      },
      { new: true }
    );
    if (!updateOrderStatus) throw new Error("Order not found");
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  getUsers,
  loginUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,

  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
