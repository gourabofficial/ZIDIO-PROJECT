import React, { useState } from "react";
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
    <div className="add-product-container bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {success && (
        <div className="success-message bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
          Product added successfully!
        </div>
      )}

      {errors.general && (
        <div className="error-message bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form space-y-6">
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
            className={`w-full p-2 bg-gray-800 border rounded text-white focus:outline-none ${
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
            className={`w-full p-2 bg-gray-800 border rounded text-white focus:outline-none ${
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
              className={`w-full p-2 bg-gray-800 border rounded text-white focus:outline-none ${
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
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 bg-gray-800 border rounded text-white focus:outline-none ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-700 focus:border-blue-500"
              }`}
            />
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="collections" className="block mb-1 font-medium">
            Collection ID *
          </label>
          <input
            type="text"
            id="collections"
            name="collections"
            value={formData.collections}
            onChange={handleChange}
            placeholder="Enter collection ID"
            className={`w-full p-2 bg-gray-800 border rounded text-white focus:outline-none ${
              errors.collections
                ? "border-red-500"
                : "border-gray-700 focus:border-blue-500"
            }`}
          />
          {errors.collections && (
            <p className="text-red-400 text-sm mt-1">{errors.collections}</p>
          )}
        </div>

        <div className="form-group">
          <label className="block mb-1 font-medium">Size *</label>
          <div
            className={`size-options flex flex-wrap gap-3 p-3 bg-gray-800 border rounded ${
              errors.size ? "border-red-500" : "border-gray-700"
            }`}
          >
            {sizeOptions.map((size) => (
              <label
                key={size}
                className="size-checkbox inline-flex items-center cursor-pointer bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
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
              Discount (%){" "}
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className={`w-full p-2 bg-gray-800 border rounded text-white focus:outline-none ${
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
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images" className="block mb-1 font-medium">
            Product Images *
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            className={`w-full p-2 bg-gray-800 border rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 ${
              errors.images ? "border-red-500" : "border-gray-700"
            }`}
            multiple
            accept="image/*"
          />
          {errors.images && (
            <p className="text-red-400 text-sm mt-1">{errors.images}</p>
          )}

          {formData.images.length > 0 && (
            <div className="image-preview mt-3 p-3 bg-gray-800 border border-gray-700 rounded">
              <p className="text-sm text-gray-300 mb-2">
                {formData.images.length} file(s) selected
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative bg-gray-700 p-2 rounded">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-gray-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <span className="text-sm truncate flex-1">
                        {image.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition w-full md:w-auto"
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
