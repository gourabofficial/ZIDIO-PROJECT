import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CollectionHeader from './CollectionHeader';
import CollectionControls from './CollectionControll';
import FilterPanel from './FilterPanel';
import ProductGrid from './ProductGrid';
import ProductList from './ProductsList';
import Pagination from './Pagination';
import { mockCollectionProducts, collectionTitles } from './CollectionData';

const CollectionPage = () => {
  const { collectionHandle } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('best-selling');
  const [activeFilters, setActiveFilters] = useState({
    price: [],
    size: []
  });

  useEffect(() => {
    // Simulate loading collection data
    setIsLoading(true);
    setTimeout(() => {
      // Get the collection products or default to all
      const handle = collectionHandle || 'all';
      const collectionProducts = mockCollectionProducts[handle] || mockCollectionProducts['all'];

      let sortedProducts = [...collectionProducts];

      // Sort products based on selection
      switch(sortBy) {
        case 'price-low-high':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'title-a-z':
          sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-z-a':
          sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
          break;
        // best-selling is default, no sorting needed
        default:
          break;
      }

      setProducts(sortedProducts);
      setIsLoading(false);
    }, 500);
  }, [collectionHandle, sortBy]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const togglePriceFilter = (range) => {
    setActiveFilters(prev => {
      const newPriceFilters = prev.price.includes(range) 
        ? prev.price.filter(item => item !== range)
        : [...prev.price, range];
        
      return { ...prev, price: newPriceFilters };
    });
  };

  const toggleSizeFilter = (size) => {
    setActiveFilters(prev => {
      const newSizeFilters = prev.size.includes(size)
        ? prev.size.filter(item => item !== size)
        : [...prev.size, size];
        
      return { ...prev, size: newSizeFilters };
    });
  };

  // Get collection title
  const title = collectionTitles[collectionHandle] || 'All Products';

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <CollectionHeader title={title} />

      <CollectionControls 
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        toggleFilter={toggleFilter}
      />

      {isFilterOpen && (
        <FilterPanel 
          activeFilters={activeFilters}
          togglePriceFilter={togglePriceFilter}
          toggleSizeFilter={toggleSizeFilter}
          onClose={toggleFilter}
          clearFilters={() => setActiveFilters({ price: [], size: [] })}
        />
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <ProductGrid products={products} />
          ) : (
            <ProductList products={products} />
          )}
          
          {products.length === 0 && (
            <EmptyState />
          )}

          {products.length > 0 && (
            <Pagination />
          )}
        </>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center py-24">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-[#334155] border-t-[#c4b5fd] animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-[#0f172a] rounded-full"></div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="bg-[#1e293b] inline-block p-6 rounded-lg">
      <p className="text-xl text-[#c4b5fd] font-medium mb-2">No products found</p>
      <p className="text-[#cbd5e1]">Try adjusting your filter criteria</p>
    </div>
  </div>
);

export default CollectionPage;