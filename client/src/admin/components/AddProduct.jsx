import React, { useState, useMemo, useRef } from "react";
import { AdminAddProduct } from "../../Api/admin";
import { toast } from "react-toastify";
import { 
  Package, 
  DollarSign, 
  Tag, 
  PercentCircle, 
  Image as ImageIcon, 
  Info, 
  Check, 
  X, 
  ShoppingBag, 
  
  IndianRupee
} from "lucide-react";
import { useAuthdata } from "../../context/AuthContext";

const AddProduct = () => {
  const { token, fetchToken } = useAuthdata();
  // Form state with images array included
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    size: [],
    discount: "0",
    collections: "",
    offerStatus: false,
    images: [],
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("basic"); // basic, pricing, images
  const fileInputRef = useRef(null);

  // Category options
  const categoryOptions = [
    "Oversized",
    "Acid Wash",
    "Graphic Printed",
    "Solid Color",
    "Polo T-Shirts",
    "Sleeveless",
    "Long Sleeve",
    "Henley",
    "Hooded"
  ];

  // Collection options
  const collectionOptions = [
    "Marvel Universe",
    "DC Comics",
    "Anime Superheroes",
    "Classic Comics (Superman, Batman, Spiderman, etc.)",
    "Sci-Fi & Fantasy (Star Wars, LOTR, etc.)",
    "Video Game Characters",
    "Custom Fan Art"
  ];

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      return null;
    }
    
    const price = Number(formData.price);
    const discount = formData.offerStatus ? Number(formData.discount) : 0;
    
    if (discount <= 0) return null;
    
    const discounted = price - (price * discount / 100);
    return discounted.toFixed(2);
  }, [formData.price, formData.discount, formData.offerStatus]);

  // Calculate total file size of all images
  const totalFileSize = useMemo(() => {
    return formData.images.reduce((total, img) => total + img.size, 0);
  }, [formData.images]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear field-specific error when user makes a change
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
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

    // Clear size error if at least one size is selected
    if (updatedSizes.length > 0 && errors.size) {
      setErrors({
        ...errors,
        size: null,
      });
    }
  };

  // Handle file selection to store in formData
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    // Add new images to existing ones in formData
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...selectedFiles],
    }));

    // Clear image error if files are selected
    if (selectedFiles.length > 0 && errors.images) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: null,
      }));
    }

    // Reset the input field to allow selecting the same file again
    e.target.value = "";
  };

  // Remove an image from formData
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setFormData({
      ...formData,
      images: updatedImages,
    });

    // Add validation error if no images left
    if (updatedImages.length === 0) {
      setErrors({
        ...errors,
        images: "Please upload at least one product image",
      });
    }
  };

  // Validate form to check for images in formData
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.size.length === 0) {
      newErrors.size = "Please select at least one size";
    }

    // Validate images
    if (formData.images.length === 0) {
      newErrors.images = "Please upload at least one product image";
    } else {
      // Check if all files are valid images
      const invalidImages = formData.images.filter(
        (file) => !file.type.startsWith("image/")
      );

      if (invalidImages.length > 0) {
        newErrors.images = "Please upload only image files";
      }
    }

    if (!formData.collections.trim()) {
      newErrors.collections = "Collection ID is required";
    }

    if (
      formData.offerStatus &&
      (!formData.discount || Number(formData.discount) <= 0)
    ) {
      newErrors.discount =
        "Please enter a valid discount percentage for offers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission to correctly process images
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Get fresh token before making the request
      console.log("Getting fresh token before product submission...");
      const freshToken = await fetchToken();
      
      if (!freshToken) {
        toast.error("Authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      console.log("Fresh token obtained:", freshToken ? "✓ Available" : "✗ Not available");

      // Create FormData object for submission
      const productFormData = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "size") {
          // Append each size value individually for FormData
          value.forEach((val) => productFormData.append("size", val));
        } else if (key === "images") {
          // Skip images here, we'll add them separately
        } else if (typeof value !== "undefined") {
          productFormData.append(key, value);
        }
      });

      // Add images correctly
      formData.images.forEach((imageFile, index) => {
        productFormData.append(`images`, imageFile);
      });

      // Use the FormData object with correctly appended files and fresh token
      const response = await AdminAddProduct(productFormData, token);

      if (!response.success) {
        toast.error(
          response.message || "Failed to add product. Please try again."
        );
      } else {
        toast.success("Product added successfully!");
        // Success message
        setSuccess(true);

        // Reset form on success
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          size: [],
          discount: "0",
          collections: "",
          offerStatus: false,
          images: [],
        });
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error in form submission:", err);
      setErrors({
        general: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  // Navigation tabs for form sections
  const navigationTabs = [
    { id: "basic", label: "Basic Info", icon: <Info size={18} /> },
    { id: "pricing", label: "Pricing & Options", icon:  <IndianRupee size={18}  /> },
    { id: "images", label: "Product Images", icon: <ImageIcon size={18} /> },
  ];

  // Function to handle drag and drop of images
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-900/10');
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-900/10');
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-900/10');
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith("image/")
      );
      
      if (droppedFiles.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          images: [...prevData.images, ...droppedFiles],
        }));
        
        if (errors.images) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            images: null,
          }));
        }
      }
    }
  };

  return (
    <div className="add-product-container bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-8 rounded-xl max-w-4xl mx-auto shadow-2xl border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-blue-400" size={28} />
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Add New Product
        </h2>
      </div>

      {success && (
        <div className="success-message bg-green-900/40 backdrop-blur-sm border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center animate-fadeIn">
          <Check className="mr-2 text-green-400" size={20} />
          <span>Product added successfully!</span>
        </div>
      )}

      {errors.general && (
        <div className="error-message bg-red-900/40 backdrop-blur-sm border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center animate-fadeIn">
          <X className="mr-2 text-red-400" size={20} />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="navigation-tabs flex mb-6 border-b border-gray-700 overflow-x-auto pb-1 scrollbar-hide">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center py-2 px-4 mr-2 rounded-t-lg transition-all duration-200 whitespace-nowrap ${
              activeSection === tab.id
                ? "bg-blue-900/30 text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/40"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="product-form space-y-6">
        {/* Basic Information Section */}
        <div className={activeSection === "basic" ? "block" : "hidden"}>
          <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700 mb-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
              <Package className="mr-2" size={18} />
              Basic Product Information
            </h3>
            
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="name" className="block mb-1 font-medium text-gray-200">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <X className="mr-1" size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="block mb-1 font-medium text-gray-200">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail"
                  className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                    errors.description
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4"
                  }`}
                  rows="4"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <X className="mr-1" size={14} />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="category" className="block mb-1 font-medium text-gray-200">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 appearance-none ${
                        errors.category
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <Tag size={16} />
                    </div>
                  </div>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <X className="mr-1" size={14} />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="collections" className="block mb-1 font-medium text-gray-200">
                    Collection *
                  </label>
                  <div className="relative">
                    <select
                      id="collections"
                      name="collections"
                      value={formData.collections}
                      onChange={handleChange}
                      className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 appearance-none ${
                        errors.collections
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4"
                      }`}
                    >
                      <option value="">Select Collection</option>
                      {collectionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <Tag size={16} />
                    </div>
                  </div>
                  {errors.collections && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <X className="mr-1" size={14} />
                      {errors.collections}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="block mb-2 font-medium text-gray-200">Size Options *</label>
                <div
                  className={`size-options flex flex-wrap gap-3 p-3 bg-gray-800 border rounded-lg transition-all duration-300 ${
                    errors.size ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  {sizeOptions.map((size) => (
                    <label
                      key={size}
                      className={`size-checkbox inline-flex items-center cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ${
                        formData.size.includes(size)
                          ? "bg-blue-600 text-white border border-blue-500"
                          : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.size.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="sr-only"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
                {errors.size && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <X className="mr-1" size={14} />
                    {errors.size}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveSection("pricing")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              
              Next: Pricing & Options
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pricing Section */}
        <div className={activeSection === "pricing" ? "block" : "hidden"}>
          <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700 mb-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
             <IndianRupee className="mr-2" size={18} />
              Pricing & Discount Options
            </h3>
            
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="price" className="block mb-1 font-medium text-gray-200">
                  Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 inset-y-0 flex items-center text-gray-400">₹</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`w-full p-3 pl-8 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                      errors.price
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4"
                    }`}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <X className="mr-1" size={14} />
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="form-group p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <label className="flex items-center cursor-pointer">
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${formData.offerStatus ? 'bg-blue-600' : 'bg-gray-700'}`}>
                      <div className={`bg-white w-3 h-3 rounded-full transform transition-transform duration-300 ${formData.offerStatus ? 'translate-x-5' : ''}`}></div>
                    </div>
                    <input
                      type="checkbox"
                      name="offerStatus"
                      checked={formData.offerStatus}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="font-medium ml-2 text-gray-200">Enable Discount</span>
                  </label>
                </div>

                <div className={`transition-all duration-300 ${!formData.offerStatus ? 'opacity-50' : ''}`}>
                  <label htmlFor="discount" className="block mb-1 font-medium text-gray-300">
                    Discount Percentage (%)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 inset-y-0 flex items-center text-gray-400">
                      <PercentCircle size={16} />
                    </span>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      className={`w-full p-3 pl-8 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                        errors.discount
                          ? "border-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4"
                      }`}
                      min="0"
                      max="100"
                      disabled={!formData.offerStatus}
                    />
                  </div>
                  {errors.discount && formData.offerStatus && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <X className="mr-1" size={14} />
                      {errors.discount}
                    </p>
                  )}
                  
                  {/* Enhanced discounted price preview */}
                  {discountedPrice && formData.offerStatus && (
                    <div className="mt-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-600/30 rounded-lg p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Original Price</div>
                          <div className="text-lg font-medium text-gray-300 line-through">₹{Number(formData.price).toLocaleString('en-IN')}</div>
                        </div>
                        <div className="bg-green-900/40 px-3 py-1 rounded-full text-green-300 font-medium text-sm">
                          {formData.discount}% OFF
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Final Price</div>
                          <div className="text-xl font-bold text-green-400">₹{Number(discountedPrice).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="text-green-400 text-sm flex justify-between">
                          <span>Customer Savings:</span>
                          <span className="font-bold">
                            ₹{(Number(formData.price) - Number(discountedPrice)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveSection("basic")}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back: Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("images")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              Next: Product Images
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Images Section */}
        <div className={activeSection === "images" ? "block" : "hidden"}>
          <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700 mb-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4 flex items-center">
              <ImageIcon className="mr-2" size={18} />
              Product Images
            </h3>
            
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="images" className="block mb-2 font-medium text-gray-200">
                  Upload Product Images *
                </label>
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200 cursor-pointer bg-gray-800/50"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    id="images"
                    name="images"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-base font-medium text-gray-300">Drop files or click to upload</span>
                    <span className="text-sm mt-1 text-gray-400">
                      Upload high-quality product images (PNG, JPG)
                    </span>
                    <span className="mt-3 text-xs text-blue-400 bg-blue-900/20 py-1 px-3 rounded-full">
                      Recommended: Add at least 3 images from different angles
                    </span>
                  </div>
                </div>
                {errors.images && (
                  <p className="text-red-400 text-sm mt-2 flex items-center">
                    <X className="mr-1" size={14} />
                    {errors.images}
                  </p>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="image-preview mt-5 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-blue-400 flex items-center">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md mr-2">
                        {formData.images.length}
                      </span>
                      Selected Images
                      <span className="ml-3 text-xs text-gray-400">
                        ({(totalFileSize / 1024 / 1024).toFixed(2)} MB total)
                      </span>
                    </h3>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, images: []})}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-900/20"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg bg-gray-750 transition-all duration-300 hover:shadow-md hover:shadow-blue-900/30">
                        <div className="aspect-square relative overflow-hidden bg-gray-800 rounded-t-lg">
                          {/* Image preview */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover"
                              onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                            />
                          </div>
                        </div>
                        <div className="p-2 bg-gray-800">
                          <p className="text-xs text-gray-300 truncate" title={image.name}>
                            {image.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(image.size / 1024).toFixed(1)} KB
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-black/60 text-gray-300 hover:text-white hover:bg-red-600 p-1 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setActiveSection("pricing")}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back: Pricing Options
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-900/30 font-medium flex items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Product...
                </span>
              ) : (
                <>
                  <Check className="mr-2" size={18} />
                  Add Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;