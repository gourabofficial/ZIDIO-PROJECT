import React from 'react';
import StarRating from '../common/StarRating';

const ProductInfo = ({ 
  title, 
  price, 
  description, 
  discount, 
  originalPrice, 
  averageRating = 0, 
  totalReviews = 0,
  onViewReviews 
}) => {
  // Format price function
  const formatPrice = (value) => {
    return `₹${value?.toLocaleString('en-IN')}`;
  };

  // Calculate discount percentage - no change needed here
  const discountPercentage = discount || 
    (originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
        {title}
      </h1>
      
      {/* Price Section */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <p className="text-2xl md:text-3xl font-bold text-white">
          {formatPrice(price)}
        </p>
        
        {originalPrice && (
          <>
            <p className="text-lg md:text-xl text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </p>
            <span className="bg-green-600 text-white text-xs md:text-sm font-medium px-2 py-1 rounded-md">
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>
      
      {/* Rating Section - Right below price */}
      {totalReviews > 0 && (
        <div className="flex items-center justify-between">
          <StarRating 
            rating={averageRating} 
            size={20}
            showRating={true}
            showCount={true}
            totalReviews={totalReviews}
            className="text-sm"
          />
          {onViewReviews && (
            <button
              onClick={onViewReviews}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors underline"
            >
              View all reviews
            </button>
          )}
        </div>
      )}
      
      {/* Discount Badge - Appears above description for prominent offers */}
      {discountPercentage > 15 && (
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 border border-purple-600 rounded-lg p-4 shadow-lg transform hover:scale-[1.02] transition-transform">
          <p className="text-white flex items-center">
            <span className="inline-block w-4 h-4 bg-white rounded-full mr-2 animate-pulse"></span>
            <span className="font-medium">Limited Time Offer:</span>
            <span className="ml-2 font-bold text-lg">{discountPercentage}% OFF</span>
          </p>
        </div>
      )}
      
      {/* Description Section - No changes needed */}
      <div className="mt-4 md:mt-6">
        <h3 className="text-lg md:text-xl font-medium text-purple-300 mb-3">Product Description</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 md:p-5 text-gray-300 shadow-inner">
          {description ? (
            <p className="leading-relaxed md:text-lg">{description}</p>
          ) : (
            <p className="text-gray-500 italic">No description available</p>
          )}
        </div>
      </div>
      
      {/* Additional Details - For smaller discounts */}
      {discountPercentage > 0 && discountPercentage <= 15 && (
        <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-3 md:p-4">
          <p className="text-purple-200">
            <span className="font-medium">Special Offer:</span> Save {discountPercentage}% on this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;