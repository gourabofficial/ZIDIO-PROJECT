import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "../../components/productDetails/ProductGalery";
import ProductInfo from "../../components/productDetails/ProductInfo";
import SizeSelector from "../../components/productDetails/SizeSelector";
import ProductActions from "../../components/productDetails/ProductAction";
import ProductTabs from "../../components/productDetails/ProductTabs";
import { getProductById } from "../../Api/ProductApi.js";

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

        console.log("Product data:", data);

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

  if (loading) {
    return (
      <div className="min-h-[600px] bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading product details...</div>
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
            <SizeSelector
              sizes={product.size}
              
            />
            {/* <ProductActions
              product={{
                ...product,
                quantity: 1,
              }}
              selectedSize={selectedSize}
              addedToCart={addedToCart}
              onAddToCart={handleAddToCart}
            /> */}
            {/* <ProductTabs product={product} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
