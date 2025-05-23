import React from "react";
import {
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  DollarSign,
  Truck,
  PercentCircle
} from "lucide-react";

const AdminProductTable = ({
  products = [],
  loading = false,
  totalProducts = 0,
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  goToPreviousPage,
  goToNextPage,
  goToPage,
  onView,
  onEdit,
  onDelete,
}) => {
  // Format price with commas and decimal places
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Enhanced loading state
  if (loading) {
    return (
      <div className="bg-gray-750 rounded-lg border border-gray-700 overflow-hidden">
        <div className="flex flex-col justify-center items-center py-16 space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-400 absolute top-0 left-0" style={{animationDuration: '1.2s'}}></div>
          </div>
          <p className="text-gray-300 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }
  
  // Enhanced empty state
  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-750 rounded-lg border border-gray-700 overflow-hidden">
        <div className="flex flex-col justify-center items-center py-16 px-4 text-center">
          <Package className="h-16 w-16 text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
          <p className="text-gray-400 max-w-md mb-6">
            Try adjusting your search criteria or add a new product to get started.
          </p>
          <button
            onClick={() => goToPage(1)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            View All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-750 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-750">
            <tr>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Package size={14} className="text-gray-400" />
                  <span>Product</span>
                </div>
              </th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <DollarSign size={14} className="text-gray-400" />
                  <span>Price</span>
                </div>
              </th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Truck size={14} className="text-gray-400" />
                  <span>Stock</span>
                </div>
              </th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <PercentCircle size={14} className="text-gray-400" />
                  <span>Discount</span>
                </div>
              </th>
              <th className="py-4 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/70 bg-gray-750">
            {products.map((product) => (
              <tr
                key={product._id || product.id}
                className="hover:bg-gray-700/50 transition-colors duration-150"
              >
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 bg-gray-800 rounded-md overflow-hidden border border-gray-700">
                      {product.image ? (
                        <img
                          className="h-12 w-12 object-cover"
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-700">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white line-clamp-1 max-w-[200px]">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-1">
                        #{product._id?.substring(0, 8) || product.id?.substring(0, 8) || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs leading-5 font-medium rounded-full bg-blue-900/50 text-blue-300 border border-blue-800/50">
                    {product.category || 'Uncategorized'}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {product.discount > 0 ? (
                    <>
                      <div className="text-sm font-medium text-white">
                        {formatPrice(product.price - (product.price * product.discount / 100))}
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-white">
                      {formatPrice(product.price)}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${parseInt(product.stock || 100) > 50 
                      ? "bg-green-900/40 text-green-300" 
                      : parseInt(product.stock || 100) > 10
                        ? "bg-yellow-900/40 text-yellow-300"
                        : "bg-red-900/40 text-red-300"
                    }
                  `}>
                    {product.stock || 100 } 
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {product.discount > 0 ? (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300">
                      {product.discount}% off
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {onView && (
                      <button
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-full hover:bg-gray-700"
                        title="View product details"
                        onClick={() => onView(product)}
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="text-amber-400 hover:text-amber-300 transition-colors p-1.5 rounded-full hover:bg-gray-700"
                        title="Edit product"
                        onClick={() => onEdit(product)}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-full hover:bg-gray-700"
                        title="Delete product"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-750 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{Math.min(products.length, (currentPage - 1) * limit + 1)}</span> to <span className="font-medium text-white">{Math.min(currentPage * limit, totalProducts)}</span> of <span className="font-medium text-white">{totalProducts}</span> products
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md transition-colors ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          
          {(() => {
            let pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
              // Show all pages if there are few
              pages = Array.from({ length: totalPages }, (_, i) => i + 1);
            } else {
              // Show first, last, current and surrounding pages
              const firstPage = 1;
              const lastPage = totalPages;
              
              if (currentPage <= 3) {
                // Near the start
                pages = [1, 2, 3, 4, '...', lastPage];
              } else if (currentPage >= totalPages - 2) {
                // Near the end
                pages = [firstPage, '...', totalPages - 3, totalPages - 2, totalPages - 1, lastPage];
              } else {
                // In the middle
                pages = [firstPage, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
              }
            }
            
            return pages.map((page, index) => {
              if (page === '...') {
                return <span key={`ellipsis-${index}`} className="text-gray-500 px-2">...</span>;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[2rem] h-8 flex items-center justify-center rounded-md transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              );
            });
          })()}
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-blue-400 hover:bg-gray-700 hover:text-blue-300"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductTable;