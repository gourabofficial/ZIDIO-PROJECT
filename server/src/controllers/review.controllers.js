import { ProductReview } from "../model/review.model.js";
import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";
import mongoose from "mongoose";

// Add a new product review (only for delivered orders)
export const addProductReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const clerkUserId = req.userId; // From Clerk middleware

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userId = user._id;

    // Validate required fields
    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (productId, orderId, rating, comment)"
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check if the order exists and belongs to the user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review products from your own orders"
      });
    }

    // Check if the order is delivered
    if (order.Orderstatus !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "You can only review products after they are delivered"
      });
    }

    // Check if the product is in the order
    const productInOrder = order.products.find(
      item => item.productId.toString() === productId
    );
    if (!productInOrder) {
      return res.status(400).json({
        success: false,
        message: "This product was not found in your order"
      });
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await ProductReview.findOne({
      owner: userId,
      productId: productId,
      orderId: orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product for this order"
      });
    }

    // Create the review
    const review = new ProductReview({
      owner: userId,
      productId,
      orderId,
      rating: parseInt(rating),
      comment: comment.trim()
    });

    await review.save();

    // Populate the review with user and product details
    await review.populate('owner', 'fullName email');
    await review.populate('productId', 'name');

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review
    });

  } catch (error) {
    console.error("Error adding product review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get reviews with pagination
    const reviews = await ProductReview.find({ productId })
      .populate('owner', 'fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalReviews = await ProductReview.countDocuments({ productId });

    // Calculate average rating
    const ratingStats = await ProductReview.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);

    let averageRating = 0;
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (ratingStats.length > 0) {
      averageRating = ratingStats[0].averageRating;
      // Count rating distribution
      ratingStats[0].ratingDistribution.forEach(rating => {
        ratingDistribution[rating]++;
      });
    }

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page < Math.ceil(totalReviews / limit),
        hasPrevPage: page > 1
      },
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error("Error getting product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const clerkUserId = req.userId; // From Clerk middleware
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userId = user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await ProductReview.find({ owner: userId })
      .populate('productId', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await ProductReview.countDocuments({ owner: userId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page < Math.ceil(totalReviews / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Error getting user reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const clerkUserId = req.userId; // From Clerk middleware

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userId = user._id;

    // Validate required fields
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required"
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Find the review
    const review = await ProductReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the review belongs to the user
    if (review.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews"
      });
    }

    // Update the review
    review.rating = parseInt(rating);
    review.comment = comment.trim();
    await review.save();

    // Populate the updated review
    await review.populate('owner', 'fullName email');
    await review.populate('productId', 'name');

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review
    });

  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const clerkUserId = req.userId; // From Clerk middleware

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userId = user._id;

    // Find the review
    const review = await ProductReview.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the review belongs to the user
    if (review.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews"
      });
    }

    await ProductReview.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Check if user can review a product (for a specific order)
export const canUserReviewProduct = async (req, res) => {
  try {
    const { productId, orderId } = req.params;
    const clerkUserId = req.userId; // From Clerk middleware

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userId = user._id;

    // Check if the order exists and belongs to the user
    const order = await Order.findById(orderId);
    if (!order || order.owner.toString() !== userId.toString()) {
      return res.status(404).json({
        success: false,
        canReview: false,
        message: "Order not found or doesn't belong to you"
      });
    }

    // Check if the order is delivered
    if (order.Orderstatus !== "delivered") {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: "Product can only be reviewed after delivery"
      });
    }

    // Check if the product is in the order
    const productInOrder = order.products.find(
      item => {
        // Handle both old and new order structure
        if (item.productId) {
          return item.productId.toString() === productId;
        } else {
          // For older orders without productId, we can't verify product association
          // In this case, we'll return false to prevent reviews for older orders
          return false;
        }
      }
    );
    if (!productInOrder) {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: "Product not found in this order"
      });
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await ProductReview.findOne({
      owner: userId,
      productId: productId,
      orderId: orderId
    });

    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        hasReviewed: true,
        review: existingReview,
        message: "You have already reviewed this product for this order"
      });
    }

    res.status(200).json({
      success: true,
      canReview: true,
      hasReviewed: false,
      message: "You can review this product"
    });

  } catch (error) {
    console.error("Error checking review eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
