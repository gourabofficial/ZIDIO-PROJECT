import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => { 
  try {
    const connectionDB = await mongoose.connect(`${process.env.MONGOBD_URI}/Zidio-Project`);
    console.log(`MongoDB Connected. ${connectionDB.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    
  }
}


export default connectDB;