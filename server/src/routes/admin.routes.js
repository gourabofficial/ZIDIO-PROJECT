import express from "express";
import { addProduct, deleterProductById, getAllOrders, getAllSearchProducts, getAllSearchUsers, getDashboardStats, getProductByIdForAdmin, getProductsbyMultipleIds, getRecentOrders, getRecentUsers, updateHomeContent, updateOrderStatus, updateProductById, deleteUser, getAllInventory, updateInventory, getInventoryByProductId } from "../controllers/admin.controllers.js";
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

// get all orders for admin
adminRouter.get('/get-all-orders', isAdmin, getAllOrders);

// update order status
adminRouter.patch('/orders/:orderId/status', isAdmin, updateOrderStatus);

//update product
adminRouter.patch('/update-product/:id', isAdmin, upload.array('images', 12), updateProductById);

//delete product - comprehensive deletion
adminRouter.delete('/delete-product/:id', isAdmin, deleterProductById);
// get product by id for admin
adminRouter.get('/get-product-for-admin/:id', isAdmin, getProductByIdForAdmin);

// dashboard stats
adminRouter.get('/dashboard/stats', isAdmin, getDashboardStats);

// recent users and orders for dashboard
adminRouter.get('/recent-users', isAdmin, getRecentUsers);
adminRouter.get('/recent-orders', isAdmin, getRecentOrders);

// delete user and all associated data
adminRouter.delete('/delete-user/:userId', isAdmin, deleteUser);

// Inventory management routes
adminRouter.get('/inventory', isAdmin, getAllInventory);
adminRouter.get('/inventory/product/:productId', isAdmin, getInventoryByProductId);
adminRouter.patch('/inventory/:productId', isAdmin, updateInventory);

export default adminRouter;
