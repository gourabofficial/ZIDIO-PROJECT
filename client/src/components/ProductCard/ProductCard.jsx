import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import AddToCartButton from "../common/AddToCartButton";
import WishlistButton from "../common/WishlistButton";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isSignedIn } = useUser();

  // Handle missing image
  const handleImageError = (e) => {
    e.target.src = "https://ext.same-assets.com/1329671863/375037467.gif"; // Fallback image
  };

  // Determine if product has a discount
  const hasDiscount = product.discount > 0 || product.compareAtPrice;
  
  // Get discount percentage
  const discountPercentage = product.discount || 
    (product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0);
  
  // Calculate the actual discounted price
  const discountedPrice = hasDiscount ? 
    product.price - (product.price * discountPercentage / 100) : 
    product.price;

  return (
    <Link to={`/product/${product.handle}`}>
      <div
        className="product-card group hover:translate-y-[-8px] transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="block relative overflow-hidden rounded-lg bg-[#1e293b]">
          {/* Sale badge - updated to show actual discount percentage */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Wishlist button - now uses WishlistButton component */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <WishlistButton
              product={{
                id: product.id || product._id,
                title: product.title,
                price: product.price,
                images: product.images || [product.image],
                slug: product.handle || product.slug,
                inStock: product.inStock !== false,
              }}
              size="small"
              className="shadow-md"
            />
          </div>

          {/* Product image */}
          <div className="aspect-w-3 aspect-h-4 overflow-hidden bg-[#1e293b]">
            <div className="relative w-full h-0 pb-[133%] transition-transform duration-700 ease-in-out">
              {isHovered && product.hoverImage ? (
                <img
                  src={product.hoverImage}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>

          {/* Quick view & add to cart buttons */}
          <div
            className={`absolute bottom-0 inset-x-0 flex justify-center space-x-2 bg-gradient-to-t from-[#0f172a] py-4 transform transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <button className="w-10 h-10 flex items-center justify-center bg-[#334155] hover:bg-[#c4b5fd] hover:text-[#0f172a] rounded-full transition-colors">
              <FiEye size={16} />
            </button>
            <AddToCartButton product={product} />
          </div>

          {/* Product info */}
          <div className="pt-4 pb-3 px-3">
            <h3 className="product-title truncate text-[#f8fafc] group-hover:text-[#c4b5fd] transition-colors text-sm md:text-base">
              {product.title}
            </h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <span className="product-price text-[#c4b5fd] font-medium">
                  ₹{discountedPrice.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="product-price line-through text-[#94a3b8] text-xs ml-2">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-xs font-medium text-[#c4b5fd]">
                  Save {discountPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
