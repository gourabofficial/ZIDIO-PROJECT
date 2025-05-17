import React from "react";

import ViewAllButton from "./ViewAllButton";
import ProductCard from "../ProductCard/ProductCard";
import MiniLoader from "../Loader/MiniLoader";

const FeaturedProducts = ({ newArrival, loading = false }) => {
  // Guard clause for undefined or null newArrival
  if (!newArrival && !loading) {
    return (
      <section className="py-16 relative overflow-hidden bg-[#0c0e16] border-t border-[#334155]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="col-span-full text-center text-gray-400 py-10">
           <MiniLoader />
          </div>
        </div>
      </section>
    );
  }

  // Helper function to properly format product names
  const formatProductName = (name) => {
    if (!name) return "";

    // Split the name into words and capitalize each word
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  };

  // Format products with proper data structure and handle missing fields
  const formattedProducts = Array.isArray(newArrival)
    ? newArrival.map((product) => {
        // Calculate compare price using discount (if available)
        const compareAtPrice =
          product.offerStatus && product.discount
            ? Math.round(product.price / (1 - product.discount / 100))
            : null;

        return {
          id: product._id,
          title: formatProductName(product.name || "Untitled Product"),
          price: product.price || 0,
          handle: product.id || "",
          image: product.images?.[0]?.imageUrl || "/placeholder-image.jpg",
          hoverImage:
            product.images?.[1]?.imageUrl ||
            product.images?.[0]?.imageUrl ||
            "/placeholder-image.jpg",
          compareAtPrice: compareAtPrice,
          inStock: true, // Assuming all products are in stock
          // Correct property naming and fix typo in API data
          isNewArrival: product.isNewArrival || false,
          isTrending: product.isTrending || product.isTranding || false, // Fix typo
          isHotItem: product.isHotItem || false,
          discount: product.discount || 0,
          offerStatus: product.offerStatus || false,
          category: product.category || "Uncategorized",
          size: product.size || [],
          // Add additional fields for better display
          images: product.images || [],
          description: product.description || "No description available",
        };
      })
    : [];

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-gray-800 rounded-lg p-4 animate-pulse"
        >
          <div className="bg-gray-700 h-48 rounded-lg mb-3"></div>
          <div className="bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
        </div>
      ));
  };

  return (
    <section className="py-16 relative overflow-hidden bg-[#0c0e16] border-t border-[#334155]">
      <div className="absolute inset-0 starry-bg opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 relative inline-block">
            <span className="text-white">New Arrivals</span>
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl">
            Discover the latest additions to our collection. From trendy apparel
            to cutting-edge gadgets, explore what's new and exciting. Stay ahead
            of the curve with our curated selection of new arrivals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            renderSkeletons()
          ) : formattedProducts.length > 0 ? (
            formattedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              No new arrivals available at this time.
            </div>
          )}
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

export default FeaturedProducts;
