import React, { useState } from 'react'
import ProductGallery from '../../components/productDetails/ProductGalery'
import ProductInfo from '../../components/productDetails/ProductInfo';
import SizeSelector from '../../components/productDetails/SizeSelector';
import QuantitySelector from '../../components/productDetails/QuantitySelector';
import ProductActions from '../../components/productDetails/ProductAction';
import ProductTabs from '../../components/productDetails/ProductTabs';
 

const Product = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSizeChange = (size) => setSelectedSize(size);
  const handleQuantityChange = (newQuantity) => setQuantity(newQuantity);
  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  const toggleFavorite = () => setIsFavorite(!isFavorite);

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
  };

  const currentProduct = mockProductDetails['ashura-t-shirt-preorder'];

  return (
    <div className="min-h-[calc(100vh-300px)] bg-black text-white"> {/* Adjust height as needed */}
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