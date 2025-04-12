import { FiShoppingBag, FiShoppingCart, FiHeart, FiCheck } from 'react-icons/fi';

const ProductActions = ({ selectedSize, addedToCart, isFavorite, onAddToCart, onToggleFavorite }) => {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <button 
        onClick={onAddToCart}
        disabled={!selectedSize || addedToCart}
        className={`py-3 px-6 rounded-md w-full font-medium transition-all duration-300 flex items-center justify-center ${
          addedToCart 
            ? 'bg-green-500 text-white'
            : selectedSize 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30' 
              : 'bg-slate-700 text-slate-300 cursor-not-allowed'
        }`}
      >
        {addedToCart ? (
          <>
            <FiCheck size={18} className="mr-2" />
            ADDED TO CART
          </>
        ) : (
          <>
            <FiShoppingBag size={18} className="mr-2" />
            ADD TO CART
          </>
        )}
      </button>
      
      <button 
        disabled={!selectedSize}
        className="py-3 px-6 bg-[#1e293b] text-white w-full rounded-md font-medium hover:bg-[#334155] transition-colors flex items-center justify-center disabled:bg-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        <FiShoppingCart size={18} className="mr-2" />
        BUY IT NOW
      </button>
      
      <button
        className="flex items-center justify-center space-x-2 py-3 text-[#cbd5e1] hover:text-[#c4b5fd] transition-colors"
        onClick={onToggleFavorite}
      >
        <FiHeart className={isFavorite ? "fill-[#c4b5fd] text-[#c4b5fd]" : ""} size={18} />
        <span>{isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
      </button>
    </div>
  );
};

export default ProductActions;