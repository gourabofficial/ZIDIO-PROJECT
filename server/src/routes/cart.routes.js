import express from "express";
import { isLogedin } from "../middlewares/isAuthenticated.js";
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../controllers/cart.controllers.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", isLogedin, addToCart);
cartRouter.post("/remove-to-cart", isLogedin, removeFromCart);
cartRouter.post("/clear-cart", isLogedin, clearCart);
cartRouter.put("/update-quantity", isLogedin, updateCartItemQuantity);

export default cartRouter;
