import React, { useState } from 'react';
import { addProduct } from '../../Api/admin';

const AddProduct = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    size: [],
    isNewArrival: false,
    isTranding: false,
    isHotItem: false,
    offerStatus: false,
    discount: '0',
    collections: ''
  });
  
  // File upload state
  const [images, setImages] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle form input changes
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
      const index = updatedSizes.indexOf(size);
      updatedSizes.splice(index, 1);
    } else {
      updatedSizes.push(size);
    }
    setFormData({ ...formData, size: updatedSizes });
  };
  
  // Handle file selection
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form
      if (formData.size.length === 0) {
        throw new Error("Please select at least one size");
      }
      
      if (images.length === 0) {
        throw new Error("Please upload at least one image");
      }
      
      // Create FormData object for multipart/form-data submission
      const productFormData = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'size') {
          // Handle array of sizes
          value.forEach(size => productFormData.append('size', size));
        } else if (typeof value !== 'undefined') {
          productFormData.append(key, value);
        }
      });
      
      // Add image files
      images.forEach(image => {
        productFormData.append('images', image);
      });
      
      // Submit form
      const response = await addProduct(productFormData);
      
      if (response.success || response.product) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          size: [],
          isNewArrival: false,
          isTranding: false,
          isHotItem: false,
          offerStatus: false,
          discount: '0',
          collections: ''
        });
        setImages([]);
      } else {
        setError(response.message || 'Failed to add product');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while adding the product');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
  
  return (
    <div className="add-product-container bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      {success && (
        <div className="success-message bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
          Product added successfully!
        </div>
      )}
      
      {error && (
        <div className="error-message bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        <div className="form-group mb-4">
          <label htmlFor="description" className="block mb-1 font-medium">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none"
            rows="4"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="price" className="block mb-1 font-medium">Price (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="discount" className="block mb-1 font-medium">Discount (₹) *</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div className="form-group mb-4">
          <label htmlFor="category" className="block mb-1 font-medium">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        
        <div className="form-group mb-4">
          <label className="block mb-1 font-medium">Size *</label>
          <div className="size-options flex flex-wrap gap-3 p-3 bg-gray-800 border border-gray-700 rounded">
            {sizeOptions.map(size => (
              <label key={size} className="size-checkbox inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.size.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="mr-1 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group mb-4">
          <label htmlFor="images" className="block mb-1 font-medium">Product Images *</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
            multiple
            accept="image/*"
          />
          
          {images.length > 0 && (
            <div className="image-preview mt-2 p-2 bg-gray-800 border border-gray-700 rounded">
              <p className="text-sm text-gray-300">{images.length} file(s) selected</p>
              <ul className="list-disc pl-5 mt-1 text-gray-300">
                {images.map((image, index) => (
                  <li key={index} className="text-sm">{image.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="form-group mb-6">
          <label className="block mb-2 font-medium">Product Features</label>
          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-800 border border-gray-700 rounded">
            <label className="feature-checkbox inline-flex items-center">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
              />
              <span>New Arrival</span>
            </label>
            
            <label className="feature-checkbox inline-flex items-center">
              <input
                type="checkbox"
                name="isTranding"
                checked={formData.isTranding}
                onChange={handleChange}
                className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
              />
              <span>Trending</span>
            </label>
            
            <label className="feature-checkbox inline-flex items-center">
              <input
                type="checkbox"
                name="isHotItem"
                checked={formData.isHotItem}
                onChange={handleChange}
                className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
              />
              <span>Hot Item</span>
            </label>
            
            <label className="feature-checkbox inline-flex items-center">
              <input
                type="checkbox"
                name="offerStatus"
                checked={formData.offerStatus}
                onChange={handleChange}
                className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
              />
              <span>On Offer</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-button bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;