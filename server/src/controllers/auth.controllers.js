import { clerkClient } from '@clerk/clerk-sdk-node';
import { User } from '../model/user.model.js';

export const checkedUserLogin = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(400).json({
        message: "Clerk ID is required",
        success: false
      });
    }

    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(clerkId);
    } catch (error) {
      return res.status(404).json({
        message: "Failed to fetch user from Clerk",
        success: false,
        error: error.message
      });
    }

    if (!clerkUser) {
      return res.status(404).json({
        message: "User not found in Clerk",
        success: false
      });
    }

    const emailObject = clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0
      ? clerkUser.emailAddresses[0]
      : null;

    const email = emailObject ? emailObject.emailAddress : null;
    
    const isAdmin = clerkUser.publicMetadata?.role === "admin";

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false
      });
    }

    // Get Clerk fullName only for new users
    const clerkFullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    // Use email username as fallback
    const fallbackName = email.split('@')[0];

    let existingUser = await User.findOne({ clerkId });

    // If no user found by clerkId, check by email 
    if (!existingUser && email) {
      const userByEmail = await User.findOne({ email });
      
      if (userByEmail) {
        // Update the existing user with the new clerkId but keep their name
        existingUser = await User.findByIdAndUpdate(
          userByEmail._id,
          { clerkId },  // Don't update fullName here
          { new: true }
        );z
      }
    }

    if (!existingUser) {
      // For new users, use Clerk name
      const newUser = await User.create({
        clerkId,
        fullName: clerkFullName || fallbackName,
        email,
        role: isAdmin ? "admin" : "user"
      });

      if (!newUser) {
        return res.status(500).json({
          message: "Failed to create user",
          success: false
        });
      }

      // Populate the newly created user's cart
      const populatedUser = await User.findById(newUser._id).populate({
        path: 'cart',
        model: 'Cart',
        populate: {
          path: 'items.productId',
          model: 'Product'
        }
      });

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: populatedUser
      });
    } else {
      // For existing users, only update email and role, NOT the name
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          email,
          role: isAdmin ? "admin" : existingUser.role
          // fullName is intentionally not updated here
        },
        { new: true }
      ).populate({
        path: 'cart',
        model: 'Cart',
        populate: {
          path: 'items.productId',
          model: 'Product'
        }
      });

      // console.log("Updated user:", updatedUser);

      return res.status(200).json({
        message: "User already exists",
        success: true,
        user: updatedUser || existingUser
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
}


// admin authentication 
export const adminLogin = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({
        message: "Unauthorized, user ID is required",
        success: false
      });
    }

    // Get user from Clerk
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(clerkId);
    } catch (error) {
      return res.status(404).json({
        message: "Failed to fetch user from Clerk",
        success: false,
        error: error.message
      });
    }

    // Get user from database with populated cart
    const user = await User.findOne({ clerkId }).populate({
      path: 'cart',
      model: 'Cart',
      populate: {
        path: 'items.productId',
        model: 'Product'
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "Admin not found",
        success: false
      });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required",
        success: false
      });
    }

    return res.status(200).json({
      message: "Admin login successful",
      success: true,
      admin: {
        id: user._id,
        clerkId: user.clerkId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        cart: user.cart
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
}