import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { searchProducts } from '../../Api/ProductApi'; 
import ProductCard from '../../components/ProductCard/ProductCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.search.value.trim();
    console.log('Search submitted with value:', searchValue);
    if (searchValue) {
      setSearchParams({ q: searchValue });
    } else {
      setSearchParams({});
    }
  };
  
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Pass only the search query
      const response = await searchProducts({
        query: searchQuery
      });
      
      if (response.success) {
        console.log('Search response:', response);
        setProducts(response.products || []);
        setCollections(response.collections || []);
      } else {
        console.error("Search failed:", response.message);
        setProducts([]);
        setCollections([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full h-fit px-4 md:px-8 lg:px-30 mt-20 min-h-screen bg-[#0c0e16] ">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex gap-2 max-w-xl mx-auto bg-[#1e293b]/70 backdrop-blur-sm p-2 rounded-full">
          <input
            type="text"
            name="search"
            defaultValue={query}
            placeholder="Search products, collections..."
            className="flex-1 p-3 bg-transparent border-none rounded-full focus:outline-none text-white placeholder-gray-400"
            autoFocus
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center gap-2"
          >
            <span>Search</span>
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            {query ? `Search results for "${query}"` : 'Search Products'}
          </h1>
        </div>
        
        {/* Results Sections */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-purple-400 font-medium">Finding results for you...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Products ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => {
                // Transform product data to match ProductCard expectations
                const transformedProduct = {
                  id: product._id || product.product_id,
                  title: product.name,
                  price: product.price,
                  compareAtPrice: product.discount ? product.price + product.discount : null,
                  image: product.images && product.images.length > 0 
                    ? product.images[0].imageUrl 
                    : "https://via.placeholder.com/300",
                  category: product.category,
                  inStock: true,
                  handle: product.id || product.product_id // Add the handle property
                };
                
                return <ProductCard key={transformedProduct.id} product={transformedProduct} />;
              })}
            </div>

            {collections?.length > 0 && (
              <div className="mt-10 w-full h-fit">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Collections ({collections.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map(collection => (
                    <Link
                      key={collection._id || collection.id || collection.slug}
                      to={`/collections/${collection.slug}`}
                      className="transition-transform hover:scale-[1.02]"
                    >
                      <div className="bg-[#1e293b] rounded-lg overflow-hidden">
                        <img
                          src={collection.bannerImageUrl || 'https://via.placeholder.com/600x300'}
                          alt={collection.name || "Collection"}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                          {collection.description && (
                            <p className="text-gray-400 text-sm mt-1">{collection.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          query ? (
            <div className="text-center py-16 rounded-lg">
              <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any matches for "{query}"
              </p>
              <p className="text-gray-500 max-w-md mx-auto">
                Try checking for typos or using more general terms.
              </p>
            </div>
          ) : (
            <div className="text-center py-16 rounded-lg">
              <svg className="w-20 h-20 mx-auto text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Start searching</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Type in the search box above to discover products and collections.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;