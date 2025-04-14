import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from './BackButton';
import ProductGallery from './ProductGalery';
import ProductInfo from './ProductInfo';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './ProductAction';
import ProductTabs from './ProductTabs';
import { mockProductDetails } from './ProductDetailsData.js';

const ProductDetailsPage = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Simulate loading product data
    setIsLoading(true);
    setTimeout(() => {
      // Use the mock data or fallback to default
      const productData = mockProductDetails[handle] || mockProductDetails['ashura-t-shirt-preorder'];
      setProduct(productData);
      setIsLoading(false);
    }, 500);
  }, [handle]);

  // Handler functions
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-120px)]">
      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Product Gallery */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <ProductGallery images={product.images} />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <ProductInfo
            title={product.title}
            price={product.price}
            className="text-lg font-semibold"
          />
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeChange={handleSizeChange}
            className="text-base"
          />
          <QuantitySelector
            quantity={quantity}
            onChange={handleQuantityChange}
            className="text-base"
          />
          <ProductActions
            selectedSize={selectedSize}
            addedToCart={addedToCart}
            isFavorite={isFavorite}
            onAddToCart={handleAddToCart}
            onToggleFavorite={toggleFavorite}
          />
          <ProductTabs product={product} className="text-sm" />
        </div>
      </div>
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center py-16">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-[#334155] border-t-[#c4b5fd] animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 bg-[#0f172a] rounded-full"></div>
      </div>
    </div>
  </div>
);

// Product not found component
const ProductNotFound = () => (
  <div className="bg-[#1e293b] p-6 rounded-lg text-center">
    <h1 className="text-xl font-bold text-[#c4b5fd]">Product Not Found</h1>
    <p className="mt-2 text-[#cbd5e1] text-sm">
      This product is no longer available or may have been moved.
    </p>
  </div>
);

export default ProductDetailsPage;