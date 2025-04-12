
import { Link } from 'react-router-dom';

const ProductList = ({ products }) => {
  return (
    <div className="flex flex-col space-y-6">
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="opacity-0" 
          style={{
            animation: 'fadeIn 0.5s forwards',
            animationDelay: `${index * 0.1}s`
          }}
        >
          <div className="flex bg-[#1e293b] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-1/3">
              <div className="aspect-w-1 aspect-h-1 h-full">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{product.title}</h3>
                <div className="flex items-center mb-4">
                  <span className="text-[#c4b5fd] font-medium mr-2">Rs. {product.price.toFixed(2)}</span>
                  {product.compareAtPrice && (
                    <>
                      <span className="line-through text-[#94a3b8] text-sm">Rs. {product.compareAtPrice.toFixed(2)}</span>
                      <span className="ml-2 text-xs bg-[#c4b5fd] text-[#0f172a] px-2 py-0.5 rounded-full font-medium">
                        {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/products/${product.handle}`} className="btn btn-secondary flex-1 py-2">View Details</Link>
                <button className="btn btn-primary flex-1 py-2">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;