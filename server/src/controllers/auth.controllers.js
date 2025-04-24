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

    const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

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

    // If fullName is empty, use email username as fallback
    const effectiveFullName = fullName || email.split('@')[0];

    let existingUser = await User.findOne({ clerkId });

    // If no user found by clerkId, check by email 
    if (!existingUser && email) {
      const userByEmail = await User.findOne({ email });
      
      if (userByEmail) {
        // Update the existing user with the new clerkId
        existingUser = await User.findByIdAndUpdate(
          userByEmail._id,
          { clerkId, fullName: effectiveFullName },
          { new: true }
        );
      }
    }

    if (!existingUser) {
      const newUser = await User.create({
        clerkId,
        fullName: effectiveFullName,
        email,
        role: isAdmin ? "admin" : "user"
      });

      if (!newUser) {
        return res.status(500).json({
          message: "Failed to create user",
          success: false
        });
      }

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: newUser
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        {
          fullName: effectiveFullName,
          email,
          role: isAdmin ? "admin" : existingUser.role
        },
        { new: true }
      );

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