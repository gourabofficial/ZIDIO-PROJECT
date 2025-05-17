const ProductInfo = ({ title, price, description, discount, originalPrice }) => {
  // Format price function
  const formatPrice = (value) => {
    return `₹${value?.toLocaleString('en-IN')}`;
  };

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
              {discount}% OFF
            </span>
          </>
        )}
      </div>
      
    
      
      {/* Description Section */}
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
      {discount > 0 && discount <= 15 && (
        <div className="bg-purple-900/30 border border-purple-800 rounded-lg p-3 md:p-4">
          <p className="text-purple-200">
            <span className="font-medium">Special Offer:</span> Save {discount}% on this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;