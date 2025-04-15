import React from 'react'
import ProductCard from '../../components/ProductCard/ProductCard';
import { useParams } from 'react-router-dom';

const Collection = () => {
  // Get category id from URL params
  const { id } = useParams();

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      handle: 'ashura-t-shirt-preorder',
      title: 'Ashura T-shirt (Preorder)',
      price: 1749.00,
      compareAtPrice: 2199.00,
      image: 'https://ext.same-assets.com/1329671863/2325432086.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/769031796.jpeg',
      category: 'tshirts'
    },
    {
      id: 2,
      handle: 'anti-magic-doc-sleeves-washed-tshirt-preorder',
      title: 'Anti Magic - Doc Sleeves Washed T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/3830187826.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/663859985.jpeg',
      category: 'tshirts'
    },
    {
      id: 3,
      handle: 'monster-shirt',
      title: 'Monster Shirt',
      price: 2499.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/1493282078.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/2964396753.jpeg',
      category: 'tshirts'
    },
    {
      id: 4,
      handle: 'malevolent-body-waffle-fabric-full-sleeve-t-shirt',
      title: 'Malevolent Body - Waffle Fabric Full Sleeve T-shirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/1329671863/2020819799.jpeg',
      hoverImage: 'https://ext.same-assets.com/1329671863/3898858674.jpeg',
      category: 'tshirts'
    },
    {
      id: 5,
      handle: 'malevolent-pants',
      title: 'Malevolent Pants (Preorder)',
      price: 2999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/3510445368/3676863634.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/3015448849.jpeg',
      category: 'pants'
    },
    {
      id: 6,
      handle: 'alchemy',
      title: 'Alchemy Washed Tshirt (Preorder)',
      price: 1749.00,
      compareAtPrice: null,
      image: 'https://veirdo.in/cdn/shop/files/6_4.jpg?v=1721718417&width=720',
      hoverImage: 'https://veirdo.in/cdn/shop/files/6_4.jpg?v=1721718417&width=720',
      category: 'tshirts'
    },
    {
      id: 7,
      handle: 'junji-ito',
      title: 'Junji Ito Heavy Patchworked Washed Tshirt (Preorder)',
      price: 1999.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
      category: 'tshirts'
    },
    {
      id: 8,
      handle: 'berserk-armor-pants',
      title: 'Berserk Armor Pants (Preorder)',
      price: 3499.00,
      compareAtPrice: null,
      image: 'https://ext.same-assets.com/3510445368/1027479807.jpeg',
      hoverImage: 'https://ext.same-assets.com/3510445368/1027479807.jpeg',
      category: 'pants'
    },
  ];

  console.log('Category ID:', id);

  return (
    <>
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Category header */}
        <h1 className="text-3xl font-bold text-white mb-8">{id}</h1>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Show message if no products found */}
        {mockProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No products found in this category.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Collection