import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getFilteredProducts } from "../../Api/ProductApi";

const Category = () => {
  // Add this new hook
  const location = useLocation();
  // Get category id from URL params
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Fixed limit value
  const PRODUCTS_PER_PAGE = 12;

  // Initialize filters from URL search params
  const [filters, setFilters] = useState(() => {
    return {
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      category: id || searchParams.get("category") || "",
      size: searchParams.get("size") || "",
      offerStatus: searchParams.get("offerStatus") || "",
      page: parseInt(searchParams.get("page")) || 1,
      limit: PRODUCTS_PER_PAGE,
    };
  });

  // Ref to store timeout ID for price input debouncing
  const priceDebounceTimerRef = useRef(null);

  // Categories for dropdown
  const categories = [
    "Oversized",
    "Acid Wash",
    "Graphic Printed",
    "Solid Color",
    "Polo T-Shirts",
    "Sleeveless",
    "Long Sleeve",
    "Henley",
    "Hooded",
  ];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Fetch products with given filters
  const fetchProducts = useCallback(async (filterParams) => {
    try {
      setLoading(true);

      let response;
      if (
        id &&
        !filterParams.category &&
        !filterParams.minPrice &&
        !filterParams.maxPrice &&
        !filterParams.size &&
        !filterParams.offerStatus
      ) {
        // If we're on a category page with no other filters
        response = await getFilteredProducts({
          category: id,
          page: filterParams.page,
          limit: filterParams.limit,
        });
      } else {
        // Remove empty filters
        const activeFilters = Object.entries(filterParams).reduce(
          (acc, [key, value]) => {
            if (value !== "") acc[key] = value;
            return acc;
          },
          {}
        );

        response = await getFilteredProducts(activeFilters);
      }

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch products");
      }

      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Update URL with current filters
  const updateUrlWithFilters = useCallback((newFilters) => {
    // Create a new URLSearchParams object
    const newSearchParams = new URLSearchParams();

    // Add non-empty filters to the URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== "" && key !== "limit") { // Skip limit as we've fixed it
        newSearchParams.set(key, value);
      }
    });

    // Update the URL without reloading the page
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  // Handle filter changes - now calls API immediately for dropdown changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Update filters state with new value
    const updatedFilters = {
      ...filters,
      [name]: value,
      // Reset to page 1 when changing filters (except page parameter)
      ...(name !== "page" ? { page: 1 } : {}),
    };
    
    // Set the new filters
    setFilters(updatedFilters);
    
    // Update URL with new filters
    updateUrlWithFilters(updatedFilters);
    
    // Fetch products with new filters immediately
    fetchProducts(updatedFilters);
  };

  // Price input handler with improved 0.5 second debounce
  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update UI immediately for responsive feel
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any existing timeout to implement debounce
    if (priceDebounceTimerRef.current) {
      clearTimeout(priceDebounceTimerRef.current);
    }
    
    // Set a new timeout that will execute after 500ms
    priceDebounceTimerRef.current = setTimeout(() => {
      // Create the updated filters object
      const updatedFilters = {
        ...filters,
        [name]: value,
        page: 1, // Reset to page 1 when changing price filters
      };
      
      // Update URL with new filters
      updateUrlWithFilters(updatedFilters);
      
      // Fetch products with new filters after debounce
      fetchProducts(updatedFilters);
      
      // Clear the timeout reference
      priceDebounceTimerRef.current = null;
    }, 500); // 0.5 second debounce
  };

  // Reset filters
  const resetFilters = () => {
    // Clear any pending price debounce
    if (priceDebounceTimerRef.current) {
      clearTimeout(priceDebounceTimerRef.current);
      priceDebounceTimerRef.current = null;
    }
    
    const resetState = {
      minPrice: "",
      maxPrice: "",
      category: id || "",
      size: "",
      offerStatus: "",
      page: 1,
      limit: PRODUCTS_PER_PAGE,
    };
    
    setFilters(resetState);

    // Clear search params except for category if we're on a category page
    const newParams = new URLSearchParams();
    if (id) {
      newParams.set("category", id);
    }
    setSearchParams(newParams);

    // Fetch products with reset filters
    fetchProducts(resetState);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const updatedFilters = {
      ...filters,
      page: newPage,
    };
    
    setFilters(updatedFilters);

    // Update URL and fetch data
    updateUrlWithFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // Initial fetch and URL handling
  useEffect(() => {
    // Sync filters with URL params when location changes
    setFilters(prevFilters => ({
      ...prevFilters,
      category: id || searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      size: searchParams.get("size") || "",
      offerStatus: searchParams.get("offerStatus") || "",
      page: parseInt(searchParams.get("page")) || 1,
      limit: PRODUCTS_PER_PAGE,
    }));

    // If there are URL params, use them for initial fetch
    if (searchParams.toString()) {
      fetchProducts({
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        category: id || searchParams.get("category") || "",
        size: searchParams.get("size") || "",
        offerStatus: searchParams.get("offerStatus") || "",
        page: parseInt(searchParams.get("page")) || 1,
        limit: PRODUCTS_PER_PAGE,
      });
    } else {
      // If no params, just fetch based on category ID
      fetchProducts({
        category: id || "",
        page: 1,
        limit: PRODUCTS_PER_PAGE,
      });
    }
    
    // Cleanup function to cancel any pending debounce on unmount
    return () => {
      if (priceDebounceTimerRef.current) {
        clearTimeout(priceDebounceTimerRef.current);
      }
    };
  }, [id, searchParams, location.pathname, fetchProducts]); 

  // Format category name for display
  const pageTitle = id
    ? id.charAt(0).toUpperCase() + id.slice(1)
    : "All Products";

  return (
    <div className="container mx-auto px-4 py-8 mt-20 bg-[#0c0e16]">
      {/* Category header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 relative inline-block">
        <span className="text-white">{pageTitle}</span>
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
      </h2>

      {/* Filters section */}
      <div className="bg-[#0c0e16] p-6 rounded-lg mb-8 border border-[#334155]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Filter Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Price range inputs */}
          <div>
            <label className="block text-gray-300 mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handlePriceInputChange}
                className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handlePriceInputChange}
                className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Size dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">Size</label>
            <select
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Sizes</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Offer status dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">On Sale</label>
            <select
              name="offerStatus"
              value={filters.offerStatus}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Status</option>
              <option value="true">On Sale</option>
              <option value="false">Regular Price</option>
            </select>
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#1a1c2e] text-white rounded hover:bg-[#252840] transition-colors disabled:opacity-50 border border-[#334155]"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Filters"}
          </button>
        </div>
      </div>

      {/* Active filters display with clear buttons */}
      {(filters.minPrice || filters.maxPrice || filters.category || filters.size || filters.offerStatus) && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.minPrice && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Min: ${filters.minPrice}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "minPrice", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Max: ${filters.maxPrice}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "maxPrice", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                {filters.category}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "category", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.size && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Size: {filters.size}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "size", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.offerStatus === "true" && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                On Sale
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "offerStatus", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.offerStatus === "false" && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Regular Price
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "offerStatus", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading state with spinner */}
      {loading && (
        <div className="text-center py-16 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-400 text-xl">Loading products...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-16 bg-[#1a1c2e] rounded-lg border border-[#334155]">
          <p className="text-red-400 text-xl">Error: {error}</p>
          <button 
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded hover:opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Show message if no products found */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 bg-[#1a1c2e] rounded-lg border border-[#334155]">
          <p className="text-gray-400 text-xl">
            No products found matching your criteria.
          </p>
          <button 
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded hover:opacity-90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1 || loading}
            className="px-4 py-2 bg-[#1a1c2e] text-white rounded mr-2 disabled:opacity-50 hover:bg-[#252840] transition-colors border border-[#334155]"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-[#1a1c2e] text-white rounded border border-[#334155]">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages || loading}
            className="px-4 py-2 bg-[#1a1c2e] text-white rounded ml-2 disabled:opacity-50 hover:bg-[#252840] transition-colors border border-[#334155]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Category;
