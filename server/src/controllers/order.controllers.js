import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";
import PaymentDetails from "../model/paymentDetails.model.js";
import { Address } from "../model/address.model.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Generate unique tracking ID using UUID
const generateTrackingId = () => {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  return `ORD${uuid.substring(0, 12)}`;
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch orders for the user
    const orders = await Order.find({ owner: user._id })
      .populate('paymentDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalOrders = await Order.countDocuments({ owner: user._id });
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalOrders: totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    // Find user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find order and verify ownership
    const order = await Order.findOne({ 
      _id: orderId, 
      owner: user._id 
    })
    .populate('paymentDetails')
    .populate('owner', 'fullName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order: order,
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Validate user authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Extract request body data
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      orderSummary, 
      orderDate 
    } = req.body;

    console.log("Order request data:", req.body);

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required and must not be empty",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    if (paymentMethod !== "COD" && paymentMethod !== "cashOnDelivery") {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery (COD) payment method is currently supported",
      });
    }

    if (!orderSummary) {
      return res.status(400).json({
        success: false,
        message: "Order summary is required",
      });
    }

    // Find and validate user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate shipping address
    let validatedAddress;
    if (mongoose.Types.ObjectId.isValid(shippingAddress)) {
      // If it's an ObjectId, fetch the address
      validatedAddress = await Address.findById(shippingAddress);
      if (!validatedAddress) {
        return res.status(404).json({
          success: false,
          message: "Shipping address not found",
        });
      }
    } else if (typeof shippingAddress === 'object') {
      // If it's an address object, validate required fields
      const requiredFields = ['addressInfo', 'city', 'phoneNumber', 'country', 'state', 'pinCode'];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          return res.status(400).json({
            success: false,
            message: `Address field '${field}' is required`,
          });
        }
      }
      validatedAddress = shippingAddress;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping address format",
      });
    }

    // Validate and fetch products
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "Some products in the order are not found",
      });
    }

    // Validate items and calculate order total
    let calculatedTotal = 0;
    const orderProducts = [];

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      // Validate item structure
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${product.name}`,
        });
      }

      if (item.price !== product.price) {
        return res.status(400).json({
          success: false,
          message: `Price mismatch for product ${product.name}`,
        });
      }

      // Calculate actual price with discount
      const discount = item.discount || product.discount || 0;
      const discountedPrice = product.price - (product.price * discount / 100);
      const itemTotal = discountedPrice * item.quantity;
      calculatedTotal += itemTotal;

      // Add to order products array
      orderProducts.push({
        title: product.name,
        quantity: item.quantity,
        original_price: product.price,
        offer: discount,
        payable_price: discountedPrice,
      });
    }

    // Apply delivery charge logic: free delivery for orders ≥ ₹2000
    let deliveryCharge = 0;
    if (calculatedTotal < 2000) {
      deliveryCharge = orderSummary.shipping || 50; // Default delivery charge or from order summary
    }
    
    const finalTotal = calculatedTotal + deliveryCharge;

    // Validate calculated total with provided total (allow small variance for rounding)
    if (Math.abs(finalTotal - orderSummary.total) > 0.01) {
      console.warn("Order total calculation mismatch:", {
        calculatedSubtotal: calculatedTotal,
        deliveryCharge: deliveryCharge,
        calculatedTotal: finalTotal,
        providedTotal: orderSummary.total,
      });
    }

    // Generate unique tracking ID using UUID
    let trackingId = generateTrackingId();

    // Verify tracking ID uniqueness (extra safety check)
    const existingOrder = await Order.findOne({ trackingId });
    if (existingOrder) {
      // If by rare chance UUID collision occurs, generate new one
      trackingId = generateTrackingId();
      console.warn(`Tracking ID collision detected, using new ID: ${trackingId}`);
    }

    // Create the order first to get MongoDB ObjectId
    const newOrder = new Order({
      owner: user._id,
      trackingId: trackingId,
      products: orderProducts,
      totalAmount: finalTotal,
      Orderstatus: "pending",
      paymentMethod: "cashOnDelivery",
      paymentStatus: "unpaid",
      createdAt: orderDate ? new Date(orderDate) : new Date(),
    });

    // Save the order to get the MongoDB ObjectId
    await newOrder.save();

    // Create payment details using the MongoDB ObjectId
    const paymentDetails = new PaymentDetails({
      orderId: newOrder._id, // Use MongoDB ObjectId instead of UUID
      paymentStatus: "unpaid", // COD is unpaid until delivery
      paymentType: "CASH",
      amount: finalTotal,
      paymentDate: new Date(),
      paymentTime: new Date().toLocaleTimeString(),
    });

    await paymentDetails.save();

    // Update order with payment details reference
    newOrder.paymentDetails = paymentDetails._id;
    await newOrder.save();

    // Add order to user's orders array
    user.orders.push(newOrder._id);
    await user.save();

    // Populate the order for response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('owner', 'fullName email')
      .populate('paymentDetails');

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        orderId: populatedOrder._id.toString(), // Use MongoDB ObjectId as string
        trackingId: populatedOrder.trackingId,
        orderNumber: `#${populatedOrder.trackingId}`,
        status: populatedOrder.Orderstatus,
        totalAmount: populatedOrder.totalAmount,
        subtotal: calculatedTotal,
        deliveryCharge: deliveryCharge,
        freeDelivery: deliveryCharge === 0,
        paymentMethod: populatedOrder.paymentMethod,
        paymentStatus: populatedOrder.paymentStatus,
        items: populatedOrder.products,
        createdAt: populatedOrder.createdAt,
        shippingAddress: validatedAddress,
      },
    });

  } catch (error) {
    console.error("Error placing order:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate order detected. Please try again.",
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};