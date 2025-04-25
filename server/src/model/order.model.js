import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  trackingId: {
    type: String,
    unique: true,
    required: true,
  },
  
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      
    },
  ],
  totalAmount: {
    type: Number, 
    required: true,
  },
  
  Orderstatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled",],
    default: "pending",
  },
  
  totalAmount: {
    type: Number,
    required: true
 },
  paymentMethod: {
    type: String,
    enum: ["online", "cashOnDelivery"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
 
 
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);