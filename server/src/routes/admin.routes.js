import express from "express";
import {
  addProduct,
  updateProduct,
  addCollection,
  removeProduct,
} from "../controllers/admin.controllers.js";
import { isAdmin } from "../middlewares/isAuthenticated.js";
import { upload } from "../config/cloudinary.js";

const adminRouter = express.Router();

// Route to add a new product
adminRouter.post("/add-product", isAdmin, upload.array("files"), addProduct);

//update product
adminRouter.put(
  "/update-product/:id",
  isAdmin,
  upload.array("files"),
  updateProduct
);

//delete product
adminRouter.delete(
  "/delete-product/:id",
  isAdmin,
  upload.array("files"),
  removeProduct
);

export default adminRouter;
