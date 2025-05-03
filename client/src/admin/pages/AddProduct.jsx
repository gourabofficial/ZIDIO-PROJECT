import React, { useState, useEffect } from "react";
import {
  Package,
  Image as ImageIcon,
  Tag,
  IndianRupee,
  Layers,
  AlertCircle,
  Save,
  RefreshCw,
  X,
  Plus,
  Check,
  Bookmark,
  Percent,
  Ruler,
  Upload,
  Flame,
  Star,
  CircleOff,
  Sparkles,
} from "lucide-react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
    collection: "",
    sizes: [],
    discount: "",
    // New fields for product tags
    isNewArrival: false,
    isTranding: false,
    isHotItem: false,
    offerStatus: false,
    id: Date.now().toString(), // Unique ID as required by the model
  });

  // Add collections data
  const collections = [
    "Summer Collection",
    "Winter Collection",
    "Spring Collection",
    "Fall Collection",
    "Holiday Collection",
    "Limited Edition",
  ];

  // Add available sizes
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    "Mervel",
    "Superman",
    "Batman",
    "Spiderman",
    "Ironman",
    "Hulk",
    "Thor",
    "Captain America",
    "Wonder",
    "Black Widow",
  ];

  const validate = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.description.trim())
      newErrors.description = "Description is required";
    if (!product.price) newErrors.price = "Price is required";
    else if (isNaN(product.price) || parseFloat(product.price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.stock) newErrors.stock = "Stock quantity is required";
    else if (isNaN(product.stock) || parseInt(product.stock) < 0)
      newErrors.stock = "Stock must be a non-negative number";
    if (product.images.length === 0)
      newErrors.images = "At least one image is required";

    // Validate new fields
    if (
      product.discount &&
      (isNaN(product.discount) ||
        parseFloat(product.discount) < 0 ||
        parseFloat(product.discount) > 100)
    )
      newErrors.discount = "Discount must be a number between 0 and 100";
    if (
      product.sizes.length === 0 &&
      ["Clothing", "Sports"].includes(product.category)
    )
      newErrors.sizes = "At least one size is required for this category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    const currentSizes = [...product.sizes];

    if (currentSizes.includes(size)) {
      // Remove size if already selected
      setProduct({
        ...product,
        sizes: currentSizes.filter((s) => s !== size),
      });
    } else {
      // Add size if not already selected
      setProduct({
        ...product,
        sizes: [...currentSizes, size],
      });
    }

    // Clear size error if any
    if (errors.sizes) {
      setErrors({ ...errors, sizes: undefined });
    }
  };

  // Improved image upload with drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Preview images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);

    // Store files for submission
    setProduct({ ...product, images: [...product.images, ...files] });

    // Clear any image-related error
    if (errors.images) {
      setErrors({ ...errors, images: undefined });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Preview images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);

    // Store files for submission
    setProduct({ ...product, images: [...product.images, ...files] });

    // Clear any image-related error
    if (errors.images) {
      setErrors({ ...errors, images: undefined });
    }
  };

  const removeImage = (index) => {
    const updatedPreviews = [...imagePreview];
    const updatedImages = [...product.images];

    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);

    updatedPreviews.splice(index, 1);
    updatedImages.splice(index, 1);

    setImagePreview(updatedPreviews);
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all product fields to FormData
      for (const key in product) {
        if (key === "images") {
          // Add each image file individually
          product.images.forEach((image) => {
            formData.append("files", image);
          });
        } else if (key === "sizes") {
          // Add each size individually
          product.sizes.forEach((size) => {
            formData.append("size", size);
          });
        } else {
          formData.append(key, product[key]);
        }
      }

      // Make API call to backend
      // Using axios for the API call
      // const response = await axios.post('/api/admin/products', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Product submitted:", product);
      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          images: [],
          collection: "",
          sizes: [],
          discount: "",
          isNewArrival: false,
          isTranding: false,
          isHotItem: false,
          offerStatus: false,
          id: Date.now().toString(),
        });
        setImagePreview([]);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting product:", error);
      setErrors({ submit: "Failed to submit product. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 sm:p-6 border-b border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <Package className="mr-3" size={24} />
          Add New Product
        </h2>
        <p className="text-green-100 mt-2">
          Enter the product details below to add a new product to the inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {submitSuccess && (
          <div className="mb-6 bg-green-600 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded flex items-center">
            <Check size={20} className="mr-2" />
            <span>Product added successfully!</span>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-600 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Product Name <span className="text-red-400">*</span>
            </label>
            <div
              className={`relative rounded-md shadow-sm ${
                errors.name ? "border-red-500" : ""
              }`}
            >
              <input
                type="text"
                name="name"
                id="name"
                value={product.name}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${
                  errors.name ? "border-red-500" : "border-gray-600"
                } rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter product name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={product.description}
              onChange={handleChange}
              className={`w-full bg-gray-700 border ${
                errors.description ? "border-red-500" : "border-gray-600"
              } rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe the product in detail"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag size={18} className="text-gray-400" />
              </div>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${
                  errors.category ? "border-red-500" : "border-gray-600"
                } rounded-md py-3 pl-10 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Collection */}
          <div>
            <label
              htmlFor="collection"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Collection
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Bookmark size={18} className="text-gray-400" />
              </div>
              <select
                id="collection"
                name="collection"
                value={product.collection}
                onChange={handleChange}
                className={`w-full bg-gray-700 border border-gray-600 rounded-md py-3 pl-10 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select a collection (optional)</option>
                {collections.map((collection) => (
                  <option key={collection} value={collection}>
                    {collection}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Price (₹) <span className="text-red-400">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="price"
                id="price"
                value={product.price}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${
                  errors.price ? "border-red-500" : "border-gray-600"
                } rounded-md py-3 pl-10 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Discount (%)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Percent size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="discount"
                id="discount"
                value={product.discount}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${
                  errors.discount ? "border-red-500" : "border-gray-600"
                } rounded-md py-3 pl-10 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0"
              />
            </div>
            {errors.discount && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.discount}
              </p>
            )}
            {product.price && product.discount && (
              <p className="mt-1 text-sm text-gray-400">
                Final price: ₹
                {(
                  parseFloat(product.price) *
                  (1 - parseFloat(product.discount || 0) / 100)
                ).toFixed(2)}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Stock Quantity <span className="text-red-400">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Layers size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="stock"
                id="stock"
                value={product.stock}
                onChange={handleChange}
                className={`w-full bg-gray-700 border ${
                  errors.stock ? "border-red-500" : "border-gray-600"
                } rounded-md py-3 pl-10 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0"
              />
            </div>
            {errors.stock && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.stock}
              </p>
            )}
          </div>

          {/* Product Tags - NEW SECTION */}
          <div className="col-span-1 md:col-span-2 bg-gray-750 p-4 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Sparkles size={18} className="text-yellow-500 mr-2" />
              Product Tags
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 py-2 px-3 rounded-md bg-gray-700 hover:bg-gray-650 transition-colors">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={product.isNewArrival}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300 flex items-center">
                  <Star size={16} className="text-yellow-400 mr-2" />
                  New Arrival
                </span>
              </label>

              <label className="flex items-center space-x-3 py-2 px-3 rounded-md bg-gray-700 hover:bg-gray-650 transition-colors">
                <input
                  type="checkbox"
                  name="isTranding"
                  checked={product.isTranding}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300 flex items-center">
                  <Flame size={16} className="text-orange-500 mr-2" />
                  Trending
                </span>
              </label>

              <label className="flex items-center space-x-3 py-2 px-3 rounded-md bg-gray-700 hover:bg-gray-650 transition-colors">
                <input
                  type="checkbox"
                  name="isHotItem"
                  checked={product.isHotItem}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300 flex items-center">
                  <Flame size={16} className="text-red-500 mr-2" />
                  Hot Item
                </span>
              </label>

              <label className="flex items-center space-x-3 py-2 px-3 rounded-md bg-gray-700 hover:bg-gray-650 transition-colors">
                <input
                  type="checkbox"
                  name="offerStatus"
                  checked={product.offerStatus}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-gray-700"
                />
                <span className="text-gray-300 flex items-center">
                  <Percent size={16} className="text-green-500 mr-2" />
                  On Offer
                </span>
              </label>
            </div>
          </div>

          {/* Sizes */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Available Sizes{" "}
              {["Clothing", "Sports"].includes(product.category) && (
                <span className="text-red-400">*</span>
              )}
            </label>
            <div className="flex items-center mb-2">
              <Ruler size={18} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-400">
                Select all sizes available for this product
              </span>
            </div>

            <div
              className={`bg-gray-750 p-3 rounded-md border ${
                errors.sizes ? "border-red-500" : "border-gray-700"
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                      product.sizes.includes(size)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {errors.sizes && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.sizes}
              </p>
            )}
            {product.sizes.length > 0 && (
              <p className="mt-1 text-sm text-gray-400">
                {product.sizes.length} size{product.sizes.length > 1 ? "s" : ""}{" "}
                selected
              </p>
            )}
          </div>

          {/* Image Upload - IMPROVED */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Images <span className="text-red-400">*</span>
            </label>
            <div
              className={`border-2 border-dashed ${
                errors.images
                  ? "border-red-500"
                  : isDragging
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-gray-600"
              } 
                rounded-lg p-6 text-center transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <Upload
                  size={48}
                  className={`${
                    isDragging ? "text-blue-400" : "text-gray-500"
                  } mb-2 transition-colors`}
                />
                <p className="text-gray-300 mb-2">
                  {isDragging
                    ? "Drop files here"
                    : "Drag & drop images here, or click to select files"}
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  PNG, JPG or WEBP (Max 5MB each)
                </p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="flex items-center">
                    <Plus size={18} className="mr-1" />
                    Upload Images
                  </span>
                </label>
              </div>
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.images}
              </p>
            )}

            {imagePreview.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Preview:{" "}
                  <span className="text-gray-400 font-normal">
                    ({imagePreview.length} images)
                  </span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative group">
                      <div className="border border-gray-700 rounded-lg overflow-hidden aspect-square bg-gray-800">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        aria-label="Remove image"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-gray-700 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-900/10 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Plus size={24} className="text-gray-500 mb-1" />
                    <span className="text-xs text-gray-500">Add more</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Saving...
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
  );
};

export default AddProduct;
