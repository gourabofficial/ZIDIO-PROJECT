import { clerkClient } from '@clerk/clerk-sdk-node';
import { User } from '../model/user.model.js';

export const isLogedin = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    try {
      const user = await clerkClient.users.getUser(userId);
      if (!user) {
        return res.status(401).json({
          message: "Invalid user",
          success: false
        });
      }
      
      req.userId = userId;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired authentication",
        success: false
      });
    }
  } catch (error) {
    console.log("Authentication failed ", error.message);
    return res.status(500).json({
      message: "Authentication error",
      success: false
    });
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    try {
      // Verify with Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      if (!clerkUser) {
        return res.status(401).json({
          message: "Invalid user",
          success: false
        });
      }
      
      req.userId = userId;

      // Get the user from your database
      const user = await User.findOne({ clerkId: userId });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false
        });
      }

      // Check if user is admin
      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Admin privileges required",
          success: false
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired authentication",
        success: false
      });
    }
  } catch (error) {
    console.log("Authentication failed ", error.message);
    return res.status(500).json({
      message: "Authentication error",
      success: false
    });
  }
}