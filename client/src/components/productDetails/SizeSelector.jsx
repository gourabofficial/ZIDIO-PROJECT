const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium text-[#cbd5e1]">Size</p>
        {selectedSize && <p className="text-sm text-[#c4b5fd]">Selected: {selectedSize}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map(size => (
          <button
            key={size}
            className={`w-14 h-10 flex items-center justify-center rounded transition-all duration-200 ${
              selectedSize === size 
                ? 'bg-[#c4b5fd] text-[#0f172a] font-medium' 
                : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
            }`}
            onClick={() => onSizeChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
      {!selectedSize && <p className="text-xs text-[#c4b5fd] mt-2">Please select a size</p>}
    </div>
  );
};

export default SizeSelector;