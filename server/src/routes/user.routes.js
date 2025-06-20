import express from "express";
import { isAdmin, isLogedin } from "../middlewares/isAuthenticated.js";
import {
  addAddress,
  updateAddress,
  updateAvatar,
  updateUser,
  getAddressById,
  removeFromWishlist,
  addToWishlist,
  
} from "../controllers/user.controllers.js";
import {
  adminLogin,
  checkedUserLogin,
} from "../controllers/auth.controllers.js";
import { placeOrder, getUserOrders, getOrderById, handleStripeWebhook, getPaymentStatus, verifyPayment } from "../controllers/order.controllers.js";

const userRouter = express.Router();

// update account
userRouter.patch("/update-profile", isLogedin, updateAvatar);
//update userDetails
userRouter.patch("/update-user", isLogedin, updateUser);
// update address
userRouter.patch("/update-address", isLogedin, updateAddress);
//update avatar
userRouter.patch("/update-avatar", isLogedin, updateAvatar);
//add address
userRouter.post("/add-address", isLogedin, addAddress);
//add new address
userRouter.get("/address/:addressId", isLogedin, getAddressById);
// is login
userRouter.post("/is-login", checkedUserLogin);
// admin routes
userRouter.post("/admin", isAdmin, adminLogin);
//wishlist routes 
// Add these routes to your existing user.routes.js
userRouter.post('/add-to-wishlist', isLogedin, addToWishlist);
//order routes
userRouter.post('/place-order',isLogedin,placeOrder);
userRouter.get('/orders', isLogedin, getUserOrders);
userRouter.get('/orders/:orderId', isLogedin, getOrderById);

// Payment routes
userRouter.post('/webhook/stripe', handleStripeWebhook);
userRouter.get('/payment-status/:sessionId', isLogedin, getPaymentStatus);
userRouter.post('/verify-payment', isLogedin, verifyPayment);

userRouter.delete('/remove-from-wishlist/:productId', isLogedin, removeFromWishlist);


export default userRouter;