import express from "express";
import { addProduct, getAllSearchProducts, getAllSearchUsers, getProductsbyMultipleIds, updateHomeContent } from "../controllers/admin.controllers.js";
import { isAdmin } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllProducts } from "../controllers/product.controllers.js";

const adminRouter = express.Router();

adminRouter.post("/add-product", isAdmin, upload.array("images", 12), addProduct);

adminRouter.patch("/update-homecontent", isAdmin, updateHomeContent);

adminRouter.get('/get-search-all-products', isAdmin, getAllSearchProducts);

adminRouter.post('/get-products-by-multiple-ids', isAdmin, getProductsbyMultipleIds);

adminRouter.post('/get-all-products', isAdmin, getAllProducts);

adminRouter.get('/get-search-all-users', isAdmin, getAllSearchUsers);

export default adminRouter;
