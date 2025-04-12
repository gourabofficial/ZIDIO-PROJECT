import { useState } from 'react';

const ProductGallery = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div>
      <div className="mb-4 aspect-w-1 aspect-h-1 bg-[#1e293b] rounded-lg overflow-hidden cosmic-shadow">
        <img
          src={images[currentImageIndex]}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden transition-all duration-300 ${
              currentImageIndex === index 
                ? 'ring-2 ring-[#c4b5fd]' 
                : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;