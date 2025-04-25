import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
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
  
  products: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  ]

},{timestamps:true})

export const Collection = mongoose.model("Collection", collectionSchema);