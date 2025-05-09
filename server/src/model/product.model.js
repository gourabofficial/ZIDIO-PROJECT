import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [
    {
      imageUrl: {
        type: String,
        required: true,
      },
      imageId: {
        type: String,
        required: true,
      },
    }
  ],
  category: {
    type: String,
    required: true
  },
  size: [
    {
      type: String,
      required: true,
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
    }
  ],
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isTranding: {
    type: Boolean,
    default: false,
  },
  isHotItem: {
    type: Boolean,
    default: false,
  },
  collections: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  },
  offerStatus: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);