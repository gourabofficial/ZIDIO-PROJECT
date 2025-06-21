
import { clerkClient } from '@clerk/express';
import { User } from '../model/user.model.js';

// Helper function to extract user ID from JWT token manually (as fallback)
const extractUserIdFromToken = (token) => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    
    // Clerk tokens usually have 'sub' field with user ID
    return payload.sub || payload.userId || payload.user_id;
  } catch (error) {
    console.error('Failed to extract user ID from token:', error);
    return null;
  }
};

export const isLogedin = async (req, res, next) => {
  try {
    // Check for userId from Clerk middleware first
    let userId = req.auth?.userId;
    
    console.log('isLogedin middleware - userId from req.auth:', userId);

    // If no userId from middleware, try to extract from Authorization header
    if (!userId) {
      const authHeader = req.headers.authorization;
      console.log('isLogedin middleware - Authorization header:', authHeader ? 'Present' : 'Missing');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('isLogedin middleware - Extracted token length:', token ? token.length : 0);
        
        // Try to extract user ID from token manually as fallback
        userId = extractUserIdFromToken(token);
        console.log('isLogedin middleware - Extracted userId from token:', userId);
      }
    }

    if (!userId) {
       console.log('isLogedin middleware - No userId found');
       return res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required. Please log in."
       });
    }

    try {
      console.log('isLogedin middleware - Attempting to get user with ID:', userId);
      const response = await clerkClient.users.getUser(userId);

      if (!response) {
        return res.status(401).json({
          message: "Invalid user",
          success: false
        });
      }
      
      // Store userId in request for use in controllers  
      req.userId = response.id;
      console.log('isLogedin middleware - Authentication successful');
      next();
    } catch (error) {
      console.error('isLogedin middleware - Clerk error:', error);
      return res.status(401).json({
        message: "Invalid or expired authentication",
        success: false
      });
    }
  } catch (error) {
    console.error("isLogedin middleware - General error:", error.message);
    return res.status(500).json({
      message: "Authentication error",
      success: false
    });
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    // Check for userId from Clerk middleware first
    let userId = req.auth?.userId;
    
    console.log('isAdmin middleware - userId from req.auth:', userId);

    // If no userId from middleware, try to extract from Authorization header
    if (!userId) {
      const authHeader = req.headers.authorization;
      console.log('isAdmin middleware - Authorization header:', authHeader ? 'Present' : 'Missing');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        console.log('isAdmin middleware - Extracted token length:', token ? token.length : 0);
        
        // Try to extract user ID from token manually as fallback
        userId = extractUserIdFromToken(token);
        console.log('isAdmin middleware - Extracted userId from token:', userId);
      }
    }

    if (!userId) {
       console.log('isAdmin middleware - No userId found');
       return res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required. Please log in."
       });
    }

    try {
      console.log('isAdmin middleware - Attempting to get user with ID:', userId);
      const clerkUser = await clerkClient.users.getUser(userId);
      
      if (!clerkUser) {
        console.log('isAdmin middleware - Clerk user not found');
        return res.status(401).json({
          message: "Invalid user",
          success: false
        });
      }
      
      // Store userId in request for use in controllers  
      req.userId = clerkUser.id;
      console.log('isAdmin middleware - Clerk user found, checking database user');

      // Get the user from your database
      const user = await User.findOne({ clerkId: userId });

      if (!user) {
        console.log('isAdmin middleware - Database user not found for clerkId:', userId);
        return res.status(404).json({
          message: "User not found in database. Please contact support.",
          success: false
        });
      }

      console.log('isAdmin middleware - Database user found:', {
        id: user._id,
        email: user.email,
        role: user.role
      });

      // Check if user is admin
      if (user.role !== "admin") {
        console.log('isAdmin middleware - User does not have admin role. Current role:', user.role);
        return res.status(403).json({
          message: `Access denied. Admin privileges required. Your current role: ${user.role}`,
          success: false,
          userRole: user.role
        });
      }

      console.log('isAdmin middleware - Admin authentication successful');
      next();
    } catch (error) {
      console.error('isAdmin middleware - Database/Clerk error:', error);
      return res.status(401).json({
        message: "Invalid or expired authentication",
        success: false
      });
    }
  } catch (error) {
    console.error("isAdmin middleware - General authentication error:", error.message);
    return res.status(500).json({
      message: "Authentication error",
      success: false
    });
  }
}