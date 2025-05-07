import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom' // Import to get URL parameters
import ProductGallery from '../../components/productDetails/ProductGalery'
import ProductInfo from '../../components/productDetails/ProductInfo';
import SizeSelector from '../../components/productDetails/SizeSelector';
import QuantitySelector from '../../components/productDetails/QuantitySelector';
import ProductActions from '../../components/productDetails/ProductAction';
import ProductTabs from '../../components/productDetails/ProductTabs';
 
const Product = () => {
  // State for product details
  const [currentProduct, setCurrentProduct] = useState(null);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get product slug from URL
  const { slug } = useParams();

  const handleSizeChange = (size) => setSelectedSize(size);
  const handleQuantityChange = (newQuantity) => setQuantity(newQuantity);
  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  // Mock data - this will be replaced by backend data
  const mockProductDetails = {
    'ashura-t-shirt-preorder': {
      id: 1,
      title: 'Ashura T-shirt (Preorder)',
      price: 1749.00,
      images: [
        'https://ext.same-assets.com/1329671863/2325432086.jpeg',
        'https://ext.same-assets.com/1329671863/769031796.jpeg',
        'https://ext.same-assets.com/1881412388/4177231920.jpeg',
        'https://ext.same-assets.com/1881412388/2575181993.jpeg',
        'https://ext.same-assets.com/1881412388/3668537975.jpeg'
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      sku: 'Nox11S',
      categories: ['All', 'New Arrival', 'Nox Collection - SS1.0', 'Tshirt']
    },
    'my-own-theater': { // Fixed unique key for second product
      id: 2,
      title: 'My Own Theater',
      price: 1749.00,
      images: [
        'https://ext.same-assets.com/1329671863/2325432086.jpeg',
        'https://ext.same-assets.com/1329671863/769031796.jpeg',
        'https://ext.same-assets.com/1881412388/4177231920.jpeg',
        'https://ext.same-assets.com/1881412388/2575181993.jpeg',
        'https://ext.same-assets.com/1881412388/3668537975.jpeg'
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      sku: 'Nox11S',
      categories: ['All', 'New Arrival', 'Nox Collection - SS1.0', 'Tshirt']
    },
    'free-tshirt': { // Fixed unique key for third product
      id: 3,
      title: 'Free T-shirt',
      price: 1749.00,
      images: [
        'https://ext.same-assets.com/1329671863/2325432086.jpeg',
        'https://ext.same-assets.com/1329671863/769031796.jpeg',
        'https://ext.same-assets.com/1881412388/4177231920.jpeg',
        'https://ext.same-assets.com/1881412388/2575181993.jpeg',
        'https://ext.same-assets.com/1881412388/3668537975.jpeg'
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      sku: 'Nox11S',
      categories: ['All', 'New Arrival', 'Nox Collection - SS1.0', 'Tshirt']
    },
  };

  // BACKEND INTEGRATION: This useEffect will fetch product data from backend
  useEffect(() => {
    // Reset states when product changes
    setSelectedSize('');
    setQuantity(1);
    
    // For mock data, just set the product directly
    setCurrentProduct(mockProductDetails['ashura-t-shirt-preorder']);
    setLoading(false);
    
    // BACKEND CODE: Replace the above with this fetch code when connecting to backend
    /*
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Make API call to get product by slug
        const response = await fetch(`/api/products/${slug}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json();
        setCurrentProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    */
  }, [slug]); // Re-run when slug changes

  // Show loading state
  if (loading) {
    return <div className="min-h-[600px] bg-black text-white flex items-center justify-center">Loading product...</div>;
  }

  // Show error state
  if (error) {
    return <div className="min-h-[600px] bg-black text-white flex items-center justify-center">Error: {error}</div>;
  }

  // Show 404 if product not found
  if (!currentProduct) {
    return <div className="min-h-[600px] bg-black text-white flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-[600px] bg-black text-white">
      <div className="container mx-auto px-4 py-16 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Gallery */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ProductGallery images={currentProduct.images} />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <ProductInfo
              title={currentProduct.title}
              price={currentProduct.price}
              className="text-lg font-semibold"
            />
            <SizeSelector
              sizes={currentProduct.sizes}
              selectedSize={selectedSize}
              onSizeChange={handleSizeChange}
            />
            <QuantitySelector
              quantity={quantity}
              onChange={handleQuantityChange}
            />
            <ProductActions
              product={currentProduct}
              selectedSize={selectedSize}
              addedToCart={addedToCart}
              isFavorite={isFavorite}
              onAddToCart={handleAddToCart}
              onToggleFavorite={toggleFavorite}
            />
            <ProductTabs product={currentProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;