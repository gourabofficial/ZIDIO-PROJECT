import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getFilteredProducts } from '../../Api/ProductApi';

const Collection = () => {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const titleRef = useRef(null);

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  // Fixed limit value
  const PRODUCTS_PER_PAGE = 12;

  // Format collection name for display
  const formatCollectionTitle = (collectionId) => {
    if (!collectionId) return "COLLECTIONS";
    
    // Replace hyphens with spaces and capitalize each word
    return collectionId
      .split('-')
      .map(word => word.toUpperCase())
      .join(' ');
  };

  // Animated title effect
  useEffect(() => {
    if (titleRef.current) {
      const title = titleRef.current;
      const text = formatCollectionTitle(id);
      title.textContent = '';

      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = `translateY(${Math.random() * 40 - 20}px) rotateZ(${Math.random() * 20 - 10}deg)`;
        span.style.transition = `all 0.5s ease`;
        span.style.transitionDelay = `${index * 0.03}s`;
        
        span.style.color = '#ffffff';
        span.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(150, 170, 255, 0.3)';
        
        title.appendChild(span);

        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0) rotateZ(0)';
        }, 100);
      });
    }
  }, [id]);

  // Fetch products
  const fetchProducts = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Convert collection ID format to match what the backend expects
      const collectionName = id ? id.replace(/-/g, ' ') : '';
      
      const apiParams = {
        collection: collectionName,
        page: pageNum,
        limit: PRODUCTS_PER_PAGE
      };
      
      // Call the API
      const response = await getFilteredProducts(apiParams);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch products");
      }

      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching collection products:", err);
      setError(err.message || "An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    
    // Update URL with page number
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", newPage.toString());
    setSearchParams(newSearchParams);
    
    // Fetch products for the new page
    fetchProducts(newPage);
    
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial fetch
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page")) || 1;
    setPage(currentPage);
    fetchProducts(currentPage);
  }, [id, searchParams, location.pathname, fetchProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-20 pb-16">
      {/* Comic-themed header with collection name */}
      <div className="container mx-auto px-4 mb-8 relative">
        <div className="relative z-10 py-12 text-center">
          <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
            {formatCollectionTitle(id)}
          </h1>
          
          <div className="h-1 w-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mx-auto mb-8 animate-expand"></div>
          
          <p className="text-center text-slate-300 max-w-2xl mx-auto text-lg mb-10 animate-fadeIn opacity-0" 
             style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            Explore our cosmic collection of extraordinary products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Loading state with comic-themed spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-r-indigo-500 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <p className="ml-4 text-gray-300 text-lg font-medium">Summoning cosmic energy...</p>
          </div>
        )}

        {/* Error state with cosmic theme */}
        {error && (
          <div className="relative backdrop-blur-lg bg-black/30 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto overflow-hidden animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-300 text-xl mb-4">Cosmic disturbance: {error}</p>
              <button 
                onClick={() => fetchProducts(1)}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg shadow-lg hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Retry Mission
              </button>
            </div>
          </div>
        )}

        {/* Products grid with cosmic hover effects */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10 animate-fadeIn" 
               style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            {products.map((product, index) => (
              <div key={product._id} 
                   className="group transform transition-all duration-300 hover:scale-105 hover:-rotate-1 animate-fadeIn" 
                   style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
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
              <svg className="w-24 h-24 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <p className="text-gray-300 text-xl mb-2">
              The cosmic void awaits
            </p>
            <p className="text-gray-400">
              No heroes found in the {formatCollectionTitle(id)} universe yet
            </p>
          </div>
        )}

        {/* Cosmic-themed pagination */}
        {!loading && !error && products.length > 0 && (
          <div className="flex justify-center mt-12 animate-fadeIn" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <div className="backdrop-blur-md bg-black/30 border border-gray-700 rounded-full px-2 py-1 flex items-center">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
                className="relative group px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 disabled:opacity-0"></span>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  <span className="text-gray-200">Previous</span>
                </div>
              </button>
              
              <div className="px-4 py-1 mx-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-gray-700">
                <span className="text-gray-200 font-medium">
                  {page} <span className="text-gray-400">of</span> {totalPages}
                </span>
              </div>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || loading}
                className="relative group px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 disabled:opacity-0"></span>
                <div className="flex items-center">
                  <span className="text-gray-200">Next</span>
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes expand {
          from { width: 0; }
          to { width: 200px; }
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

export default Collection;