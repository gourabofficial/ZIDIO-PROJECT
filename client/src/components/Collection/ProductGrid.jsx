import ProductCard from '../ProductCard/ProductCard';

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="opacity-0" 
          style={{
            animation: 'fadeIn 0.5s forwards',
            animationDelay: `${index * 0.1}s`
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;