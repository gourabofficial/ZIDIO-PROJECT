// // All products as a flat array (your original structure)
// export const mockProducts = [
//   {
//     id: 1,
//     handle: 'ashura-t-shirt-preorder',
//     title: 'Ashura T-shirt (Preorder)',
//     price: 1749.00,
//     compareAtPrice: 2199.00,
//     image: 'https://ext.same-assets.com/1329671863/2325432086.jpeg',
//     hoverImage: 'https://ext.same-assets.com/1329671863/769031796.jpeg',
//   },
//   {
//     id: 2,
//     handle: 'anti-magic-doc-sleeves-washed-tshirt-preorder',
//     title: 'Anti Magic - Doc Sleeves Washed T-shirt (Preorder)',
//     price: 1999.00,
//     compareAtPrice: null,
//     image: 'https://ext.same-assets.com/1329671863/3830187826.jpeg',
//     hoverImage: 'https://ext.same-assets.com/1329671863/663859985.jpeg',
//   },
//   {
//     id: 3,
//     handle: 'monster-shirt',
//     title: 'Monster Shirt',
//     price: 2499.00,
//     compareAtPrice: null,
//     image: 'https://ext.same-assets.com/1329671863/1493282078.jpeg',
//     hoverImage: 'https://ext.same-assets.com/1329671863/2964396753.jpeg',
//   },
//   {
//     id: 4,
//     handle: 'malevolent-body-waffle-fabric-full-sleeve-t-shirt',
//     title: 'Malevolent Body - Waffle Fabric Full Sleeve T-shirt (Preorder)',
//     price: 1999.00,
//     compareAtPrice: null,
//     image: 'https://ext.same-assets.com/1329671863/2020819799.jpeg',
//     hoverImage: 'https://ext.same-assets.com/1329671863/3898858674.jpeg',
//   },
//   {
//     id: 5,
//     handle: 'malevolent-pants',
//     title: 'Malevolent Pants (Preorder)',
//     price: 2999.00,
//     compareAtPrice: null,
//     image: 'https://ext.same-assets.com/3510445368/3676863634.jpeg',
//     hoverImage: 'https://ext.same-assets.com/3510445368/3015448849.jpeg',
//   },
//   {
//     id: 6,
//     handle: 'alchemy',
//     title: 'Alchemy Washed Tshirt (Preorder)',
//     price: 1749.00,
//     compareAtPrice: null,
//     image: 'https://veirdo.in/cdn/shop/files/6_4.jpg?v=1721718417&width=720',
//     hoverImage: 'https://veirdo.in/cdn/shop/files/6_4.jpg?v=1721718417&width=720',
//   },
//   {
//     id: 7,
//     handle: 'junji-ito',
//     title: 'Junji Ito Heavy Patchworked Washed Tshirt (Preorder)',
//     price: 1999.00,
//     compareAtPrice: null,
//     image: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
//     hoverImage: 'https://ext.same-assets.com/3510445368/3690180630.jpeg',
//   },
//   {
//     id: 8,
//     handle: 'berserk-armor-pants',
//     title: 'Berserk Armor Pants (Preorder)',
//     price: 3499.00,
//     compareAtPrice: null,
//     image: 'https://ext.same-assets.com/3510445368/1027479807.jpeg',
//     hoverImage: 'https://ext.same-assets.com/3510445368/1027479807.jpeg',
//   },
// ];

// // Categories (your original structure)
// export const categories = [
//   { id: 'all', name: 'All' },
//   { id: 'tshirt', name: 'T-Shirts' },
//   { id: 'bottoms', name: 'Bottoms' },
//   { id: 'preorder', name: 'Pre-orders' },
// ];

// // Collection titles
// export const collectionTitles = {
//   'all': 'All Products',
//   'tshirt': 'T-Shirts',
//   'bottoms': 'Bottoms',
//   'preorder': 'Pre-orders',
//   'sweatshirt': 'Sweatshirts',
//   'hoodies': 'Hoodies',
//   'co-ord-set': 'Co-ord Sets',
//   'sleeveless-vest': 'Sleeveless Vests',
//   'nox-collection-ss1-0': 'NOX SS1.0 Collection',
//   'yuki-collection': 'YUKI Collection',
//   'takeover-collection-summer-phase-ii': 'Takeover Summer Phase II',
//   'winter-2023-collection': 'Winter 2023 Collection',
//   'summer-collection-phase-i-1': 'Summer Collection Phase I'
// };

// // Create collections dynamically from the flat array
// export const mockCollectionProducts = {
//   'all': mockProducts,
//   'tshirt': mockProducts.filter(product => 
//     product.title.toLowerCase().includes('t-shirt') || 
//     product.title.toLowerCase().includes('tshirt')
//   ),
//   'bottoms': mockProducts.filter(product => 
//     product.title.toLowerCase().includes('pants') || 
//     product.title.toLowerCase().includes('bottoms')
//   ),
//   'preorder': mockProducts.filter(product => 
//     product.title.toLowerCase().includes('preorder')
//   ),
//   'nox-collection-ss1-0': mockProducts.filter((_, index) => index < 4) // Example for collection
// };