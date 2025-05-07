import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, AlertCircle, XCircle, CheckCircle, Loader, ArrowLeft } from 'lucide-react';
import axiosInstance from '../../Api/config';
import { v4 as uuidv4 } from 'uuid'; // Make sure to install uuid with: npm install uuid

const AddProduct = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    id: uuidv4(), // Generate unique ID for the product
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: '',
    size: [],
    isHotItem: false,
    isTranding: false,
    isNewArrival: false,
    offerStatus: false,
    collections: ''
  });
  
  // Image handling
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef(null);
  
  // Form status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Collections state
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  
  // Categories
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Sports', 'Beauty', 'Other'];
  
  // Available sizes
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  
  // Fetch collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      setLoadingCollections(true);
      try {
        const response = await axiosInstance.get('/collections');
        if (response.data.success) {
          setCollections(response.data.collections || []);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoadingCollections(false);
      }
    };
    
    fetchCollections();
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle size selection
  const handleSizeChange = (size) => {
    const updatedSizes = [...formData.size];
    
    if (updatedSizes.includes(size)) {
      // If size is already selected, remove it
      const index = updatedSizes.indexOf(size);
      updatedSizes.splice(index, 1);
    } else {
      // Otherwise add it
      updatedSizes.push(size);
    }
    
    setFormData({
      ...formData,
      size: updatedSizes
    });
  };
  
  // Handle image selection
  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    // Validate file size (5MB limit)
    const invalidFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError(`Some files exceed the 5MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    // Preview images
    const newImagePreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newImagePreviews]);
    setImages([...images, ...selectedFiles]);
  };
  
  // Remove image
  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreview];
    
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImages(updatedImages);
    setImagePreview(updatedPreviews);
  };
  
  // Form validation
  const validateForm = () => {
    if (formData.category === "clothing" && formData.size.length === 0) {
      setError("Please select at least one size for clothing items");
      return false;
    }
    
    if (images.length === 0) {
      setError("Please upload at least one product image");
      return false;
    }
    
    return true;
  };
  
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      // Create form data for multipart/form-data
      const productFormData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'size') {
          // Handle array fields
          productFormData.append('size', JSON.stringify(formData.size));
        } else {
          productFormData.append(key, formData[key]);
        }
      });
      
      // Append images
      images.forEach(image => {
        productFormData.append('images', image);
      });
      
      // Send to backend
      const response = await axiosInstance.post('/product', productFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          id: uuidv4(),
          name: '',
          description: '',
          price: '',
          discount: '0',
          category: '',
          size: [],
          isHotItem: false,
          isTranding: false,
          isNewArrival: false,
          offerStatus: false,
          collections: ''
        });
        setImages([]);
        setImagePreview([]);
        
        // Redirect to product list after 2 seconds
        setTimeout(() => {
          navigate('/admin/products-list');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while adding the product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto pb-10">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/admin/products-list')}
            className="mr-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        </div>
        
        {/* Success message */}
        {success && (
          <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded mb-6 flex items-center">
            <CheckCircle className="mr-2" size={20} />
            <span>Product added successfully! Redirecting to product list...</span>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-gray-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Product Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category<span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                  Price (₹)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              {/* Discount */}
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-300 mb-1">
                  Discount (₹)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              {/* Product ID (Generated automatically) */}
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-1">
                  Product ID<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  required
                  value={formData.id}
                  readOnly
                  className="w-full bg-gray-800 border border-gray-600 text-gray-400 rounded py-2 px-3 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Generated automatically</p>
              </div>
              
              {/* Collections */}
              <div>
                <label htmlFor="collections" className="block text-sm font-medium text-gray-300 mb-1">
                  Collection
                </label>
                <select
                  id="collections"
                  name="collections"
                  value={formData.collections}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingCollections}
                >
                  <option value="">None</option>
                  {collections.map((collection) => (
                    <option key={collection._id} value={collection._id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
                {loadingCollections && (
                  <p className="text-xs text-gray-400 mt-1">Loading collections...</p>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
              ></textarea>
            </div>
          </div>
          
          {/* Size Selection (Only for Clothing) */}
          {formData.category.toLowerCase() === 'clothing' && (
            <div className="bg-gray-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Available Sizes</h2>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    className={`px-4 py-2 rounded-md ${
                      formData.size.includes(size) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Select all sizes that are available for this product
              </p>
            </div>
          )}
          
          {/* Product Tags */}
          <div className="bg-gray-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Product Tags & Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isHotItem"
                    name="isHotItem"
                    checked={formData.isHotItem}
                    onChange={handleChange}
                    className="h-4 w-4 bg-gray-800 border-gray-600 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="isHotItem" className="ml-2 text-sm text-gray-300">
                    Hot Item
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTranding"
                    name="isTranding"
                    checked={formData.isTranding}
                    onChange={handleChange}
                    className="h-4 w-4 bg-gray-800 border-gray-600 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="isTranding" className="ml-2 text-sm text-gray-300">
                    Trending
                  </label>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNewArrival"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                    className="h-4 w-4 bg-gray-800 border-gray-600 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="isNewArrival" className="ml-2 text-sm text-gray-300">
                    New Arrival
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offerStatus"
                    name="offerStatus"
                    checked={formData.offerStatus}
                    onChange={handleChange}
                    className="h-4 w-4 bg-gray-800 border-gray-600 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="offerStatus" className="ml-2 text-sm text-gray-300">
                    Special Offer
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Images */}
          <div className="bg-gray-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Product Images<span className="text-red-500">*</span></h2>
            
            <div className="mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center bg-gray-800 border border-gray-600 text-blue-400 py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                <Upload size={18} className="mr-2" />
                Upload Images
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                multiple
                accept="image/*"
                className="hidden"
              />
              <p className="text-sm text-gray-400 mt-1">
                JPG, PNG or GIF. Max 5MB each.
              </p>
            </div>
            
            {/* Image previews */}
            {imagePreview.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {imagePreview.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 rounded-full p-1 text-red-400 hover:text-red-500"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-8 border-2 border-dashed border-gray-600 rounded-lg text-center">
                <p className="text-gray-400">No images uploaded yet</p>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products-list')}
              className="py-2 px-6 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center py-2 px-6 rounded-lg text-white font-medium transition 
                ${loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;