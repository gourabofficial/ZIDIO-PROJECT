import { Order } from "../model/order.model.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";
import { Inventory } from "../model/inventory.model.js";
import PaymentDetails from "../model/paymentDetails.model.js";
import { Address } from "../model/address.model.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import Stripe from "stripe";
import { createStripeCheckoutSession, verifyStripeWebhook } from "../utils/stripe.js";

// Utility function to deduct stock for order items
const deductStockForOrder = async (orderProducts) => {
  try {
    for (const item of orderProducts) {
      const inventory = await Inventory.findOne({ productId: item.productId });
      
      if (inventory) {
        // Find the specific size stock entry
        const sizeStock = inventory.stocks.find(stock => stock.size === item.selectedSize);
        
        if (sizeStock && sizeStock.quantity >= item.quantity) {
          // Deduct the stock
          sizeStock.quantity -= item.quantity;
          
          // Recalculate total quantity
          inventory.totalQuantity = inventory.stocks.reduce((total, stock) => total + stock.quantity, 0);
          
          // Save the updated inventory
          await inventory.save();
          
          console.log(`Stock deducted for product ${item.productId}, size ${item.selectedSize}: ${item.quantity} units`);
        } else {
          console.error(`Insufficient stock for product ${item.productId}, size ${item.selectedSize}`);
          // Note: At this point, the order validation should have already caught this,
          // but this is a safeguard in case of race conditions
        }
      } else {
        console.error(`Inventory not found for product ${item.productId}`);
      }
    }
  } catch (error) {
    console.error('Error deducting stock:', error);
    // Note: We don't throw here to avoid disrupting the order process
    // Stock discrepancies can be handled through inventory management
  }
};

// Utility function to restore stock for cancelled orders
const restoreStockForOrder = async (orderProducts) => {
  try {
    for (const item of orderProducts) {
      const inventory = await Inventory.findOne({ productId: item.productId });
      
      if (inventory) {
        // Find the specific size stock entry
        const sizeStock = inventory.stocks.find(stock => stock.size === item.selectedSize);
        
        if (sizeStock) {
          // Restore the stock
          sizeStock.quantity += item.quantity;
          
          // Recalculate total quantity
          inventory.totalQuantity = inventory.stocks.reduce((total, stock) => total + stock.quantity, 0);
          
          // Save the updated inventory
          await inventory.save();
          
          console.log(`Stock restored for product ${item.productId}, size ${item.selectedSize}: ${item.quantity} units`);
        }
      } else {
        console.error(`Inventory not found for product ${item.productId}`);
      }
    }
  } catch (error) {
    console.error('Error restoring stock:', error);
  }
};

// Generate unique tracking ID using UUID
const generateTrackingId = () => {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  return `ORD${uuid.substring(0, 12)}`;
};

// stripe 

