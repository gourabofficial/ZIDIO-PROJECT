import React, { useState, useEffect } from "react";

const ProductGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState("");

  // console.log("ProductGallery images", images);

  // Set first image as default when images load
  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0].imageUrl);
    }
  }, [images]);

  // Handle missing images gracefully
  if (!images || images.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-xl h-[400px] flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#1e293b] rounded-xl overflow-hidden cosmic-shadow max-h-[350px] md:max-h-[450px] flex items-center justify-center">
        <img
          src={selectedImage}
          alt="Product"
          className="object-contain w-full h-full max-h-[300px] md:max-h-[400px] transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        {images.map((img, index) => (
          <button
            key={img._id || index}
            onClick={() => setSelectedImage(img.imageUrl)}
            className={`h-20 w-20 rounded-md overflow-hidden border-2 ${
              selectedImage === img.imageUrl
                ? "border-white"
                : "border-transparent"
            } hover:border-white transition`}
          >
            <img
              src={img.imageUrl}
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
