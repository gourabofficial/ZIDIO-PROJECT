import mongoose from "mongoose";

const paymentDetailsSchema = new mongoose.Schema({
  orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
   },
   paymentStatus: {
      type: String,
      required: true,
   },
  
   transactionId: {
      type: String,
      unique: true,
   },
   stripeUserId: {
      type: String,
   },
   receiptUrl: {
      type: String,
      unique: true,
   },
   paymentDate: {
      type: Date,
      default: Date.now,
   },
   paymentTime: {
      type: String,
      default: new Date().toLocaleTimeString(),
   },
   stripeSessionId: {
      type: String,
   },
   paymentType: {
      type: String,
      enum: ["CASH", "ONLINE"],
      default: "ONLINE",
   },
   amount: {
      type: Number,
      required: true,
   }
});

const PaymentDetails = mongoose.model("PaymentDetails", paymentDetailsSchema);

export default PaymentDetails;