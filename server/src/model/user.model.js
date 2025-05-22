import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,  
      trim: true
      
    },
    // forgen key
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,  // add []
      ref: "Product",
    }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
