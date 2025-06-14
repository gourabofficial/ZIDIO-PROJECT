// import React from 'react';
// import { FiHeart, FiZap } from 'react-icons/fi';
// import { useWishlist } from '../../context/WishlistContext';
// import { useUser } from '@clerk/clerk-react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../../context/CartContext';
// import AddToCartButton from '../common/AddToCart';

// const ProductActions = ({ product, selectedSize, addedToCart, onAddToCart }) => {
//   const { isSignedIn } = useUser();
//   const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();
//   const navigate = useNavigate();
  
//   const handleToggleFavorite = (e) => {
//     e.preventDefault();
    
//     if (!isSignedIn) {
//       alert("Please sign in to add items to your wishlist");
//       return;
//     }
    
//     if (isInWishlist(product.id)) {
//       removeFromWishlist(product.id);
//     } else {
//       const normalizedProduct = {
//         ...product,
//         slug: product.slug || product.id.toString(),
//         images: product.images || [product.image]
//       };
//       addToWishlist(normalizedProduct);
//     }
//   };

//   const handleBuyNow = () => {
//     if (!selectedSize && product.size && product.size.length > 0) {
//       alert("Please select a size");
//       return;
//     }
    
//     const productToAdd = {
//       ...product,
//       selectedVariant: { size: selectedSize }
//     };
    
//     addToCart(productToAdd);
//     navigate('/checkout');
//   };

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex space-x-3">
//         <AddToCartButton
//           product={product}
//           selectedSize={selectedSize}
//           disabled={!selectedSize && product.size && product.size.length > 0}
//           className={`flex-1 py-3 px-4 rounded font-semibold ${
//             (!selectedSize && product.size && product.size.length > 0)
//               ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//               : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
//           }`}
//         >
//           ADD TO CART
//         </AddToCartButton>
        
//         <button
//           onClick={handleBuyNow}
//           disabled={!selectedSize && product.size && product.size.length > 0}
//           className={`flex-1 py-3 px-4 rounded font-semibold flex items-center justify-center ${
//             (!selectedSize && product.size && product.size.length > 0)
//               ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//               : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
//           }`}
//         >
//           <FiZap className="mr-2" /> BUY NOW
//         </button>
        
//         <button
//           onClick={handleToggleFavorite}
//           className={`p-3 rounded-full border ${
//             isInWishlist(product.id)
//               ? 'border-red-500 text-red-500'
//               : 'border-gray-600 text-gray-400 hover:text-white hover:border-white'
//           }`}
//           aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
//         >
//           <FiHeart
//             className={isInWishlist(product.id) ? "fill-current" : ""}
//             size={20}
//           />
//         </button>
//       </div>

//       {!selectedSize && product.size && product.size.length > 0 && (
//         <p className="text-red-500 text-sm">Please select a size first</p>
//       )}
//     </div>
//   );
// };

// export default ProductActions;