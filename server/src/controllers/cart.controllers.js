import { Cart } from "../model/cart.model.js";
import { User } from "../model/user.model.js"; // Add missing import

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        message:
          "Product ID and quantity are required. Quantity must be at least 1.",
        success: false,
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const isUerExit = await User.findOne({
      clerkId: userId,
    });

    if (!isUerExit) {
      return res.status(404).json({
        message: "User not Found in Database",
        success: false,
      });
    }

    if (!isUerExit.cart) {
      // Create a new cart for the user
      const newCart = await Cart.create({
        userId: isUerExit._id,
        items: [{ productId, quantity }],
      });

      // Update user with new cart reference
      await User.findByIdAndUpdate(isUerExit._id, { cart: newCart._id });

      return res.status(201).json({
        message: "Product added to cart successfully",
        success: true,
        cart: newCart,
      });
    } else {
      const isCartExit = await Cart.findById(isUerExit.cart);
      if (!isCartExit) {
        return res.status(404).json({
          message: "Cart not found ",
          success: false,
        });
      }

      // Check if product already exists in cart
      const existingItemIndex = isCartExit.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        // Product already in cart, update quantity
        isCartExit.items[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // Product not in cart, add it
        isCartExit.items.push({ productId, quantity });
      }

      // Save updated cart
      await isCartExit.save();

      return res.status(200).json({
        message: "Product added to cart successfully",
        success: true,
        cart: isCartExit,
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user has a cart
    if (!user.cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Find cart
    const cart = await Cart.findById(user.cart);
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Find product in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    // Remove the entire item from cart regardless of quantity
    cart.items.splice(itemIndex, 1);

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      success: true,
      cart: cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Function to clear the entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user has a cart
    if (!user.cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Find cart and clear all items
    const cart = await Cart.findById(user.cart);
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Clear all items
    cart.items = [];

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      success: true,
      cart: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity, action } = req.body;

    // Validate input
    if (!productId || !quantity || quantity < 1 || !action) {
      return res.status(400).json({
        message:
          "Product ID, quantity, and action (increase/decrease) are required",
        success: false,
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user has a cart
    if (!user.cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Find cart
    const cart = await Cart.findById(user.cart);
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Find product in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    // Update quantity based on action
    if (action === "increase") {
      cart.items[itemIndex].quantity += parseInt(quantity);
      await cart.save();
      return res.status(200).json({
        message: "Product quantity increased successfully",
        success: true,
        cart: cart,
      });
    } else if (action === "decrease") {
      if (quantity >= cart.items[itemIndex].quantity) {
        // Remove item if requested quantity exceeds or equals current quantity
        cart.items.splice(itemIndex, 1);
      } else {
        // Otherwise reduce the quantity
        cart.items[itemIndex].quantity -= parseInt(quantity);
      }
      await cart.save();
      return res.status(200).json({
        message: "Product quantity decreased successfully",
        success: true,
        cart: cart,
      });
    } else {
      return res.status(400).json({
        message: "Invalid action. Use 'increase' or 'decrease'",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
