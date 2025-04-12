import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from './BackButton';
import ProductGallery from './ProductGalery';
import ProductInfo from './ProductInfo';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './ProductAction';
import ProductTabs from './ProductTabs';
import { mockProductDetails } from './ProductDetailsData';

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

  // Added missing handler functions
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
    <div className="container mx-auto px-4 py-24 min-h-[calc(100vh-120px)]">
      <BackButton />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} />

        <div>
          <ProductInfo title={product.title} price={product.price} />
          <SizeSelector 
            sizes={product.sizes} 
            selectedSize={selectedSize}
            onSizeChange={handleSizeChange} 
          />
          <QuantitySelector 
            quantity={quantity} 
            onChange={handleQuantityChange} 
          />
          <ProductActions 
            selectedSize={selectedSize}
            addedToCart={addedToCart}
            isFavorite={isFavorite}
            onAddToCart={handleAddToCart}
            onToggleFavorite={toggleFavorite}
          />
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

// Added the missing components
const LoadingSpinner = () => (
  <div className="flex justify-center py-24">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-[#334155] border-t-[#c4b5fd] animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-[#0f172a] rounded-full"></div>
      </div>
    </div>
  </div>
);

const ProductNotFound = () => (
  <div className="bg-[#1e293b] p-6 rounded-lg text-center">
    <h1 className="text-2xl font-bold text-[#c4b5fd]">Product Not Found</h1>
    <p className="mt-2 text-[#cbd5e1]">This product is no longer available or may have been moved.</p>
  </div>
);

export default ProductDetailsPage;