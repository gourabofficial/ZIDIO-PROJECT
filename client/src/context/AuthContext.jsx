import { createContext, useContext, useState, useEffect } from "react";
import { isLogin } from "../Api/user";
import { useUser } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [overrideData, setOverrideData] = useState(null);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { user, isLoaded: isUserLoading } = useUser();

  const refetchUserData = async () => {
    try {
      setIsLoaded(false);

      const timestamp = Date.now();
      const response = await isLogin({ _t: timestamp });

      // console.log("Auth check response:", response);

      if (response.success && response.user) {
        const updatedUser = {
          id: response.user._id,
          clerkId: response.user.clerkId,
          fullName: response.user.fullName,
          email: response.user.email,
          phone: response.user.phone || "",
          role: response.user.role || "user",
          avatar: response.user.avatar,
          address: response.user.address,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
          cartData: response?.user.cart || null,
          wishlist: response?.user.wishlist || [],
        };

        setCurrentUser(updatedUser);
        setIsAuth(true);
        setError(null);

        return updatedUser;
      } else {
        setCurrentUser(null);
        setIsAuth(false);
        if (!response.success) {
          setError(response.message || "Authentication failed");
        }
        return null;
      }
    } catch (err) {
      setCurrentUser(null);
      setIsAuth(false);
      setError("Failed to authenticate user");
      console.error("Auth check error:", err);
      return null;
    } finally {
      setIsLoaded(true);
    }
  };

  const updateUserState = (updates) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updates,
    };

    setCurrentUser(updatedUser);
    setOverrideData(updatedUser);
  };

  // Optimistic update functions for cart and wishlist
  const updateCartLocally = (newCartData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      cartData: newCartData,
    };

    setCurrentUser(updatedUser);
    setOverrideData(updatedUser);
  };

  const updateWishlistLocally = (newWishlist) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      wishlist: newWishlist,
    };

    setCurrentUser(updatedUser);
    setOverrideData(updatedUser);
  };

  // Add item to cart optimistically
  const addToCartOptimistic = (product, quantity = 1) => {
    if (!currentUser?.cartData) return;

    const existingItems = currentUser.cartData.items || [];
    const existingItemIndex = existingItems.findIndex(
      (item) => item.productId._id === product.id || item.productId === product.id
    );

    let newItems;
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      newItems = [...existingItems];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      // Add new item with properly structured productId object
      const newItem = {
        _id: `temp_${Date.now()}`, // Temporary ID
        productId: {
          _id: product.id || product._id,
          name: product.name || product.title,
          price: product.price,
          images: product.images || [{ imageUrl: product.image }],
          discount: product.discount || 0,
          product_id: product.product_id || product.handle || product.id || product._id
        },
        quantity: quantity,
      };
      newItems = [...existingItems, newItem];
    }

    updateCartLocally({
      ...currentUser.cartData,
      items: newItems,
    });
  };

  // Remove item from cart optimistically
  const removeFromCartOptimistic = (productId) => {
    if (!currentUser?.cartData) return;

    const newItems = currentUser.cartData.items.filter(
      (item) => (item.productId._id || item.productId) !== productId
    );

    updateCartLocally({
      ...currentUser.cartData,
      items: newItems,
    });
  };

  // Update cart item quantity optimistically
  const updateCartQuantityOptimistic = (productId, newQuantity) => {
    if (!currentUser?.cartData) return;

    const newItems = currentUser.cartData.items
      .map((item) => {
        const itemProductId = item.productId._id || item.productId;
        if (itemProductId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove items with 0 quantity

    updateCartLocally({
      ...currentUser.cartData,
      items: newItems,
    });
  };

  // Add to wishlist optimistically
  const addToWishlistOptimistic = (product) => {
    if (!currentUser) return;

    const currentWishlist = currentUser.wishlist || [];
    const isAlreadyInWishlist = currentWishlist.some(
      (item) => (item._id || item) === product.id
    );

    if (!isAlreadyInWishlist) {
      updateWishlistLocally([...currentWishlist, product]);
    }
  };

  // Remove from wishlist optimistically
  const removeFromWishlistOptimistic = (productId) => {
    if (!currentUser) return;

    const currentWishlist = currentUser.wishlist || [];
    const newWishlist = currentWishlist.filter(
      (item) => (item._id || item) !== productId
    );

    updateWishlistLocally(newWishlist);
  };

  useEffect(() => {
    refetchUserData();
  }, [user, isUserLoading]);

  const authValues = {
    currentUser: overrideData || currentUser,
    isAuth,
    isLoaded,
    error,
    refetchUserData,
    updateUserState,
    // Add optimistic update functions
    updateCartLocally,
    updateWishlistLocally,
    addToCartOptimistic,
    removeFromCartOptimistic,
    updateCartQuantityOptimistic,
    addToWishlistOptimistic,
    removeFromWishlistOptimistic,
  };

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export const useAuthdata = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
