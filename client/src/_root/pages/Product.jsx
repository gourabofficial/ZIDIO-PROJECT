import React, { useState } from 'react'
import ProductGallery from '../../components/productDetails/ProductGalery'
import ProductInfo from '../../components/productDetails/ProductInfo';
import SizeSelector from '../../components/productDetails/SizeSelector';
import QuantitySelector from '../../components/productDetails/QuantitySelector';
import ProductActions from '../../components/productDetails/ProductAction';
import ProductTabs from '../../components/productDetails/ProductTabs';

const Product = () => {
  // State variables
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handler functions
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

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

    'pink-crop-top': {
      id: 2,
      title: 'Pink Crop Top',
      price: 899.00,
      description: 'A stylish pink crop top, perfect for summer wear.',
      careInstructions: 'Hand wash only.',
      origin: 'India',
      manufacturer: 'Fashion India Pvt Ltd',
      images: [
        'https://example.com/pink-top1.jpg',
        'https://example.com/pink-top2.jpg'
      ],
      sizes: ['S', 'M', 'L'],
      sizeChart: {
        'S': { chest: '34', length: '16' },
        'M': { chest: '36', length: '17' },
        'L': { chest: '38', length: '18' }
      },
      sku: 'Top02',
      categories: ['All', 'Crop Tops', 'New Arrival']
    },

    'black-basic-tee': {
      id: 3,
      title: 'Black Basic Tee',
      price: 599.00,
      description: 'A minimal black t-shirt for everyday use.',
      careInstructions: 'Machine washable.',
      origin: 'India',
      manufacturer: 'Basic Wear Ltd.',
      images: [
        'https://example.com/black-tee1.jpg',
        'https://example.com/black-tee2.jpg'
      ],
      sizes: ['M', 'L', 'XL'],
      sizeChart: {
        'M': { chest: '40', length: '27' },
        'L': { chest: '42', length: '28' },
        'XL': { chest: '44', length: '29' }
      },
      sku: 'Btee01',
      categories: ['All', 'Essentials', 'Tshirt']
    }
  };

  // Select a specific product to display
  const currentProduct = mockProductDetails['ashura-t-shirt-preorder'];

  return (
    <>
      <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-120px)] mt-20">
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
            <ProductTabs product={currentProduct} className="text-sm" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Product