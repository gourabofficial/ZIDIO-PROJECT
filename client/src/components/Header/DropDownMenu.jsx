import { Link } from 'react-router-dom';

const DropdownMenu = ({ isOpen, items }) => {
  return (
    <div 
      className={`absolute left-0 mt-2 w-48 bg-[#0c0e16] text-white border border-[rgba(255,255,255,0.1)] shadow-lg z-50 transition-all duration-300 origin-top ${
        isOpen 
          ? 'opacity-100 transform scale-100 translate-y-0' 
          : 'opacity-0 pointer-events-none transform scale-95 -translate-y-2'
      }`}
    >
      {items.map((item, index) => (
        <Link 
          key={index} 
          to={item.path} 
          className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default DropdownMenu;