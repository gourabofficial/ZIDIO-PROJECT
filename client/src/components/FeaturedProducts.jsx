import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { FiArrowRight } from 'react-icons/fi';

// Mock data for featured products (using your original data)
const mockProducts = [
  {
    id: 1,
    handle: 'ashura-t-shirt-preorder',
    title: 'Ashura T-shirt (Preorder)',
    price: 1749.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/1329671863/2325432086.jpeg',
    hoverImage: 'https://ext.same-assets.com/1329671863/769031796.jpeg',
  },
  {
    id: 2,
    handle: 'anti-magic-doc-sleeves-washed-tshirt-preorder',
    title: 'Anti Magic - Doc Sleeves Washed T-shirt (Preorder)',
    price: 1999.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/1329671863/3830187826.jpeg',
    hoverImage: 'https://ext.same-assets.com/1329671863/663859985.jpeg',
  },
  {
    id: 3,
    handle: 'monster-shirt',
    title: 'Monster Shirt',
    price: 2499.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/1329671863/1493282078.jpeg',
    hoverImage: 'https://ext.same-assets.com/1329671863/2964396753.jpeg',
  },
  {
    id: 4,
    handle: 'malevolent-body-waffle-fabric-full-sleeve-t-shirt',
    title: 'Malevolent Body - Waffle Fabric Full Sleeve T-shirt (Preorder)',
    price: 1999.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/1329671863/2020819799.jpeg',
    hoverImage: 'https://ext.same-assets.com/1329671863/3898858674.jpeg',
  },
  {
    id: 5,
    handle: 'malevolent-pants',
    title: 'Malevolent Pants (Preorder)',
    price: 2999.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/3510445368/3676863634.jpeg',
    hoverImage: 'https://ext.same-assets.com/3510445368/3015448849.jpeg',
  },
  {
    id: 6,
    handle: 'alchemy',
    title: 'Alchemy Washed Tshirt (Preorder)',
    price: 1749.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/1881412388/3830187826.jpeg',
    hoverImage: 'https://ext.same-assets.com/1881412388/3830187826.jpeg',
  },
  {
    id: 7,
    handle: 'junji-ito',
    title: 'Junji Ito Heavy Patchworked Washed Tshirt (Preorder)',
    price: 1999.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
    hoverImage: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
  },
  {
    id: 8,
    handle: 'berserk-armor-pants',
    title: 'Berserk Armor Pants (Preorder)',
    price: 3499.00,
    compareAtPrice: null,
    image: 'https://ext.same-assets.com/3510445368/1027479807.jpeg',
    hoverImage: 'https://ext.same-assets.com/3510445368/1027479807.jpeg',
  },
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'tshirt', name: 'T-Shirts' },
  { id: 'bottoms', name: 'Bottoms' },
  { id: 'preorder', name: 'Pre-orders' },
];

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const filteredProducts = activeCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => {
        if (activeCategory === 'preorder') {
          return product.title.toLowerCase().includes('preorder');
        }
        // This is just a simple filter for demo purposes
        // In a real app, you'd have proper category data
        return product.title.toLowerCase().includes(activeCategory.toLowerCase());
      });
  
  return (
    <section className="py-16 cosmic-gradient relative overflow-hidden">
      <div className="absolute inset-0 starry-bg opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 relative inline-block">
            <span className="text-white">NEW ARRIVALS</span>
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
          </h2>
          <p className="text-[#cbd5e1] text-center mt-4 max-w-2xl">
            Discover our latest collection of premium streetwear designed for those who appreciate distinctive style
          </p>
          
          {/* Category filters */}
          <div className="flex flex-wrap justify-center mt-8 mb-4 gap-2 md:gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="opacity-0 transform translate-y-8" style={{animation: 'slideUp 0.6s forwards'}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/collections/all" className="btn btn-secondary group">
            <span>VIEW ALL PRODUCTS</span>
            <FiArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;