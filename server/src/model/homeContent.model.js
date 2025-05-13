import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema({
  newArrival: [
      {
         productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
         },
         product_id: {
            type: String
         }
      }
  ],
  hotItems: [
    {
       productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
       },
       product_id: {
          type: String
       }
    }
  ],
  trandingItems: [  // Fixed spelling from "trandingItems" to "trendingItems"
    {
       productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
       },
       product_id: {
          type: String
       }
    }
  ],
}, {timestamps: true});

// Support both ways of referencing products
homeContentSchema.pre('find', function(next) {
  this.populate({
    path: 'newArrival.productId hotItems.productId trandingItems.productId',  // Updated to match corrected field name
    select: 'name price images category product_id'
  });
  next();
});

export const HomeContent = mongoose.model("HomeContent", homeContentSchema);