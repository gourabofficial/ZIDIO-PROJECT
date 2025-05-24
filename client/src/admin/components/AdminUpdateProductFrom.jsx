import React, { useState, useMemo, useRef, useEffect } from "react";
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
  IndianRupee,
  Edit3,
  Save,
} from "lucide-react";
import { updateProductByIdForAdmin } from "../../Api/admin";

const AdminUpdateProductFrom = ({ product }) => { 
  // Form state
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
    newImages: [], // For newly uploaded images (File objects)
    removedImageIds: [], // Array of public_ids to remove
  });

  // Store initial data for comparison
  const [initialData, setInitialData] = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormInitialized, setIsFormInitialized] = useState(false);
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
    "Hooded",
  ];

  // Collection options
  const collectionOptions = [
    "Marvel Universe",
    "DC Comics",
    "Anime Superheroes",
    "Classic Comics (Superman, Batman, Spiderman, etc.)",
    "Sci-Fi & Fantasy (Star Wars, LOTR, etc.)",
    "Video Game Characters",
    "Custom Fan Art",
  ];

  // Initialize form data when product prop changes
  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      const productData = {
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        size: product.size || [],
        discount: product.discount?.toString() || "0",
        collections: product.collections || "",
        offerStatus: product.offerStatus || false,
        images: product.images || [],
      };

      setFormData({
        ...productData,
        newImages: [],
      });
      setInitialData(productData);
      setIsFormInitialized(true);
    }
  }, [product]);

  // Compare current form data with initial data to check if form has changes
  const hasChanges = useMemo(() => {
    if (!isFormInitialized) return false;

    // Compare basic fields
    const fieldsToCompare = [
      "name",
      "description",
      "price",
      "category",
      "discount",
      "collections",
      "offerStatus",
    ];
    const basicFieldsChanged = fieldsToCompare.some((field) => {
      return formData[field] !== initialData[field];
    });

    // Compare arrays (size and images)
    const sizeChanged =
      JSON.stringify(formData.size.sort()) !==
      JSON.stringify(initialData.size.sort());
    const imagesChanged =
      formData.images.length !== initialData.images.length ||
      JSON.stringify(formData.images.map((img) => img._id)) !==
        JSON.stringify(initialData.images.map((img) => img._id));
    const hasNewImages = formData.newImages.length > 0;

    return basicFieldsChanged || sizeChanged || imagesChanged || hasNewImages;
  }, [formData, initialData, isFormInitialized]);

  // Get only the changed fields
  const getChangedFields = () => {
    if (!isFormInitialized) return {};

    const changes = {};

    // Check basic fields
    const fieldsToCompare = [
      "name",
      "description",
      "price",
      "category",
      "discount",
      "collections",
      "offerStatus",
    ];
    fieldsToCompare.forEach((field) => {
      if (formData[field] !== initialData[field]) {
        // Return the actual value, not an object with from/to
        changes[field] = formData[field];
      }
    });

    // Check size array
    if (
      JSON.stringify(formData.size.sort()) !==
      JSON.stringify(initialData.size.sort())
    ) {
      // Return the actual array, not an object with from/to
      changes.size = formData.size;
    }

    // Check removed images
    if (formData.removedImageIds && formData.removedImageIds.length > 0) {
      changes.removedImageIds = formData.removedImageIds;
    }

    // Check new images
    if (formData.newImages.length > 0) {
      changes.newImages = formData.newImages; // Pass actual file objects
    }

    return changes;
  };

  // Calculate discounted price
  const discountedPrice = useMemo(() => {
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      return null;
    }

    const price = Number(formData.price);
    const discount = formData.offerStatus ? Number(formData.discount) : 0;

    if (discount <= 0) return null;

    const discounted = price - (price * discount) / 100;
    return discounted.toFixed(2);
  }, [formData.price, formData.discount, formData.offerStatus]);

  // Calculate total file size of new images
  const totalNewFileSize = useMemo(() => {
    return formData.newImages.reduce((total, img) => total + img.size, 0);
  }, [formData.newImages]);

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

  // Handle new image selection
  const handleNewImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    // Add new images to newImages array
    setFormData((prevData) => ({
      ...prevData,
      newImages: [...prevData.newImages, ...selectedFiles],
    }));

    // Clear image error if files are selected
    if (selectedFiles.length > 0 && errors.images) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: null,
      }));
    }

    // Reset the input field
    e.target.value = "";
  };

  // Remove an existing image
  const handleRemoveExistingImage = (index) => {
    const imageToRemove = formData.images[index];
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    setFormData({
      ...formData,
      images: updatedImages,
      removedImageIds: [
        ...(formData.removedImageIds || []),
        imageToRemove.public_id || imageToRemove._id,
      ],
    });

    // Add validation error if no images left
    if (updatedImages.length === 0 && formData.newImages.length === 0) {
      setErrors({
        ...errors,
        images: "Please keep at least one product image",
      });
    }
  };

  // Remove a new image
  const handleRemoveNewImage = (index) => {
    const updatedNewImages = [...formData.newImages];
    updatedNewImages.splice(index, 1);

    setFormData({
      ...formData,
      newImages: updatedNewImages,
    });

    // Add validation error if no images left
    if (formData.images.length === 0 && updatedNewImages.length === 0) {
      setErrors({
        ...errors,
        images: "Please keep at least one product image",
      });
    }
  };

  // Validate form
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

    // Validate images (existing + new)
    if (formData.images.length === 0 && formData.newImages.length === 0) {
      newErrors.images = "Please keep at least one product image";
    } else if (formData.newImages.length > 0) {
      // Check if all new files are valid images
      const invalidImages = formData.newImages.filter(
        (file) => !file.type.startsWith("image/")
      );

      if (invalidImages.length > 0) {
        newErrors.images = "Please upload only image files";
      }
    }

    if (!formData.collections.trim()) {
      newErrors.collections = "Collection is required";
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

  // Handle update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Get only changed fields
      const changedFields = getChangedFields();

    

      const res = updateProductByIdForAdmin(product._id, changedFields);
      console.log("API Response:", res);

      // Simulate API success
      toast.success("Product updated successfully!");
      setSuccess(true);

      // Update initial data to current form data (reset comparison)
      const updatedImages = [
        ...formData.images,
        ...formData.newImages.map((file, index) => ({
          _id: `new_${Date.now()}_${index}`,
          public_id: `new_${Date.now()}_${index}`,
          imageUrl: URL.createObjectURL(file),
        })),
      ];

      setInitialData({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        size: formData.size,
        discount: formData.discount,
        collections: formData.collections,
        offerStatus: formData.offerStatus,
        images: updatedImages,
      });

      // Clear new images and removed IDs after successful update
      setFormData((prev) => ({
        ...prev,
        newImages: [],
        removedImageIds: [],
        images: updatedImages,
      }));
    } catch (err) {
      console.error("Error in form submission:", err);
      setErrors({
        general: "An unexpected error occurred",
      });
      toast.error("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers for new images
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-400", "bg-blue-900/10");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-900/10");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-900/10");

    if (e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (droppedFiles.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          newImages: [...prevData.newImages, ...droppedFiles],
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

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  // Show loading state while form is initializing
  if (!isFormInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-b from-gray-900 to-gray-950 text-white p-8 rounded-xl max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-product-container bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-8 rounded-xl max-w-6xl mx-auto shadow-2xl border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Edit3 className="text-blue-400" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Update Product
          </h2>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="flex items-center gap-2 bg-orange-900/20 border border-orange-500/30 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-orange-300 text-sm font-medium">
              Unsaved Changes
            </span>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message bg-green-900/40 backdrop-blur-sm border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center animate-fadeIn">
          <Check className="mr-2 text-green-400" size={20} />
          <span>Product updated successfully!</span>
        </div>
      )}

      {/* General Error Message */}
      {errors.general && (
        <div className="error-message bg-red-900/40 backdrop-blur-sm border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center animate-fadeIn">
          <X className="mr-2 text-red-400" size={20} />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleUpdateProduct} className="product-form space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Basic Product Information */}
            <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-blue-400 mb-6 flex items-center">
                <Package className="mr-2" size={20} />
                Basic Information
              </h3>

              <div className="space-y-6">
                {/* Product Name */}
                <div className="form-group">
                  <label
                    htmlFor="name"
                    className="block mb-2 font-medium text-gray-200"
                  >
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

                {/* Description */}
                <div className="form-group">
                  <label
                    htmlFor="description"
                    className="block mb-2 font-medium text-gray-200"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product in detail"
                    className={`w-full p-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 resize-none ${
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

                {/* Category and Collection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label
                      htmlFor="category"
                      className="block mb-2 font-medium text-gray-200"
                    >
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
                    <label
                      htmlFor="collections"
                      className="block mb-2 font-medium text-gray-200"
                    >
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
                        <ShoppingBag size={16} />
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

                {/* Size Options */}
                <div className="form-group">
                  <label className="block mb-3 font-medium text-gray-200">
                    Size Options *
                  </label>
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

            {/* Pricing & Discount */}
            <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-blue-400 mb-6 flex items-center">
                <IndianRupee className="mr-2" size={20} />
                Pricing & Discount
              </h3>

              <div className="space-y-6">
                {/* Price */}
                <div className="form-group">
                  <label
                    htmlFor="price"
                    className="block mb-2 font-medium text-gray-200"
                  >
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 inset-y-0 flex items-center text-gray-400">
                      ₹
                    </span>
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

                {/* Discount Toggle and Settings */}
                <div className="form-group p-4 bg-gray-800/70 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-4">
                    <label className="flex items-center cursor-pointer">
                      <div
                        className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${
                          formData.offerStatus ? "bg-blue-600" : "bg-gray-700"
                        }`}
                      >
                        <div
                          className={`bg-white w-3 h-3 rounded-full transform transition-transform duration-300 ${
                            formData.offerStatus ? "translate-x-5" : ""
                          }`}
                        ></div>
                      </div>
                      <input
                        type="checkbox"
                        name="offerStatus"
                        checked={formData.offerStatus}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="font-medium ml-3 text-gray-200">
                        Enable Discount
                      </span>
                    </label>
                  </div>

                  <div
                    className={`transition-all duration-300 ${
                      !formData.offerStatus ? "opacity-50" : ""
                    }`}
                  >
                    <label
                      htmlFor="discount"
                      className="block mb-2 font-medium text-gray-300"
                    >
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
                        className={`w-full p-3 pl-10 bg-gray-800 border rounded-lg text-white focus:outline-none transition-all duration-300 ${
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

                    {/* Discounted Price Preview */}
                    {discountedPrice && formData.offerStatus && (
                      <div className="mt-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm border border-green-600/30 rounded-lg p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">
                              Original Price
                            </div>
                            <div className="text-lg font-medium text-gray-300 line-through">
                              ₹{Number(formData.price).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div className="bg-green-900/40 px-3 py-1 rounded-full text-green-300 font-medium text-sm">
                            {formData.discount}% OFF
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">
                              Final Price
                            </div>
                            <div className="text-xl font-bold text-green-400">
                              ₹{Number(discountedPrice).toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="text-green-400 text-sm flex justify-between">
                            <span>Customer Savings:</span>
                            <span className="font-bold">
                              ₹
                              {(
                                Number(formData.price) - Number(discountedPrice)
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-6">
            <div className="bg-gray-800/40 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-blue-400 mb-6 flex items-center">
                <ImageIcon className="mr-2" size={20} />
                Product Images
              </h3>

              <div className="space-y-6">
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="existing-images">
                    <h4 className="text-md font-medium text-gray-300 mb-3 flex items-center">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md mr-2">
                        {formData.images.length}
                      </span>
                      Current Images
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={image._id || index}
                          className="group relative overflow-hidden rounded-lg bg-gray-750 transition-all duration-300 hover:shadow-md hover:shadow-blue-900/30"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-800 rounded-lg">
                            <img
                              src={image.imageUrl}
                              alt={`Product ${index}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-2 right-2 bg-black/70 text-gray-300 hover:text-white hover:bg-red-600 p-1.5 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
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

                {/* Upload New Images */}
                <div className="form-group">
                  <label
                    htmlFor="newImages"
                    className="block mb-3 font-medium text-gray-200"
                  >
                    Add New Images
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-blue-500 transition-colors duration-200 cursor-pointer bg-gray-800/50"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      id="newImages"
                      name="newImages"
                      ref={fileInputRef}
                      onChange={handleNewImageChange}
                      className="hidden"
                      multiple
                      accept="image/*"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      <span className="text-base font-medium text-gray-300">
                        Drop files or click to upload
                      </span>
                      <span className="text-sm mt-1 text-gray-400">
                        Upload high-quality product images (PNG, JPG)
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

                {/* New Images Preview */}
                {formData.newImages.length > 0 && (
                  <div className="new-images-preview p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-blue-400 flex items-center">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md mr-2">
                          {formData.newImages.length}
                        </span>
                        New Images to Upload
                        <span className="ml-3 text-xs text-gray-400">
                          ({(totalNewFileSize / 1024 / 1024).toFixed(2)} MB
                          total)
                        </span>
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, newImages: [] })
                        }
                        className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-900/20"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {formData.newImages.map((image, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg bg-gray-750 transition-all duration-300 hover:shadow-md hover:shadow-blue-900/30"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-800 rounded-lg">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`New Preview ${index}`}
                              className="h-full w-full object-cover"
                              onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="absolute top-2 right-2 bg-black/70 text-gray-300 hover:text-white hover:bg-red-600 p-1.5 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
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
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700">
          <button
            type="submit"
            className={`py-3 px-8 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg ${
              hasChanges && !loading
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-900/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed shadow-gray-900/30"
            }`}
            disabled={!hasChanges || loading}
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
                Updating Product...
              </span>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                {hasChanges ? "Update Product" : "No Changes to Save"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateProductFrom;
