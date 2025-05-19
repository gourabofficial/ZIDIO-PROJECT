import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import { Address } from "../model/address.model.js";

export const updateAvatar = async (req, res) => {
   try {
      const { avatarUrl } = req.body;
      const userId = req.userId;

      if (!avatarUrl) {
         return res.status(400).json({
            message: "Avatar URL is required",
            success: false
         });
      }

      const updatedUser = await User.findOneAndUpdate(
         { clerkId: userId },
         { avatar: avatarUrl },
         { new: true }
      );

      if (!updatedUser) {
         return res.status(404).json({
            message: "User not found",
            success: false
         });
      }

      return res.status(200).json({
         message: "Avatar updated successfully",
         success: true,
         user: updatedUser
      });
   } catch (error) {
      console.error("Error updating avatar:", error);
      return res.status(500).json({
         message: "Internal server error",
         success: false
      });
   }
};

export const updateUser = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const userId = req.userId;

    if (!fullName && !email) {
      return res.status(400).json({
        message: "Nothing to update",
        success: false
      });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const addAddress = async (req, res) => {
  try {
    const { addressInfo, city, state, country, pinCode } = req.body;
    const userId = req.userId;

    // Find user to get MongoDB _id
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Create new address with correct field names
    const newAddress = await Address.create({
      userId: user._id,  // Use the MongoDB _id from user
      addressInfo,
      city,
      state,
      country,
      pinCode
    });

    // Update user with address reference
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { address: newAddress._id },
      { new: true }
    );

    return res.status(201).json({
      message: "Address added successfully",
      success: true,
      address: newAddress,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const updateAddress = async (req, res) => {
  try {
    const { addressId, addressInfo, city, state, pinCode, country } = req.body;
    const clerkId = req.userId; // This is the Clerk ID from auth middleware

    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required",
        success: false
      });
    }

    // First find the user to get the MongoDB _id
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Now find the address using MongoDB _id
    const address = await Address.findOne({ 
      _id: addressId,
      userId: user._id // Use MongoDB _id instead of clerkId
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false
      });
    }

    // Update the address fields
    address.addressInfo = addressInfo;
    address.city = city;
    address.state = state;
    address.pinCode = pinCode;
    address.country = country;

    await address.save();

    return res.status(200).json({
      message: "Address updated successfully",
      success: true,
      address: address
    });
  } catch (error) {
    console.error("Error updating address:", error);
    console.error("Request body:", req.body); // Log request body for debugging
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        message: "Invalid address ID format",
        success: false
      });
    }

    const address = await Address.findById(addressId);
    
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      address
    });
  } catch (error) {
    console.error("Error in getAddressById:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

// add product wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const clerkId = req.userId;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false
      });
    }

    // Find user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(200).json({
        message: "Product already in wishlist",
        success: true
      });
    }

    // Add product to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Get updated user with populated wishlist
    const updatedUser = await User.findById(user._id).populate('wishlist');

    return res.status(200).json({
      message: "Product added to wishlist",
      success: true,
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
}

// remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const clerkId = req.userId;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false
      });
    }

    // Find user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // Remove product from wishlist
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== productId.toString()
    );
    await user.save();

    // Get updated user with populated wishlist
    const updatedUser = await User.findById(user._id).populate('wishlist');

    return res.status(200).json({
      message: "Product removed from wishlist",
      success: true,
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
}