import express from "express";
import cors from "cors";
import connectDB from "./src/config/mongodb.js";
import dotenv from "dotenv";
import { clerkMiddleware } from '@clerk/express';
import userRouter from "./src/routes/user.routes.js";
import productRouter from "./src/routes/product.routes.js"
import adminRouter from "./src/routes/admin.routes.js";
import publicRouter from "./src/routes/public.routes.js";
import cartRouter from "./src/routes/cart.routes.js";
import wishlistRouter from "./src/routes/wishlist.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

await connectDB();

app.use(clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}));

const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});



// user routes
app.use('/api/user', userRouter);
// product routes
app.use('/api/product', productRouter)

//admin routes
app.use('/api/admin', adminRouter)

//public routes
app.use('/api/public', publicRouter)

//cart routes
app.use('/api/cart', cartRouter);

// wishlist routes
app.use('/api/wishlist',wishlistRouter)



app.listen(port, () => {
  console.log(`Server is running on PORT http://localhost:${port}/`);
  console.log(`Allowed origins for CORS: ${allowedOrigins.join(', ')}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please close the application using this port and try again.`);
  } else {
    console.error('An error occurred when starting the server:', err);
  }
  process.exit(1);
});