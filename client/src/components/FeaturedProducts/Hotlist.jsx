import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import ViewAllButton from './ViewAllButton';

const Hotlist = ({ HotProduct }) => {
  console.log("hotProduct: ", HotProduct);
  const starsContainerRef = useRef(null);

  // Create stars effect on component mount
  useEffect(() => {
    if (starsContainerRef.current) {
      const container = starsContainerRef.current;
      container.innerHTML = "";

      // Create stars
      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.style.width = `${Math.random() * 2}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        star.style.position = "absolute";
        star.style.borderRadius = "50%";
        star.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
        container.appendChild(star);
      }
    }

    return () => {
      if (starsContainerRef.current) {
        starsContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Transform products to match ProductCard expected format
  const formattedProducts = 
  HotProduct?.map((product) => ({
      id: product._id,
      title: product.name,
      price: product.price,
      image: product.images[0]?.imageUrl || "",
      hoverImage: product.images[1]?.imageUrl || "",
      handle: product.id, // Using id as handle for navigation
      compareAtPrice: product.offerStatus
        ? Math.round(product.price * (1 + product.discount / 100))
        : null,
      inStock: true, // Assuming products are in stock by default
      category: product.category,
    })) || [];

  return (
    <section className="py-16 relative overflow-hidden bg-[#0c0e16] border-t border-[#334155]">
      <div ref={starsContainerRef} className="absolute inset-0 starry-bg opacity-20"></div>

      {/* Nebula effects */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#0c0e16] blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-[#0c0e16] blur-3xl"></div>
      <div className="absolute top-40 left-1/4 w-60 h-60 rounded-full bg-[#0c0e16] blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 relative inline-block">
            <span className="text-white">Hot Products</span>
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Discover our most popular items that everyone's talking about. These trending products are flying off the shelves - get them while they're hot!
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {formattedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {formattedProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <ViewAllButton />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hotlist;