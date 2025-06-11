import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiCheck,
  FiAlertTriangle,
  FiShoppingBag,
  FiCreditCard
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast"; 
import ProductGallery from "../../components/productDetails/ProductGalery";
import ProductInfo from "../../components/productDetails/ProductInfo";
import ReviewList from "../../components/Review/ReviewList";
import { getProductById } from "../../Api/ProductApi.js";
import { getProductReviews } from "../../Api/user.js";
import MiniLoader from "../../components/Loader/MiniLoader.jsx";
import { addToCart } from "../../Api/user.js";
import { useAuthdata } from "../../context/AuthContext.jsx";

const Product = () => {
  const { refetchUserData, currentUser, addToCartOptimistic, isAuth } = useAuthdata();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        console.log("Product data received:", data.product);
        setProduct(data.product);
        
        // Fetch rating stats using the MongoDB _id, not the product_id
        if (data.product && data.product._id) {
          await fetchRatingStats(data.product._id);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRatingStats = async (productId) => {
    try {
      const result = await getProductReviews(productId, 1, 1);
      if (result.success && result.stats) {
        setRatingStats({
          averageRating: result.stats.averageRating || 0,
          totalReviews: result.stats.totalReviews || 0
        });
      }
    } catch (err) {
      console.error("Error fetching rating stats:", err);
      // Don't throw error, just keep default stats
    }
  };

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!isAuth) {
      toast.error("Please login first", {
        icon: <FiAlertTriangle className="text-red-500" size={20} />,
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, #2d0a0a, #450a0a)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #7f1d1d',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          fontSize: '15px',
          fontWeight: '500',
        },
      });
      return;
    }

    try {
      setAddToCartLoading(true);

      const cartToBeSubmitted = {
        productId: product._id,
        quantity: quantity,
      };

      // Optimistically update the cart UI immediately
      addToCartOptimistic(product, quantity);

      // Show immediate success toast
      toast.success(`${product.name} added to cart!`, {
        icon: <FiCheck className="text-green-500" size={20} />,
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, #0f172a, #1e293b)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #334155',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          fontSize: '15px',
          fontWeight: '500',
        },
      });

      // Make API call in the background
      const res = await addToCart(cartToBeSubmitted);
      console.log(res);

      // Only refetch if there was an error (to sync correct state)
    } catch (err) {
      console.error("Error adding to cart:", err);

      // Revert optimistic update by refetching correct data
      refetchUserData();

      // Enhanced error toast
      toast.error(err.message || "Failed to add to cart", {
        icon: <FiAlertTriangle className="text-red-500" size={20} />,
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, #2d0a0a, #450a0a)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #7f1d1d',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          fontSize: '15px',
          fontWeight: '500',
        },
      });
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    console.log("Changing quantity to:", newQuantity);
    setQuantity(newQuantity);
  };

  const handleBuyNow = () => {
    // Check if user is authenticated
    if (!isAuth) {
      toast.error("Please login first", {
        icon: <FiAlertTriangle className="text-red-500" size={20} />,
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, #2d0a0a, #450a0a)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid #7f1d1d',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          fontSize: '15px',
          fontWeight: '500',
        },
      });
      return;
    }

    // Navigate to checkout page with product info
    navigate('/checkout', {
      state: {
        type: 'buyNow',
        product: product,
        quantity: quantity
      }
    });
  };

  // Check if product is already in cart
  const isInCart = () => {
    // Return false if user is not authenticated
    if (!isAuth || !currentUser || !currentUser.cartData || !currentUser.cartData.items) {
      return false;
    }
    
    return currentUser.cartData.items.some(item => {
      // First check if productId exists and is not null
      if (!item.productId) return false;
      
      // Then safely access properties or compare values
      return item.productId._id === product._id || item.productId === product._id;
    });
  };
  
  const handleViewCart = () => {
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">
          <MiniLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          <div className="text-xl mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Product Not Found</div>
          <div className="text-gray-400">
            The product you're looking for doesn't exist.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-black text-white">
      {/* Enhanced Toaster component */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={16}
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(to right, #0f172a, #1e293b)',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
            style: {
              border: '1px solid #065f46',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a',
            },
            style: {
              border: '1px solid #7f1d1d',
            },
          },
        }}
      />

      <div className="container mx-auto px-4 py-16 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ProductGallery images={product.images} />
            </div>
          </div>

          <div className="space-y-6">
            <ProductInfo
              title={product.name}
              description={product.description}
              price={
                // Calculate the discounted price if discount exists
                product.discount > 0
                  ? product.price - (product.price * product.discount / 100)
                  : product.price
              }
              discount={product.discount}
              originalPrice={product.discount > 0 ? product.price : null}
              averageRating={ratingStats.averageRating}
              totalReviews={ratingStats.totalReviews}
              onViewReviews={() => {
                const reviewsSection = document.getElementById('reviews-section');
                if (reviewsSection) {
                  reviewsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Quantity and Add to Cart Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
              {/* Quantity Selector - only show if not in cart */}
              {!isInCart() && (
                <div className="flex items-center border border-gray-700 rounded-md bg-gray-800/50 w-fit">
                  <button
                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                    className={`px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-md transition-colors ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={quantity <= 1 || addToCartLoading}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 py-2 text-white font-medium min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-md transition-colors"
                    disabled={addToCartLoading}
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              )}

              {/* Action Buttons Container */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Conditional Button: Add to Cart or View Cart */}
                {isInCart() ? (
                  <button
                    onClick={handleViewCart}
                    className="flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium px-6 py-3 rounded-md shadow-lg hover:from-green-700 hover:to-emerald-700 active:shadow-inner transition-all w-full sm:w-auto"
                  >
                    <FiShoppingBag className="mr-2" size={18} />
                    View in Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartLoading}
                    className={`flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-md shadow-lg hover:from-purple-700 hover:to-indigo-700 active:shadow-inner transition-all w-full sm:w-auto ${
                      addToCartLoading ? "opacity-70 cursor-wait" : ""
                    }`}
                  >
                    {addToCartLoading ? (
                      <>
                        <span className="mr-2">Adding...</span>
                        <MiniLoader size="small" />
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="mr-2" size={18} />
                        Add to Cart
                      </>
                    )}
                  </button>
                )}

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium px-6 py-3 rounded-md shadow-lg hover:from-orange-700 hover:to-red-700 active:shadow-inner transition-all w-full sm:w-auto"
                >
                  <FiCreditCard className="mr-2" size={18} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews-section" className="mt-16 pt-8 border-t border-gray-700">
          <ReviewList productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default Product;
