const express = require("express");
const router = express.Router();

// * CONTROLADORES -------------------------------
const {
  authController: {
    createUser,
    loginUser,
    handleRefreshToken,
    logout,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    loginAdmin,
    blockUser,
    unblockUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    //-----//
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
  },
} = require("../controllers");

// * MIDDLEWARES ---------------------------------
const { authMiddleware, isAdmin } = require("../middlewares");
const {
  userValidators: {
    validateCreate,
    validateLogin,
    validateUpdatePassword,
    validateForgotPasswordToken,
    validateCreateOrder,
    validateCoupon,
    validateCreateCart,
    validateAddAddress,
    validateUpdateOrderStatus,
  },
} = require("../validators");

// * RUTAS ----------------------------------------

// ? Rutas de registro de usuarios
router.post("/register", validateCreate, createUser);

router.post(
  "/forgot-password-token",
  validateForgotPasswordToken,
  forgotPasswordToken
);
router.put("/reset-password/:token", validateUpdatePassword, resetPassword);

// ? Rutas de inicio de sesión
router.post("/login", validateLogin, loginUser);
router.post("/admin-login", validateLogin, loginAdmin);

// ? Rutas relacionadas con el carrito de compras
router.post("/cart", validateCreateCart, authMiddleware, userCart);
router.post("/cart/applycoupon", validateCoupon, authMiddleware, applyCoupon);
router.post(
  "/cart/cash-order",
  validateCreateOrder,
  authMiddleware,
  createOrder
);

// ? Rutas para obtener información de usuarios y órdenes
router.get("/all-users", authMiddleware, isAdmin, getUsers);

router.get("/get-orders", authMiddleware, getOrders);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishList);
router.get("/cart", authMiddleware, getUserCart);

// ? Ruta para obtener un usuario específico por ID (requiere autenticación y permisos de administrador)
router.get("/:id", authMiddleware, isAdmin, getUser);

// ? Rutas de actualización de usuario
router.put("/edit-user", authMiddleware, updateUser);
router.put("/save-address", validateAddAddress, authMiddleware, saveAddress);
router.put("/password", validateUpdatePassword, authMiddleware, updatePassword);
router.put(
  "/order/update-order/:id",
  validateUpdateOrderStatus,
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

// ? Rutas de eliminación de usuario
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

// ? Rutas para bloquear y desbloquear usuarios (requiere autenticación y permisos de administrador)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
