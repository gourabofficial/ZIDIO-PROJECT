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
}

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
    const { street, city, state, country, zipCode } = req.body;
    const userId = req.userId;

    const Address = mongoose.model("Address");

    const newAddress = await Address.create({
      street,
      city,
      state,
      country,
      zipCode
    });

    if (!newAddress) {
      return res.status(500).json({
        message: "Failed to create address",
        success: false
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { address: newAddress._id },
      { new: true }
    );

    if (!updatedUser) {
      await Address.findByIdAndDelete(newAddress._id);

      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

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
    const { addressId, street, city, state, country, zipCode } = req.body;
    const userId = req.userId;

    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required",
        success: false
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    if (!user.address || user.address.toString() !== addressId) {
      return res.status(403).json({
        message: "Not authorized to update this address",
        success: false
      });
    }

    const Address = mongoose.model("Address");

    const updateData = {};
    if (street) updateData.street = street;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (country) updateData.country = country;
    if (zipCode) updateData.zipCode = zipCode;

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      updateData,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Address not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Address updated successfully",
      success: true,
      address: updatedAddress
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}