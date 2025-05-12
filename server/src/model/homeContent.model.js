import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema({
  newArrival: [
      {
         productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
         }
      }
  ],
  hotItems: [
    {
       productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
       }
    }
  ],
  trandingItems: [
    {
       productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
       }
    }
 ],
}, {timestamps: true});

export const HomeContent = mongoose.model("HomeContent", homeContentSchema);