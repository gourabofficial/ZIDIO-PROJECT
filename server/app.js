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
import reviewRouter from "./src/routes/review.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

await connectDB();

app.use(clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}));

const allowedOrigins = [
  "https://zidio-project-five.vercel.app",
  process.env.CLIENT_URL?.replace(/\/$/, ''),
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

console.log('Allowed origins:', allowedOrigins);

app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Root endpoint hit");
  res.json({ 
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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

// review routes
app.use('/api/review', reviewRouter)



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

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

export default app;