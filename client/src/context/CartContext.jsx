import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthdata } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuthdata();
  
  // Initial load from localStorage when component mounts
  useEffect(() => {
    try {
      // Load cart regardless of user status first for immediate display
      const localCart = localStorage.getItem('cart_items');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    } catch (err) {
      console.error('Error loading initial cart:', err);
    }
  }, []);
  
  // Load user-specific cart when user changes
  useEffect(() => {
    const loadCart = () => {
      try {
        setLoading(true);
        
        if (currentUser) {
          const userId = currentUser.id;
          const savedCart = localStorage.getItem(`cart_${userId}`);
          
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
            // Also update the general cart storage
            localStorage.setItem('cart_items', savedCart);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load cart from storage:', err);
        setError('Failed to load cart from storage');
        setLoading(false);
      }
    };

    loadCart();
  }, [currentUser]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      // Always save to a general cart storage for persistence through refreshes
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
      
      // Also save to user-specific storage if logged in
      if (currentUser) {
        const userId = currentUser.id;
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
      }
    } catch (err) {
      console.error('Error saving cart:', err);
    }
  }, [cartItems, currentUser]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(item => 
        (item.variantId && product.variantId) 
          ? item.variantId === product.variantId 
          : item.id === product.id
      );
      
      let updatedCart;
      
      if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        updatedCart = [...cartItems, { ...product, quantity }];
      }
      
      setCartItems(updatedCart);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Failed to add item to cart');
      setLoading(false);
      return { success: false, error: 'Failed to add item to cart' };
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      
      if (quantity <= 0) {
        // Remove item if quantity is zero or negative
        const updatedCart = cartItems.filter(item => 
          (typeof productId === 'string' && productId.includes('-size-')) 
            ? item.variantId !== productId 
            : item.id !== productId
        );
        setCartItems(updatedCart);
      } else {
        // Update quantity - using variantId OR id
        const updatedCart = cartItems.map(item => 
          (typeof productId === 'string' && productId.includes('-size-')) 
            ? (item.variantId === productId ? { ...item, quantity } : item)
            : (item.id === productId ? { ...item, quantity } : item)
        );
        setCartItems(updatedCart);
      }
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Failed to update quantity');
      setLoading(false);
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      
      // Use variantId OR id for removal
      const updatedCart = cartItems.filter(item => 
        (typeof productId === 'string' && productId.includes('-size-')) 
          ? item.variantId !== productId 
          : item.id !== productId
      );
      
      setCartItems(updatedCart);
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Failed to remove item');
      setLoading(false);
      return { success: false, error: 'Failed to remove item' };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      
      setCartItems([]);
      
      if (currentUser) {
        // Also clear from localStorage
        localStorage.removeItem(`cart_${currentUser.id}`);
      }
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError('Failed to clear cart');
      setLoading(false);
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  // Calculate cart subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate items count
  const itemsCount = cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemsCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};