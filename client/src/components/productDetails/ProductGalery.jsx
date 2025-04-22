import React, { useState } from 'react';

const ProductGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-[#1e293b] rounded-xl overflow-hidden cosmic-shadow h-[500px] md:h-[600px] flex items-center justify-center">
        <img
          src={selectedImage}
          alt="Product"
          className="object-contain max-h-full transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 justify-center">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`h-20 w-20 rounded-md overflow-hidden border-2 ${
              selectedImage === img ? 'border-white' : 'border-transparent'
            } hover:border-white transition`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
