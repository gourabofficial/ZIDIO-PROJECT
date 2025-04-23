import express from "express";
import cors from "cors";
import connectDB from "./src/config/mongodb.js";
import dotenv from "dotenv";
import connectCloudinary from "./src/config/cloudinary.js";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

await connectDB();
await connectCloudinary();


// Middleware
app.use(cors());
app.use(express.json());


//routes
app.get("/", (req, res) => {
  res.send("Hari bol");
});
//user routes
app.use('/api/user', userRouter);
//auth routes
app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
