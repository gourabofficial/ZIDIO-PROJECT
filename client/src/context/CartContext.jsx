import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthdata } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuthdata();

  // When user changes, load their cart
  useEffect(() => {
    const fetchCart = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          
          // Mock cart fetch - will be replaced with actual API call when backend is ready
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Simulated cart data
          const mockCartData = [
            // {
            //   id: 'product1',
            //   title: 'Cosmic Guardian Helmet',
            //   price: 1299.99,
            //   image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=500',
            //   quantity: 1
            // },
            // {
            //   id: 'product2',
            //   title: 'Nebula Blade 3000',
            //   price: 1599.99,
            //   image: 'https://images.unsplash.com/photo-1623501097816-03faeef1ad34?q=80&w=500',
            //   quantity: 2
            // }
          ];
          
          setCartItems(mockCartData);
          setLoading(false);
        } catch (err) {
          setError('Failed to load cart');
          setLoading(false);
        }
      } else {
        // Clear cart when user logs out
        setCartItems([]);
      }
    };

    fetchCart();
  }, [currentUser]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      let updatedCart;
      
      if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        updatedCart = [...cartItems, { ...product, quantity }];
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (quantity <= 0) {
        // Remove item if quantity is zero or negative
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
      } else {
        // Update quantity
        const updatedCart = cartItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedCart = cartItems.filter(item => item.id !== productId);
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCartItems([]);
      
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