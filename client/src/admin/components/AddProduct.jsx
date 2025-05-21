import React, { useState, useMemo } from "react";
import { AdminAddProduct } from "../../Api/admin";
import { toast } from "react-toastify";

const AddProduct = () => {
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

  // Handle form input changes (keep existing function)
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

  // Handle size selection (keep existing function)
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

  // Updated: Handle file selection to store in formData
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

  // Updated: Remove an image from formData
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

  // Updated: Validate form to check for images in formData
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

  // Updated: Form submission to correctly process images
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Create FormData object for submission
      const productFormData = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "size") {
          // Handle array of sizes
          productFormData.append("size", JSON.stringify(value));
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

      // Use the FormData object with correctly appended files
      const response = await AdminAddProduct(formData);

      if (!response.success) {
        toast.error(
          response.message || "Failed to add product. Please try again."
        );
      } else {
        toast.success("Product added successfully!");
      }

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

  return (
    <div className="add-product-container bg-gradient-to-b from-gray-900 to-gray-950 text-white p-8 rounded-xl max-w-4xl mx-auto shadow-2xl border border-gray-800">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
        Add New Product
      </h2>

      {success && (
        <div className="success-message bg-green-900/40 backdrop-blur-sm border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Product added successfully!
        </div>
      )}

      {errors.general && (
        <div className="error-message bg-red-900/40 backdrop-blur-sm border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          {errors.general}
        </div>
      )}

      {/* Rest of your form with improved styling */}
      <form onSubmit={handleSubmit} className="product-form space-y-8">
        <div className="form-group">
          <label htmlFor="name" className="block mb-1 font-medium">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
              errors.name
                ? "border-red-500"
                : "border-gray-700 focus:border-blue-500"
            }`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block mb-1 font-medium">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
              errors.description
                ? "border-red-500"
                : "border-gray-700 focus:border-blue-500"
            }`}
            rows="4"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="price" className="block mb-1 font-medium">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                errors.price
                  ? "border-red-500"
                  : "border-gray-700 focus:border-blue-500"
              }`}
              min="0"
              step="0.01"
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="block mb-1 font-medium">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-700 focus:border-blue-500"
              }`}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="collections" className="block mb-1 font-medium">
            Collection *
          </label>
          <select
            id="collections"
            name="collections"
            value={formData.collections}
            onChange={handleChange}
            className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
              errors.collections
                ? "border-red-500"
                : "border-gray-700 focus:border-blue-500"
            }`}
          >
            <option value="">Select Collection</option>
            {collectionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.collections && (
            <p className="text-red-400 text-sm mt-1">{errors.collections}</p>
          )}
        </div>

        <div className="form-group">
          <label className="block mb-1 font-medium">Size *</label>
          <div
            className={`size-options flex flex-wrap gap-3 p-3 bg-gray-800 border rounded-lg transition-all duration-300 ${
              errors.size ? "border-red-500" : "border-gray-700"
            }`}
          >
            {sizeOptions.map((size) => (
              <label
                key={size}
                className="size-checkbox inline-flex items-center cursor-pointer bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                <input
                  type="checkbox"
                  checked={formData.size.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
          {errors.size && (
            <p className="text-red-400 text-sm mt-1">{errors.size}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="offerStatus"
                checked={formData.offerStatus}
                onChange={handleChange}
                className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-25"
              />
              <span className="font-medium">Offer Status</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="discount" className="block mb-1 font-medium">
              Discount (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
                errors.discount
                  ? "border-red-500"
                  : "border-gray-700 focus:border-blue-500"
              } ${!formData.offerStatus ? "opacity-50" : ""}`}
              min="0"
              max="100"
              disabled={!formData.offerStatus}
            />
            {errors.discount && (
              <p className="text-red-400 text-sm mt-1">{errors.discount}</p>
            )}
            
            {/* Add enhanced discounted price preview with saved amount */}
            {discountedPrice && formData.offerStatus && (
              <div className="mt-2 bg-green-900/20 backdrop-blur-sm border border-green-600/20 rounded-lg p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-green-400 font-medium">₹{discountedPrice}</span>
                    <span className="ml-2 line-through text-gray-400 text-sm">₹{formData.price}</span>
                  </div>
                  <div className="bg-green-500/30 px-2 py-1 rounded text-xs text-green-300 font-medium">
                    {formData.discount}% OFF
                  </div>
                </div>
                <div className="text-green-400 text-sm mt-1">
                  Customer saves: 
                  <span className="font-medium ml-1">
                    ₹{(Number(formData.price) * Number(formData.discount) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images" className="block mb-2 font-medium text-gray-200">
            Product Images *
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200">
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              className="hidden"
              multiple
              accept="image/*"
            />
            <label htmlFor="images" className="flex flex-col items-center justify-center cursor-pointer">
              <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span className="text-base font-medium text-gray-300">Drop files or click to upload</span>
              <span className="text-sm mt-1 text-gray-400">
                Upload high-quality product images (PNG, JPG)
              </span>
            </label>
          </div>
          {errors.images && (
            <p className="text-red-400 text-sm mt-2">{errors.images}</p>
          )}

          {formData.images.length > 0 && (
            <div className="image-preview mt-5 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-blue-400">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md mr-2">
                    {formData.images.length}
                  </span>
                  Selected Images
                </h3>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, images: []})}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-900/30 font-medium"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
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
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