const getStripe = () => {
   return new Stripe(process.env.STRIPE_SECRET_KEY);
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
    
    // Extract request body data
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      orderSummary, 
      orderDate,
      orderType // Add this to track if it's a buyNow or cart order
    } = req.body;

    // console.log("Order request data:", req.body);

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

    if (!["COD", "cashOnDelivery", "ONLINE", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Supported methods: COD, ONLINE",
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

      // Validate selectedSize field
      if (!item.selectedSize || typeof item.selectedSize !== 'string' || item.selectedSize.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Selected size is required for product ${product.name}`,
        });
      }

      // Validate selectedSize against allowed enum values
      const allowedSizes = ["S", "M", "L", "XL", "XXL"];
      if (!allowedSizes.includes(item.selectedSize)) {
        return res.status(400).json({
          success: false,
          message: `Invalid size '${item.selectedSize}' for product ${product.name}. Allowed sizes: ${allowedSizes.join(', ')}`,
        });
      }

      // Check inventory availability for the selected size
      const inventory = await Inventory.findOne({ productId: product._id });
      if (!inventory) {
        return res.status(400).json({
          success: false,
          message: `Inventory not found for product ${product.name}`,
        });
      }

      const sizeStock = inventory.stocks.find(stock => stock.size === item.selectedSize);
      if (!sizeStock || sizeStock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} in size ${item.selectedSize}. Available: ${sizeStock ? sizeStock.quantity : 0}, Requested: ${item.quantity}`,
        });
      }

      // Calculate actual price with discount
      const discount = item.discount || product.discount || 0;
      const discountedPrice = product.price - (product.price * discount / 100);
      const itemTotal = discountedPrice * item.quantity;
      calculatedTotal += itemTotal;

      // Add to order products array
      orderProducts.push({
        productId: product._id,
        title: product.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize, // Add the selectedSize field
        original_price: product.price,
        offer: discount,
        payable_price: discountedPrice,
      });
    }

    let deliveryCharge = 0;
    if (calculatedTotal < 2000) {
      deliveryCharge = orderSummary.shipping || 50; 
    }
    
    const finalTotal = calculatedTotal + deliveryCharge;

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

    // Determine payment method and status
    const isOnlinePayment = paymentMethod === "ONLINE" || paymentMethod === "online";
    const normalizedPaymentMethod = isOnlinePayment ? "online" : "cashOnDelivery";
    const initialPaymentStatus = isOnlinePayment ? "unpaid" : "unpaid";
    const initialOrderStatus = isOnlinePayment ? "pending" : "pending";

    // Create the order with optional orderType metadata
    const newOrder = new Order({
      owner: user._id,
      trackingId: trackingId,
      products: orderProducts,
      totalAmount: finalTotal,
      Orderstatus: initialOrderStatus,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: initialPaymentStatus,
      createdAt: orderDate ? new Date(orderDate) : new Date(),
      // You can add orderType to your schema if you want to track this
      // orderType: orderType || 'cart'
    });

    // Save the order to get the MongoDB ObjectId
    await newOrder.save();

    // Create payment details using the MongoDB ObjectId
    const paymentDetails = new PaymentDetails({
      orderId: newOrder._id, // Use MongoDB ObjectId instead of UUID
      paymentStatus: initialPaymentStatus,
      paymentType: isOnlinePayment ? "ONLINE" : "CASH",
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

    // For COD orders, deduct stock immediately. For online orders, wait for payment confirmation
    if (!isOnlinePayment) {
      await deductStockForOrder(orderProducts);
    }

    // Handle online payment
    if (isOnlinePayment) {
      try {
        // Create Stripe checkout session
        const stripeSession = await createStripeCheckoutSession({
          orderType: "ONLINE",
          purchaseProducts: orderProducts,
          deliveryCharge: deliveryCharge,
          stripeCustomerId: user.stripeCustomerId,
          trackId: trackingId,
          payInOnlineAmount: finalTotal,
          userEmail: user.email,
          userName: user.fullName,
          orderId: newOrder._id.toString()
        });

        if (!stripeSession || !stripeSession.url) {
          // If payment session creation fails, clean up the order
          await Order.findByIdAndDelete(newOrder._id);
          await PaymentDetails.findByIdAndDelete(paymentDetails._id);
          await User.findByIdAndUpdate(user._id, { $pull: { orders: newOrder._id } });
          
          return res.status(500).json({
            success: false,
            message: "Error creating checkout session",
          });
        }

        // Update order with stripe session information
        newOrder.sessionId = stripeSession.id;
        newOrder.paymentUrl = stripeSession.url;
        await newOrder.save();

        // Update payment details with session info
        paymentDetails.stripeSessionId = stripeSession.id;
        if (stripeSession.customerId) {
          paymentDetails.stripeUserId = stripeSession.customerId;
          // Update user with stripe customer ID for future use
          user.stripeCustomerId = stripeSession.customerId;
          await user.save();
        }
        await paymentDetails.save();

        // Return response with payment URL for online payment
        return res.status(201).json({
          success: true,
          message: "Order created successfully. Redirecting to payment...",
          order: {
            orderId: newOrder._id.toString(),
            trackingId: newOrder.trackingId,
            orderNumber: `#${newOrder.trackingId}`,
            status: newOrder.Orderstatus,
            totalAmount: newOrder.totalAmount,
            subtotal: calculatedTotal,
            deliveryCharge: deliveryCharge,
            freeDelivery: deliveryCharge === 0,
            paymentMethod: newOrder.paymentMethod,
            paymentStatus: newOrder.paymentStatus,
            paymentUrl: stripeSession.url,
            sessionId: stripeSession.id,
            items: newOrder.products,
            createdAt: newOrder.createdAt,
            shippingAddress: validatedAddress,
          },
        });

      } catch (error) {
        console.error("Error creating Stripe session:", error);
        
        // Clean up the order if payment session creation fails
        await Order.findByIdAndDelete(newOrder._id);
        await PaymentDetails.findByIdAndDelete(paymentDetails._id);
        await User.findByIdAndUpdate(user._id, { $pull: { orders: newOrder._id } });
        
        return res.status(500).json({
          success: false,
          message: "Failed to create payment session",
          error: error.message,
        });
      }
    }

    // For COD orders, populate and return the order directly
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

// Stripe webhook handler for payment events
export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  try {
    // Verify webhook signature
    const event = verifyStripeWebhook(req.body, signature);
    
    switch (event.type) {
      case 'checkout.session.completed':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Handle successful payment
const handlePaymentSuccess = async (session) => {
  try {
    const { orderId, trackId } = session.metadata;
  
    
    if (!orderId) {
      console.error('No orderId found in session metadata');
      return;
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    order.paymentStatus = 'paid';
    order.Orderstatus = 'processing';
    await order.save();

    // Deduct stock for online payment orders when payment is confirmed
    await deductStockForOrder(order.products);

    // Update payment details
    const paymentDetails = await PaymentDetails.findOne({ orderId: orderId });
    if (paymentDetails) {
      paymentDetails.paymentStatus = 'paid';
      paymentDetails.transactionId = session.payment_intent;
      paymentDetails.stripeSessionId = session.id;
      paymentDetails.paymentDate = new Date();
      await paymentDetails.save();
    }

    console.log(`Payment successful for order ${orderId}`);
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const { orderId } = paymentIntent.metadata;
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return;
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    order.paymentStatus = 'failed';
    order.Orderstatus = 'cancelled';
    await order.save();

    // Restore stock for failed payment orders
    await restoreStockForOrder(order.products);

    // Update payment details
    const paymentDetails = await PaymentDetails.findOne({ orderId: orderId });
    if (paymentDetails) {
      paymentDetails.paymentStatus = 'failed';
      await paymentDetails.save();
    }

    console.log(`Payment failed for order ${orderId}`);
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
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

    // Find payment details by session ID
    const paymentDetails = await PaymentDetails.findOne({ stripeSessionId: sessionId })
      .populate('orderId');

    if (!paymentDetails) {
      return res.status(404).json({
        success: false,
        message: "Payment session not found",
      });
    }

    // Verify order ownership
    if (paymentDetails.orderId.owner.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to payment information",
      });
    }

    // Get Stripe session details
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      message: "Payment status retrieved successfully",
      payment: {
        sessionId: sessionId,
        paymentStatus: paymentDetails.paymentStatus,
        orderStatus: paymentDetails.orderId.Orderstatus,
        orderId: paymentDetails.orderId._id,
        trackingId: paymentDetails.orderId.trackingId,
        amount: paymentDetails.amount,
        stripeStatus: session.payment_status,
      },
    });

  } catch (error) {
    console.error("Error fetching payment status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
      error: error.message,
    });
  }
};

