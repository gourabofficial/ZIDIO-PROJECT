// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import ProductGallery from '../components/productDetails/ProductGalery';
// import ProductInfo from '../components/productDetails/ProductInfo';
// import ProductActions from '../components/productDetails/ProductAction';
// import ProductTabs from '../components/productDetails/ProductTabs';
// import { useCart } from '../context/CartContext';

// const ProductDetail = () => {
//   const { handle } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const { addToCart } = useCart();
  
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         // Mock API call - replace with actual API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Mock product data
//         const mockProduct = {
//           id: 'product-1',
//           handle: 'cosmic-guardian-helmet',
//           title: 'Cosmic Guardian Helmet',
//           price: 1299.99,
//           description: 'The Cosmic Guardian Helmet offers unparalleled protection and style. Crafted with advanced materials, it features a sleek design with integrated communication systems, enhanced visibility, and impact resistance. Perfect for cosmic adventurers.',
//           images: [
//             'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=800',
//             'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=500',
//             'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=300'
//           ],
//           sizes: ['S', 'M', 'L', 'XL'],
//           sizeChart: {
//             'S': { chest: 38, length: 28, sleeve: 24, shoulder: 17 },
//             'M': { chest: 40, length: 29, sleeve: 25, shoulder: 18 },
//             'L': { chest: 42, length: 30, sleeve: 26, shoulder: 19 },
//             'XL': { chest: 44, length: 31, sleeve: 27, shoulder: 20 }
//           },
//           careInstructions: 'Hand wash only. Do not bleach. Do not iron. Do not dry clean.',
//           origin: 'Made in India',
//           manufacturer: 'Cosmic Clothing Co. Ltd.'
//         };
        
//         setProduct(mockProduct);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchProduct();
//   }, [handle]);
  
//   const handleSizeSelect = (size) => {
//     setSelectedSize(size);
//     setAddedToCart(false);
//   };
  
//   const handleAddToCart = async () => {
//     if (!selectedSize || addedToCart) return;
    
//     const productToAdd = {
//       id: product.id,
//       title: product.title,
//       price: product.price,
//       image: product.images[0],
//       size: selectedSize
//     };
    
//     const result = await addToCart(productToAdd);
    
//     if (result.success) {
//       setAddedToCart(true);
//       setTimeout(() => setAddedToCart(false), 3000);
//     }
//   };
  
//   const handleToggleFavorite = () => {
//     setIsFavorite(!isFavorite);
//   };
  
//   if (loading) {
//     return (
//       <div className="container mx-auto py-16 px-4">
//         <div className="flex justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//         </div>
//       </div>
//     );
//   }
  
//   if (!product) {
//     return (
//       <div className="container mx-auto py-16 px-4">
//         <div className="text-center text-white">
//           <h2 className="text-2xl font-bold">Product not found</h2>
//           <p className="mt-4 text-[#cbd5e1]">The product you're looking for doesn't exist or has been removed.</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Product Gallery */}
//         <div>
//           <ProductGallery images={product.images} />
//         </div>
        
//         {/* Product Info and Actions */}
//         <div>
//           <ProductInfo title={product.title} price={product.price} />
          
//           {/* Size selector */}
//           <div className="mb-6">
//             <h3 className="text-white font-medium mb-3">Select Size</h3>
//             <div className="flex space-x-3">
//               {product.sizes.map(size => (
//                 <button
//                   key={size}
//                   onClick={() => handleSizeSelect(size)}
//                   className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
//                     selectedSize === size
//                       ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
//                       : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//             {!selectedSize && (
//               <p className="text-red-400 text-sm mt-2">Please select a size</p>
//             )}
//           </div>
          
//           {/* Product Actions */}
//           <ProductActions
//             product={product}
//             selectedSize={selectedSize}
//             addedToCart={addedToCart}
//             isFavorite={isFavorite}
//             onAddToCart={handleAddToCart}
//             onToggleFavorite={handleToggleFavorite}
//           />
          
//           {/* Product Tabs */}
//           <div className="mt-8">
//             <ProductTabs product={product} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;