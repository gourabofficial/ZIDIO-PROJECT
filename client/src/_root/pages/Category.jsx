import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getFilteredProducts } from "../../Api/ProductApi";

const Category = () => {
  // Hooks
  const location = useLocation();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const titleRef = useRef(null);

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

  // Animated title effect
  useEffect(() => {
    if (titleRef.current) {
      const title = titleRef.current;
      const text = formatCategoryTitle(id);
      title.textContent = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = `translateY(${
          Math.random() * 40 - 20
        }px) rotateZ(${Math.random() * 20 - 10}deg)`;
        span.style.transition = `all 0.5s ease`;
        span.style.transitionDelay = `${index * 0.03}s`;

        span.style.color = "#ffffff";
        span.style.textShadow =
          "0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(150, 170, 255, 0.3)";

        title.appendChild(span);

        setTimeout(() => {
          span.style.opacity = "1";
          span.style.transform = "translateY(0) rotateZ(0)";
        }, 100);
      });
    }
  }, [id]);

  // Fetch products with given filters
  const fetchProducts = useCallback(
    async (filterParams) => {
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
    },
    [id]
  );

  // Update URL with current filters
  const updateUrlWithFilters = useCallback(
    (newFilters) => {
      // Create a new URLSearchParams object
      const newSearchParams = new URLSearchParams();

      // Add non-empty filters to the URL
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== "" && key !== "limit") {
          // Skip limit as we've fixed it
          newSearchParams.set(key, value);
        }
      });

      // Update the URL without reloading the page
      setSearchParams(newSearchParams);
    },
    [setSearchParams]
  );

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
    setFilters((prev) => ({
      ...prev,
      [name]: value,
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

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Initial fetch and URL handling
  useEffect(() => {
    // Sync filters with URL params when location changes
    setFilters((prevFilters) => ({
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Cosmic-themed filters section */}
        <div
          className="backdrop-blur-md bg-black/30 rounded-xl border border-gray-700 p-6 mb-8 animate-fadeIn opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H21M10 12H21M17 18H21"
                stroke="url(#paint0_linear)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="18"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            Cosmic Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price range inputs */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Galactic Price Range
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handlePriceInputChange}
                    className="w-full px-3 py-2 bg-[#191b2a]/50 backdrop-blur-sm text-white rounded-lg border border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handlePriceInputChange}
                    className="w-full px-3 py-2 bg-[#191b2a]/50 backdrop-blur-sm text-white rounded-lg border border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Hero Category
              </label>
              <div className="relative group">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 appearance-none bg-[#13141f] text-white rounded-lg border border-indigo-500/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.15)]"
                >
                  <option value="" className="bg-[#161827] text-gray-200">
                    All Categories
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-[#161827] text-gray-200"
                    >
                      {category}
                    </option>
                  ))}
                </select>

                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-indigo-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>

                {/* Custom dropdown arrow with glow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-4 h-4 relative z-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            
            {/* Size dropdown */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Hero Size
              </label>
              <div className="relative group">
                <select
                  name="size"
                  value={filters.size}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 appearance-none bg-[#13141f] text-white rounded-lg border border-indigo-500/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.15)]"
                >
                  <option value="" className="bg-[#161827] text-gray-200">
                    All Sizes
                  </option>
                  {sizes.map((size) => (
                    <option
                      key={size}
                      value={size}
                      className="bg-[#161827] text-gray-200"
                    >
                      {size}
                    </option>
                  ))}
                </select>

                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-indigo-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>

                {/* Custom dropdown arrow with glow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-4 h-4 relative z-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Offer status dropdown */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                Cosmic Sale
              </label>
              <div className="relative group">
                <select
                  name="offerStatus"
                  value={filters.offerStatus}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 appearance-none bg-[#13141f] text-white rounded-lg border border-indigo-500/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.15)]"
                >
                  <option value="" className="bg-[#161827] text-gray-200">
                    Any Status
                  </option>
                  <option value="true" className="bg-[#161827] text-gray-200">
                    On Cosmic Sale
                  </option>
                  <option value="false" className="bg-[#161827] text-gray-200">
                    Regular Price
                  </option>
                </select>

                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-indigo-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>

                {/* Custom dropdown arrow with glow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-4 h-4 relative z-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Reset button with cosmic style */}
          <div className="flex justify-end mt-6">
            <button
              onClick={resetFilters}
              disabled={loading}
              className="relative group overflow-hidden px-6 py-2.5 rounded-lg"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
              <span className="relative flex items-center justify-center text-white font-medium">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                {loading ? "Resetting..." : "Reset Filters"}
              </span>
            </button>
          </div>
        </div>

        {/* Active filters display with cosmic pills */}
        {(filters.minPrice ||
          filters.maxPrice ||
          filters.category ||
          filters.size ||
          filters.offerStatus) && (
          <div
            className="mb-8 animate-fadeIn opacity-0"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <div className="flex flex-wrap gap-2">
              {filters.minPrice && (
                <span className="relative group overflow-hidden px-3 py-1 rounded-full text-sm flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></span>
                  <span className="relative text-white">
                    Min: ₹{filters.minPrice}
                  </span>
                  <button
                    className="ml-2 relative group-hover:text-white transition-colors duration-200"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "minPrice", value: "" },
                      })
                    }
                  >
                    <span className="relative z-10 text-indigo-200">×</span>
                    <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/30 transition-colors duration-200"></span>
                  </button>
                </span>
              )}

              {filters.maxPrice && (
                <span className="relative group overflow-hidden px-3 py-1 rounded-full text-sm flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></span>
                  <span className="relative text-white">
                    Max: ₹{filters.maxPrice}
                  </span>
                  <button
                    className="ml-2 relative group-hover:text-white transition-colors duration-200"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "maxPrice", value: "" },
                      })
                    }
                  >
                    <span className="relative z-10 text-indigo-200">×</span>
                    <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/30 transition-colors duration-200"></span>
                  </button>
                </span>
              )}

              {filters.category && (
                <span className="relative group overflow-hidden px-3 py-1 rounded-full text-sm flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></span>
                  <span className="relative text-white">
                    {filters.category}
                  </span>
                  <button
                    className="ml-2 relative group-hover:text-white transition-colors duration-200"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "category", value: "" },
                      })
                    }
                  >
                    <span className="relative z-10 text-indigo-200">×</span>
                    <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/30 transition-colors duration-200"></span>
                  </button>
                </span>
              )}

              {filters.size && (
                <span className="relative group overflow-hidden px-3 py-1 rounded-full text-sm flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></span>
                  <span className="relative text-white">
                    Size: {filters.size}
                  </span>
                  <button
                    className="ml-2 relative group-hover:text-white transition-colors duration-200"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "size", value: "" },
                      })
                    }
                  >
                    <span className="relative z-10 text-indigo-200">×</span>
                    <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/30 transition-colors duration-200"></span>
                  </button>
                </span>
              )}

              {filters.offerStatus === "true" && (
                <span className="relative group overflow-hidden px-3 py-1 rounded-full text-sm flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></span>
                  <span className="relative text-white">On Cosmic Sale</span>
                  <button
                    className="ml-2 relative group-hover:text-white transition-colors duration-200"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "offerStatus", value: "" },
                      })
                    }
                  >
                    <span className="relative z-10 text-indigo-200">×</span>
                    <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/30 transition-colors duration-200"></span>
                  </button>
                </span>
              )}

              {filters.offerStatus === "false" && (
                <span className="relative group overflow-hidden px-3 py-1 rounded-full text-sm flex items-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></span>
                  <span className="relative text-white">Regular Price</span>
                  <button
                    className="ml-2 relative group-hover:text-white transition-colors duration-200"
                    onClick={() =>
                      handleFilterChange({
                        target: { name: "offerStatus", value: "" },
                      })
                    }
                  >
                    <span className="relative z-10 text-indigo-200">×</span>
                    <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/30 transition-colors duration-200"></span>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Loading state with fancy spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-r-indigo-500 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <p className="ml-4 text-gray-300 text-lg font-medium">
              Summoning cosmic heroes...
            </p>
          </div>
        )}

        {/* Error state with cosmic theme */}
        {error && (
          <div className="relative backdrop-blur-lg bg-black/30 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto overflow-hidden animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p className="text-red-300 text-xl mb-4">
                Cosmic disturbance: {error}
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg shadow-lg hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Retry Mission
              </button>
            </div>
          </div>
        )}

        {/* Products grid with animated cosmic hover effects */}
        {!loading && !error && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10 animate-fadeIn"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            {products.map((product, index) => (
              <div
                key={product._id}
                className="group transform transition-all duration-300 hover:scale-105 hover:-rotate-1 animate-fadeIn"
                style={{
                  animationDelay: `${0.1 * index}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state with cosmic theme */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 backdrop-blur-sm bg-black/20 rounded-xl border border-gray-800 max-w-2xl mx-auto animate-fadeIn">
            <div className="mb-6 flex justify-center">
              <svg
                className="w-24 h-24 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-300 text-xl mb-2">The cosmic void awaits</p>
            <p className="text-gray-400">
              No heroes found matching your cosmic criteria
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Reset Cosmic Filters
            </button>
          </div>
        )}

        {/* Cosmic-themed pagination */}
        {!loading && !error && products.length > 0 && (
          <div
            className="flex justify-center mt-12 animate-fadeIn"
            style={{ animationDelay: "1s", animationFillMode: "forwards" }}
          >
            <div className="backdrop-blur-md bg-black/30 border border-gray-700 rounded-full px-2 py-1 flex items-center">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page <= 1 || loading}
                className="relative group px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 disabled:opacity-0"></span>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  <span className="text-gray-200">Previous</span>
                </div>
              </button>

              <div className="px-4 py-1 mx-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-gray-700">
                <span className="text-gray-200 font-medium">
                  {filters.page} <span className="text-gray-400">of</span>{" "}
                  {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages || loading}
                className="relative group px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 disabled:opacity-0"></span>
                <div className="flex items-center">
                  <span className="text-gray-200">Next</span>
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 200px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-expand {
          animation: expand 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default Category;
