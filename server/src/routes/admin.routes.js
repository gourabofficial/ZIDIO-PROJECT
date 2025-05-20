import express from "express";
import { addProduct, getAllSearchProducts, updateHomeContent } from "../controllers/admin.controllers.js";
import { isAdmin } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/add-product", isAdmin, upload.array("images", 12), addProduct);

adminRouter.patch("/update-homecontent", isAdmin, updateHomeContent);

adminRouter.get('/get-search-all-products', isAdmin, getAllSearchProducts)

export default adminRouter;
