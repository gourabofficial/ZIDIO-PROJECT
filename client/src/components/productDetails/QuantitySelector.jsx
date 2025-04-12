import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({ quantity, onChange }) => {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    onChange(quantity + 1);
  };

  return (
    <div className="mb-6">
      <p className="font-medium mb-2 text-[#cbd5e1]">Quantity</p>
      <div className="flex items-center">
        <button
          className="w-10 h-10 flex items-center justify-center bg-[#1e293b] text-white rounded-l-md hover:bg-[#334155] transition-colors"
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
        >
          <FiMinus size={16} />
        </button>
        <div className="w-14 h-10 flex items-center justify-center bg-[#1e293b] text-white">
          {quantity}
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center bg-[#1e293b] text-white rounded-r-md hover:bg-[#334155] transition-colors"
          onClick={increaseQuantity}
        >
          <FiPlus size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;