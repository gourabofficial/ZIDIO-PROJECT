import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiShoppingBag, FiMinus, FiPlus, FiArrowLeft, FiCheck } from 'react-icons/fi';

// Using the same mock data from your original component
const mockProductDetails = {
  'ashura-t-shirt-preorder': {
    id: 1,
    title: 'Ashura T-shirt (Preorder)',
    price: 1749.00,
    compareAtPrice: null,
    description: `Dispatch begins on April 12th.
- 240 GSM Cotton Fabric
- Ombre Washed Fabric
- Embroidery at the Front
- Screen printed`,
    careInstructions: `Wash & Care:
- Hand Wash in cold water
- Use mild detergent
- Do not Iron directly or Scrub on print
- Do not bleach or tumble dry`,
    origin: 'India',
    manufacturer: 'Trigram Clothing Private Limited, C-3 basement Panchsheel Vihar, New Delhi-110017',
    images: [
      'https://ext.same-assets.com/1329671863/2325432086.jpeg',
      'https://ext.same-assets.com/1329671863/769031796.jpeg',
      'https://ext.same-assets.com/1881412388/4177231920.jpeg',
      'https://ext.same-assets.com/1881412388/2575181993.jpeg',
      'https://ext.same-assets.com/1881412388/3668537975.jpeg'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    sizeChart: {
      'S': { chest: '47', length: '26', sleeve: '7.5', shoulder: '23.5' },
      'M': { chest: '49', length: '27', sleeve: '8', shoulder: '24.5' },
      'L': { chest: '51', length: '28', sleeve: '8.5', shoulder: '25.5' },
      'XL': { chest: '53', length: '29', sleeve: '9', shoulder: '26.5' },
      '2XL': { chest: '55', length: '30', sleeve: '9.5', shoulder: '27.5' },
    },
    sku: 'Nox11S',
    categories: ['All', 'New Arrival', 'Nox Collection - SS1.0', 'Tshirt']
  }
};

const ProductDetails = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    // Simulate loading product data
    setIsLoading(true);
    setTimeout(() => {
      // Use the mock data or fallback to default
      const productData = mockProductDetails[handle] || mockProductDetails['ashura-t-shirt-preorder'];
      setProduct(productData);
      setIsLoading(false);
    }, 500);
  }, [handle]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
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
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#334155] border-t-[#c4b5fd] animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-[#0f172a] rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="bg-[#1e293b] p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-[#c4b5fd]">Product Not Found</h1>
          <p className="mt-2 text-[#cbd5e1]">This product is no longer available or may have been moved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="mb-6">
        <a href="javascript:history.back()" className="inline-flex items-center text-[#cbd5e1] hover:text-[#c4b5fd] transition-colors">
          <FiArrowLeft className="mr-2" />
          <span>Back to Collection</span>
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-w-1 aspect-h-1 bg-[#1e293b] rounded-lg overflow-hidden cosmic-shadow">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'ring-2 ring-[#c4b5fd]' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={image} alt={`${product.title} - ${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{product.title}</h1>
          <p className="text-xl mb-4 text-[#c4b5fd] font-medium">Rs. {product.price.toFixed(2)}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-[#cbd5e1]">Size</p>
              {selectedSize && <p className="text-sm text-[#c4b5fd]">Selected: {selectedSize}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`w-14 h-10 flex items-center justify-center rounded transition-all duration-200 ${
                    selectedSize === size 
                      ? 'bg-[#c4b5fd] text-[#0f172a] font-medium' 
                      : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && <p className="text-xs text-[#c4b5fd] mt-2">Please select a size</p>}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="font-medium mb-2 text-[#cbd5e1]">Quantity</p>
            <div className="flex items-center">
              <button
                className="w-10 h-10 flex items-center justify-center bg-[#1e293b] text-white rounded-l-md hover:bg-[#334155] transition-colors"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <FiMinus size={16} />
              </button>
              <div className="w-14 h-10 flex items-center justify-center bg-[#1e293b] text-white">
                {quantity}
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center bg-[#1e293b] text-white rounded-r-md hover:bg-[#334155] transition-colors"
                onClick={increaseQuantity}
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize || addedToCart}
              className={`py-3 px-6 rounded-md w-full font-medium transition-all duration-300 flex items-center justify-center ${
                addedToCart 
                  ? 'bg-green-500 text-white'
                  : selectedSize 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30' 
                    : 'bg-slate-700 text-slate-300 cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <>
                  <FiCheck size={18} className="mr-2" />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <FiShoppingBag size={18} className="mr-2" />
                  ADD TO CART
                </>
              )}
            </button>
            
            <button 
              disabled={!selectedSize}
              className="py-3 px-6 bg-[#1e293b] text-white w-full rounded-md font-medium hover:bg-[#334155] transition-colors flex items-center justify-center disabled:bg-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed"
            >
              <FiShoppingCart size={18} className="mr-2" />
              BUY IT NOW
            </button>
            
            <button
              className="flex items-center justify-center space-x-2 py-3 text-[#cbd5e1] hover:text-[#c4b5fd] transition-colors"
              onClick={toggleFavorite}
            >
              <FiHeart className={isFavorite ? "fill-[#c4b5fd] text-[#c4b5fd]" : ""} size={18} />
              <span>{isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Product Information Tabs */}
          <div className="border-b border-[#334155]">
            <div className="flex space-x-6">
              <button 
                className={`px-2 py-3 font-medium transition-colors relative ${activeTab === 'description' ? 'text-[#c4b5fd]' : 'text-[#cbd5e1] hover:text-white'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
                {activeTab === 'description' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>}
              </button>
              
              <button 
                className={`px-2 py-3 font-medium transition-colors relative ${activeTab === 'care' ? 'text-[#c4b5fd]' : 'text-[#cbd5e1] hover:text-white'}`}
                onClick={() => setActiveTab('care')}
              >
                Care Instructions
                {activeTab === 'care' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>}
              </button>
              
              <button 
                className={`px-2 py-3 font-medium transition-colors relative ${activeTab === 'sizing' ? 'text-[#c4b5fd]' : 'text-[#cbd5e1] hover:text-white'}`}
                onClick={() => setActiveTab('sizing')}
              >
                Size Chart
                {activeTab === 'sizing' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>}
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="text-[#cbd5e1] space-y-4">
                <div className="whitespace-pre-line">
                  {product.description}
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#334155]">
                  <p className="font-medium mb-2 text-white">Country of Origin:</p>
                  <p>{product.origin}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#334155]">
                  <p className="font-medium mb-2 text-white">Manufactured by:</p>
                  <p>{product.manufacturer}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'care' && (
              <div className="text-[#cbd5e1]">
                <div className="whitespace-pre-line">
                  {product.careInstructions}
                </div>
              </div>
            )}
            
            {activeTab === 'sizing' && (
              <div className="overflow-x-auto">
                <table className="w-full text-[#cbd5e1] text-sm">
                  <thead className="bg-[#1e293b] text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Size</th>
                      <th className="px-4 py-3 text-left">Chest (inches)</th>
                      <th className="px-4 py-3 text-left">Length (inches)</th>
                      <th className="px-4 py-3 text-left">Sleeve (inches)</th>
                      <th className="px-4 py-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {Object.entries(product.sizeChart).map(([size, measurements]) => (
                      <tr key={size}>
                        <td className="px-4 py-3 font-medium text-white">{size}</td>
                        <td className="px-4 py-3">{measurements.chest}"</td>
                        <td className="px-4 py-3">{measurements.length}"</td>
                        <td className="px-4 py-3">{measurements.sleeve}"</td>
                        <td className="px-4 py-3">{measurements.shoulder}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;