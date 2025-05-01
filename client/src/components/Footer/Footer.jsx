import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiSend } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0c0e16] to-[#080a10] text-white pt-4 pb-3 relative overflow-hidden text-sm flex-shrink-0 border-t border-[#1e293b]">
      {/* Starry background */}
      <div className="absolute inset-0 starry-bg opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Two column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          {/* Logo and slogan */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="font-bold text-lg mb-1">COSMIC HEROS</div>
            <p className="text-[#94a3b8] text-xs mb-2">Elevate your style to cosmic dimensions</p>
            
            {/* Social icons */}
            <div className="flex space-x-2 mt-1">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="bg-[#1e293b] hover:bg-indigo-600 p-1.5 rounded-full transition-all transform hover:scale-110">
                <FiFacebook size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="bg-[#1e293b] hover:bg-indigo-600 p-1.5 rounded-full transition-all transform hover:scale-110">
                <FiInstagram size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="bg-[#1e293b] hover:bg-indigo-600 p-1.5 rounded-full transition-all transform hover:scale-110">
                <FiTwitter size={14} />
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="flex flex-col items-center sm:items-end">
            <h4 className="font-medium text-sm mb-1">Join our universe</h4>
            <p className="text-[#94a3b8] text-xs mb-2 text-center sm:text-right">Get updates on new launches and exclusive offers</p>
            <div className="flex w-full max-w-xs">
              <input
                type="email"
                placeholder="Your email"
                className="bg-[#1e293b] border-y border-l border-[#334155] text-white px-3 py-1.5 text-xs rounded-l-md w-full focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button className="flex items-center justify-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-r-md">
                <FiSend size={14} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Links - Simple horizontal layout */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 py-2 border-t border-b border-[#1e293b] my-2">
          <Link to="/pages/about-us" className="hover:text-indigo-400 text-[#cbd5e1] text-xs transition-colors">About</Link>
          <Link to="/pages/contact-us" className="hover:text-indigo-400 text-[#cbd5e1] text-xs transition-colors">Contact</Link>
          <Link to="/track-order" className="hover:text-indigo-400 text-[#cbd5e1] text-xs transition-colors">Track Order</Link>
          <Link to="/pages/terms-conditions" className="hover:text-indigo-400 text-[#cbd5e1] text-xs transition-colors">Terms</Link>
          <Link to="/pages/privacy-policy" className="hover:text-indigo-400 text-[#cbd5e1] text-xs transition-colors">Privacy</Link>
          <Link to="/pages/return-exchange-policy" className="hover:text-indigo-400 text-[#cbd5e1] text-xs transition-colors">Returns</Link>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-[#94a3b8] text-xs pt-1">
          <p>© {new Date().getFullYear()} COSMIC HEROS CLOTHING PVT LTD</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;