// Verify payment and update status
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.userId;

    // Enhanced input validation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
        error: "UNAUTHORIZED_ACCESS"
      });
    }

    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Valid session ID is required",
        error: "INVALID_SESSION_ID"
      });
    }

    // Validate session ID format (Stripe session IDs start with 'cs_')
    if (!sessionId.startsWith('cs_')) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID format",
        error: "MALFORMED_SESSION_ID"
      });
    }

    // Find and validate user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
    }

    // Find payment details by session ID with populated order
    const paymentDetails = await PaymentDetails.findOne({ stripeSessionId: sessionId })
      .populate({
        path: 'orderId',
        populate: {
          path: 'owner',
          select: 'clerkId fullName email'
        }
      });

    if (!paymentDetails) {
      return res.status(404).json({
        success: false,
        message: "Payment session not found or invalid",
        error: "PAYMENT_SESSION_NOT_FOUND"
      });
    }

    // Enhanced security: Verify order ownership
    if (!paymentDetails.orderId || 
        paymentDetails.orderId.owner._id.toString() !== user._id.toString() ||
        paymentDetails.orderId.owner.clerkId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to payment information",
        error: "UNAUTHORIZED_PAYMENT_ACCESS"
      });
    }

    const order = paymentDetails.orderId;

    // Validate order status - ensure order is still valid for payment
    if (order.Orderstatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Cannot verify payment for cancelled order",
        error: "ORDER_CANCELLED"
      });
    }

    // Check if payment is already verified
    if (paymentDetails.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: "Payment already verified and processed",
        payment: {
          sessionId: sessionId,
          paymentStatus: paymentDetails.paymentStatus,
          orderStatus: order.Orderstatus,
          orderId: order._id,
          trackingId: order.trackingId,
          amount: paymentDetails.amount,
          transactionId: paymentDetails.transactionId,
          paymentDate: paymentDetails.paymentDate,
          isAlreadyVerified: true,
          verificationTimestamp: new Date().toISOString()
        },
      });
    }

    // Get and validate Stripe session details
    const stripe = getStripe();
    let session;
    
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent', 'customer']
      });
    } catch (stripeError) {
      console.error("Stripe session retrieval error:", stripeError);
      return res.status(400).json({
        success: false,
        message: "Invalid or expired payment session",
        error: "STRIPE_SESSION_INVALID"
      });
    }

    // Enhanced Stripe data validation
    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Payment session data not available",
        error: "SESSION_DATA_UNAVAILABLE"
      });
    }

    // Validate payment amount matches order amount
    const sessionAmountInCents = session.amount_total;
    const orderAmountInCents = Math.round(paymentDetails.amount * 100);
    
    if (sessionAmountInCents !== orderAmountInCents) {
      console.error("Amount mismatch detected:", {
        sessionAmount: sessionAmountInCents,
        orderAmount: orderAmountInCents,
        sessionId: sessionId,
        orderId: order._id
      });
      
      return res.status(400).json({
        success: false,
        message: "Payment amount validation failed",
        error: "AMOUNT_MISMATCH"
      });
    }

    // Validate payment method consistency
    if (order.paymentMethod !== 'online') {
      return res.status(400).json({
        success: false,
        message: "Payment method mismatch - order is not for online payment",
        error: "PAYMENT_METHOD_MISMATCH"
      });
    }

    // Check Stripe payment status
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: "Payment not completed yet",
        payment: {
          sessionId: sessionId,
          paymentStatus: paymentDetails.paymentStatus,
          orderStatus: order.Orderstatus,
          stripeStatus: session.payment_status,
          paymentUrl: session.url || order.paymentUrl
        },
        error: "PAYMENT_INCOMPLETE"
      });
    }

    // Additional validation: Check if session is expired
    const sessionCreated = new Date(session.created * 1000);
    const now = new Date();
    const hoursDifference = (now - sessionCreated) / (1000 * 60 * 60);
    
    if (hoursDifference > 24) { // Sessions older than 24 hours
      return res.status(400).json({
        success: false,
        message: "Payment session has expired",
        error: "SESSION_EXPIRED"
      });
    }

    // Validate payment intent if available
    if (session.payment_intent) {
      const paymentIntent = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent.id;
        
      if (!paymentIntent) {
        return res.status(400).json({
          success: false,
          message: "Payment intent validation failed",
          error: "INVALID_PAYMENT_INTENT"
        });
      }
    }

    // Start database transaction for atomic updates
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
      // Update payment status from unpaid to paid
      paymentDetails.paymentStatus = 'paid';
      paymentDetails.transactionId = session.payment_intent?.id || session.payment_intent;
      paymentDetails.paymentDate = new Date();
      
      // Add additional Stripe metadata
      if (session.customer) {
        // Extract customer ID from customer object or use the string directly
        paymentDetails.stripeUserId = typeof session.customer === 'string' 
          ? session.customer 
          : session.customer.id;
      }
      
      await paymentDetails.save({ session: mongoSession });

      // Update order status
      order.paymentStatus = 'paid';
      order.Orderstatus = 'processing';
      await order.save({ session: mongoSession });

      // Commit the transaction
      await mongoSession.commitTransaction();

      // Log successful payment verification
      console.log(`Payment verified successfully for order ${order._id}, session ${sessionId}`);

      return res.status(200).json({
        success: true,
        message: "Payment verified and processed successfully",
        payment: {
          sessionId: sessionId,
          paymentStatus: paymentDetails.paymentStatus,
          orderStatus: order.Orderstatus,
          orderId: order._id,
          trackingId: order.trackingId,
          amount: paymentDetails.amount,
          transactionId: paymentDetails.transactionId,
          paymentDate: paymentDetails.paymentDate,
          isAlreadyVerified: false,
          verificationTimestamp: new Date().toISOString(),
          stripePaymentStatus: session.payment_status
        },
      });

    } catch (dbError) {
      // Rollback transaction on database error
      await mongoSession.abortTransaction();
      throw dbError;
    } finally {
      mongoSession.endSession();
    }

  } catch (error) {
    console.error("Error verifying payment:", error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Data validation error",
        error: "VALIDATION_ERROR",
        details: error.message
      });
    }

    if (error.code === 'resource_missing' || error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: "Invalid payment session",
        error: "STRIPE_ERROR"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: "INTERNAL_SERVER_ERROR",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};