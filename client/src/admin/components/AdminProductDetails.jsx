import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  DollarSign, 
  Tag, 
  Calendar,
  Image as ImageIcon,
 
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Hash,
  Info,
  IndianRupee
} from 'lucide-react';
import { getAllSearchProducts, getProductByIdForAdmin } from '../../Api/admin';
import toast from 'react-hot-toast';

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to use the specific admin API first if it exists
      try {
        const adminResponse = await getProductByIdForAdmin(id);
        if (adminResponse.success && adminResponse.product) {
          const formattedProduct = formatProductData(adminResponse.product);
          setProduct(formattedProduct);
          return;
        }
      } catch (adminError) {
        console.log('Admin API not available, falling back to search');
      }
      
      // Fallback to getAllSearchProducts
      const response = await getAllSearchProducts('', 1, 1000);
      
      if (response.success && response.data) {
        const foundProduct = response.data.find(p => p._id === id || p.id === id);
        
        if (foundProduct) {
          const formattedProduct = formatProductData(foundProduct);
          setProduct(formattedProduct);
        } else {
          setError('Product not found');
          toast.error('Product not found');
        }
      } else {
        setError(response.message || 'Failed to fetch product details');
        toast.error(response.message || 'Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details');
      toast.error('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  // Function to format product data and handle images
  const formatProductData = (productData) => {
    let formattedImages = [];
    
    // Handle different image data structures
    if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
      formattedImages = productData.images.map(img => {
        if (typeof img === 'string') {
          return img;
        } else if (img.imageUrl) {
          return img.imageUrl;
        } else if (img.url) {
          return img.url;
        }
        return img;
      }).filter(Boolean);
    } else if (productData.image) {
      formattedImages = [productData.image];
    }
    
    return {
      ...productData,
      images: formattedImages,
      image: formattedImages.length > 0 ? formattedImages[0] : null
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImageNavigation = (direction) => {
    if (!product.images || product.images.length <= 1) return;
    
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-300">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Product Not Found</h3>
          <p className="text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/products-list')}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Product Details</h1>
              <p className="text-sm text-gray-400 mt-1">Manage and view product information</p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/admin/edit-products/${id}`)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Edit size={18} />
            <span>Edit Product</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images - Smaller Section */}
          <div className="lg:col-span-1 space-y-4">
            {/* Main Image Display - Smaller */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="relative aspect-square bg-gray-750">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[selectedImage]}
                      alt={`${product.name} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x400/374151/9CA3AF?text=No+Image";
                      }}
                    />
                    
                    {/* Navigation arrows for multiple images */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageNavigation('prev')}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => handleImageNavigation('next')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                        
                        {/* Image counter */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {selectedImage + 1} / {product.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Thumbnails - Smaller */}
            {product.images && product.images.length > 1 && (
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <h4 className="text-xs font-medium text-gray-300 mb-2">
                  Gallery ({product.images.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded overflow-hidden border transition-all ${
                        selectedImage === index 
                          ? 'border-blue-500 ring-1 ring-blue-500/30' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100x100/374151/9CA3AF?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Information - Larger Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-gray-400">
                      <Hash size={14} className="mr-1" />
                      {product._id || product.id}
                    </span>
                    
                  </div>
                </div>
              </div>

              {product.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Info size={14} className="mr-1" />
                    Description
                  </h4>
                  <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>
                </div>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pricing Information */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <IndianRupee size={18} className="mr-2 text-green-400" />
                  Pricing
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide">Original Price</label>
                    <div className="text-xl font-bold text-gray-300 mt-1">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  {product.discount > 0 && (
                    <>
                      <div>
                        <label className="text-xs font-medium text-gray-300 uppercase tracking-wide">Discount</label>
                        <div className="text-lg font-semibold text-orange-400 mt-1">
                          {product.discount}% OFF
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-300 uppercase tracking-wide">Final Price</label>
                        <div className="text-xl font-bold text-green-400 mt-1">
                          {formatPrice(product.price - (product.price * product.discount) / 100)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Inventory Information */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Package size={18} className="mr-2 text-blue-400" />
                  Inventory
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide">Stock Quantity</label>
                    <div className="text-2xl font-bold text-white mt-1">
                      {product.stock || 0}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">units available</div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide">Category</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 text-sm bg-purple-900/40 text-purple-300 rounded-full">
                        <Tag size={12} className="mr-1" />
                        {product.category || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.createdAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Created Date
                    </label>
                    <div className="text-sm text-gray-400 mt-1">{formatDate(product.createdAt)}</div>
                  </div>
                )}

                {product.updatedAt && (
                  <div>
                    <label className="text-xs font-medium text-gray-300 uppercase tracking-wide flex items-center">
                      <Clock size={12} className="mr-1" />
                      Last Updated
                    </label>
                    <div className="text-sm text-gray-400 mt-1">{formatDate(product.updatedAt)}</div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-300 uppercase tracking-wide flex items-center">
                    <ImageIcon size={12} className="mr-1" />
                    Total Images
                  </label>
                  <div className="text-sm text-gray-400 mt-1">
                    {product.images ? product.images.length : 0} image(s)
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;