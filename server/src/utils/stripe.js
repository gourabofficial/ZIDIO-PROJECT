import Stripe from "stripe";

const getStripe = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Create Stripe checkout session
export const createStripeCheckoutSession = async ({
  orderType,
  purchaseProducts,
  deliveryCharge,
  stripeCustomerId,
  trackId,
  payInOnlineAmount,
  userEmail,
  userName,
  orderId
}) => {
  try {
    const stripe = getStripe();

    // Create line items for Stripe
    const lineItems = purchaseProducts.map(product => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.title,
          metadata: {
            productId: (product.productId || product._id).toString(),
          },
        },
        unit_amount: Math.round(product.payable_price * 100), // Convert to paise
      },
      quantity: product.quantity,
    }));

    // Add delivery charge as a separate line item if applicable
    if (deliveryCharge > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Delivery Charge',
          },
          unit_amount: Math.round(deliveryCharge * 100), // Convert to paise
        },
        quantity: 1,
      });
    }

    // Create Stripe customer if not exists
    let customer;
    if (stripeCustomerId) {
      try {
        customer = await stripe.customers.retrieve(stripeCustomerId);
      } catch (error) {
        // If customer doesn't exist, create new one
        customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
        });
      }
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel?order_id=${orderId}`,
      metadata: {
        orderId: orderId.toString(),
        trackId: trackId.toString(),
        orderType: orderType,
        userEmail: userEmail,
      },
      payment_intent_data: {
        metadata: {
          orderId: orderId.toString(),
          trackId: trackId.toString(),
        },
      },
    });

    return {
      id: session.id,
      url: session.url,
      customerId: customer.id,
    };

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create payment session');
  }
};

// Verify Stripe webhook signature
export const verifyStripeWebhook = (payload, signature) => {
  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
};
