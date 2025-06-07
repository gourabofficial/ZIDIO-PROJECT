import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  paymentDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentDetails",
   
  },
  trackingId: {
    type: String,
    unique: true,
    required: true,
  },

  products: [
    {
      title: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      selectedSize: {
            type: String,
            enum: ["S", "M", "L", "XL", "XXL"],
            required: true,
         },
      original_price: {
        type: Number,
        required: true,
      },
      offer: {
        type: Number,
        default: 0,
      },
      payable_price: {
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
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "return",],
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
    enum: ["paid", "unpaid", "failed"],
    default: "unpaid",
  },
  sessionId: {
    type: String,
    sparse: true,
  },
  paymentUrl: {
    type: String,
    sparse: true,
  },


}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);