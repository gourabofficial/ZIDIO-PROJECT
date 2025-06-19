
import { clerkClient } from '@clerk/express';
import { User } from '../model/user.model.js';

export const isLogedin = async (req, res, next) => {
  try {
    // Check for userId from Clerk middleware
    let userId = req.auth?.userId;

    // If no userId from Clerk middleware, try to extract from Authorization header
    if (!userId) {
       const authHeader = req.headers.authorization;
       console.log('isLogedin middleware - Authorization header:', authHeader);
       
       if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          console.log('isLogedin middleware - Extracted token:', token ? 'Present' : 'Not present');
          
          try {
             // Verify the token with Clerk
             const session = await clerkClient.verifyToken(token);
             userId = session.sub;
             console.log('isLogedin middleware - Token verified, userId:', userId);
          } catch (tokenError) {
             console.error('isLogedin middleware - Token verification failed:', tokenError);
             return res.status(401).json({
                success: false,
                message: "Invalid token"
             });
          }
       }
    }

    if (!userId) {
       console.log('isLogedin middleware - No userId found');
       return res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required"
       });
    }

    try {
      //  console.log('isLogedin middleware - Attempting to get user with ID:', userId);
      const response = await clerkClient.users.getUser(userId);
      //  console.log('isLogedin middleware - Clerk response:', response.id);

      if (!response) {
        return res.status(401).json({
          message: "Invalid user",
          success: false
        });
      }
      
      // Store userId in request for use in controllers  
      req.userId = response.id;
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
    
    // Check for userId from Clerk middleware
    let userId = req.auth?.userId;

    // If no userId from Clerk middleware, try to extract from Authorization header
    if (!userId) {
       const authHeader = req.headers.authorization;
       
       if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          
          try {
             // Verify the token with Clerk
             const session = await clerkClient.verifyToken(token);
             userId = session.sub;
          } catch (tokenError) {
             return res.status(401).json({
                success: false,
                message: "Invalid token"
             });
          }
       }
    }

    if (!userId) {
       return res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required"
       });
    }

    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      
      if (!clerkUser) {
        return res.status(401).json({
          message: "Invalid user",
          success: false
        });
      }
      
      // Store userId in request for use in controllers  
      req.userId = clerkUser.id;

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