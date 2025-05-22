import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      addressInfo: {
         type: String,
         required: true,

      },
      city: {
         type: String,
         required: true,
      },
      phoneNumber: {
         type: String,
         required: true,
         unique: true,
         trim: true
      },
      country: {
         type: String,
         required: true,

      },
      state: {
         type: String,
         required: true,
      },
      pinCode: {
         type: String,
         required: true,
      }

   },
   { timestamps: true }
);

export const Address = mongoose.model("Address", addressSchema);
