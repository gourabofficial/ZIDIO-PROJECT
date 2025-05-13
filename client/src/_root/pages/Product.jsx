import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "../../components/productDetails/ProductGalery";
import ProductInfo from "../../components/productDetails/ProductInfo";
import AddToCartButton from "../../components/common/AddToCart.jsx";
import { getProductById } from "../../Api/ProductApi.js";
import MiniLoader from "../../components/Loader/MiniLoader.jsx";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);

        console.log("Product data received:", data.product);
        console.log("Product sizes:", data.product.size);

        // If the product has only one size, select it automatically
        if (data.product.size && data.product.size.length === 1) {
          console.log("Auto-selecting single size:", data.product.size[0]);
          setSelectedSize(data.product.size[0]);
        }

        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddedToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Handle size selection with debugging
  const handleSizeSelect = (size) => {
    console.log("Size selected:", size);
    setSelectedSize(size);
  };

  if (loading) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">
          <MiniLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          <div className="text-xl mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Product Not Found</div>
          <div className="text-gray-400">
            The product you're looking for doesn't exist.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-black text-white">
      <div className="container mx-auto px-4 py-16 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ProductGallery images={product.images} />
            </div>
          </div>

          <div className="space-y-6">
            <ProductInfo
              title={product.name}
              price={product.price}
              discount={product.discount}
              originalPrice={
                product.offerStatus
                  ? product.price / (1 - product.discount / 100)
                  : null
              }
            />

            {/* Debug information */}
            <div className="text-xs text-gray-500">
              Available sizes:{" "}
              {Array.isArray(product.size) ? product.size.join(", ") : "None"}
            </div>

            {Array.isArray(product.size) && product.size.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        console.log("Size selected directly:", size);
                        setSelectedSize(size);
                      }}
                      className={`px-4 py-2 border ${
                        selectedSize === size
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-700 hover:border-gray-500"
                      } rounded-md text-sm transition-colors`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                No size selection needed
              </div>
            )}

            <div className="mt-8">
              <AddToCartButton
                product={product}
                selectedSize={selectedSize}
                disabled={
                  !selectedSize &&
                  Array.isArray(product.size) &&
                  product.size.length > 0
                }
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md transition-all hover:shadow-lg hover:shadow-purple-500/20"
                onAddedToCart={handleAddedToCart}
              >
                ADD TO CART
              </AddToCartButton>

              {Array.isArray(product.size) &&
                product.size.length > 0 &&
                !selectedSize && (
                  <p className="text-red-400 text-sm mt-2">
                    Please select a size first
                  </p>
                )}

              {addedToCart && (
                <div className="mt-3 p-2 bg-green-900/30 text-green-400 rounded-md text-center animate-pulse">
                  ✓ Product added to your cart!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
