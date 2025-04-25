import mongoose from "mongoose";

const ProductReviewSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
 },
 productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
 },
 rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
 },
 comment: {
    type: String,
    required: true,
    trim: true,
  },
 
}, { timestamps: true })

export const ProductReview = mongoose.model("ProductReview", ProductReviewSchema);