import { Router } from "express";
import {
  addProductReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  canUserReviewProduct
} from "../controllers/review.controllers.js";
import { isLogedin } from "../middlewares/isAuthenticated.js";

const router = Router();

// Public routes
router.route("/product/:productId").get(getProductReviews);

// Protected routes (require authentication)
router.use(isLogedin); // Apply authentication middleware to all routes below

router.route("/add").post(addProductReview);
router.route("/user").get(getUserReviews);
router.route("/:reviewId").put(updateReview);
router.route("/:reviewId").delete(deleteReview);
router.route("/can-review/:productId/:orderId").get(canUserReviewProduct);

export default router;
