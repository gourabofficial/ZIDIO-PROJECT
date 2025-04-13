import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#0c0e16] text-white py-12 relative overflow-hidden text-sm">
      {/* Starry background */}
      <div className="absolute inset-0 starry-bg opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-lg md:text-xl font-semibold mb-2">Stay Connected</h3>
          <p className="text-[#cbd5e1] mb-4">Get updates on new drops and exclusive offers</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="bg-[#1e293b] border border-[#334155] text-white px-4 py-2 rounded-md w-full sm:w-auto flex-grow focus:outline-none"
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-md">
              Subscribe <FiArrowRight />
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 text-center">
  {/* About */}
  <div className="flex flex-col items-center">
    <h4 className="text-base font-semibold text-[#c4b5fd] mb-3">COSMICWEAR</h4>
    <p className="text-[#cbd5e1] text-sm mb-4 max-w-xs">
      Streetwear inspired by the universe. For the bold and fearless.
    </p>
    <div className="flex justify-center space-x-3">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1e293b] hover:bg-[#334155] p-2 rounded-full transition"
      >
        <FiFacebook size={16} />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1e293b] hover:bg-[#334155] p-2 rounded-full transition"
      >
        <FiInstagram size={16} />
      </a>
    </div>
  </div>

  {/* Info Links */}
  <div className="flex flex-col items-center">
    <h4 className="text-base font-semibold text-[#c4b5fd] mb-3">Info</h4>
    <ul className="space-y-2">
      <li><Link to="/pages/about-us" className="hover:text-white text-[#cbd5e1]">About Us</Link></li>
      <li><Link to="/pages/contact-us" className="hover:text-white text-[#cbd5e1]">Contact</Link></li>
      <li><Link to="/track-order" className="hover:text-white text-[#cbd5e1]">Track Order</Link></li>
      <li><Link to="/faq" className="hover:text-white text-[#cbd5e1]">FAQs</Link></li>
    </ul>
  </div>

  {/* Legal Links */}
  <div className="flex flex-col items-center">
    <h4 className="text-base font-semibold text-[#c4b5fd] mb-3">Legal</h4>
    <ul className="space-y-2">
      <li><Link to="/pages/terms-conditions" className="hover:text-white text-[#cbd5e1]">Terms</Link></li>
      <li><Link to="/pages/privacy-policy" className="hover:text-white text-[#cbd5e1]">Privacy</Link></li>
      <li><Link to="/pages/return-exchange-policy" className="hover:text-white text-[#cbd5e1]">Returns</Link></li>
      <li><Link to="/pages/shipping-policy" className="hover:text-white text-[#cbd5e1]">Shipping</Link></li>
    </ul>
  </div>
</div>


        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#334155] to-transparent"></div>

        {/* Copyright */}
        <div className="pt-6 text-center text-[#94a3b8] text-xs">
          <p>© {new Date().getFullYear()} COSMIC HEROS CLOTHING PVT LTD. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
