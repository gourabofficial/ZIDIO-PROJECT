import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiSend, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 starry-bg opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3">Stay Connected with the Cosmos</h3>
            <p className="text-[#cbd5e1]">
              Sign up for our newsletter to receive updates about new collections and exclusive offers
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-[#1e293b] border border-[#334155] text-white rounded-md px-4 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-[#c4b5fd] focus:border-transparent"
            />
            <button className="btn btn-primary whitespace-nowrap">
              Subscribe
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* About & Social */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4 text-[#c4b5fd]">COSMICWEAR</h3>
            <p className="text-[#cbd5e1] mb-6">
              Premium streetwear inspired by the universe. For the bold, the fearless, and those who dare to stand out.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100064126330477"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e293b] hover:bg-[#334155] transition-colors cosmic-shadow"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/sagacityofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e293b] hover:bg-[#334155] transition-colors cosmic-shadow"
              >
                <FiInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4 text-[#c4b5fd]">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/pages/about-us" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pages/contact-us" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://forms.zohopublic.in/trigramclothingpvtltd/form/JobApplication/formperma/9ywn1ovgAwysKEXitXXHCjggvHB19xJ1lO3XihBScQc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cbd5e1] hover:text-white transition-colors inline-block"
                >
                  Careers
                </a>
              </li>
              <li>
                <Link to="/track-order" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-4 text-[#c4b5fd]">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/pages/terms-conditions" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/pages/privacy-policy" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/pages/return-exchange-policy" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  Return & Exchange Policy
                </Link>
              </li>
              <li>
                <Link to="/pages/shipping-policy" className="text-[#cbd5e1] hover:text-white transition-colors inline-block">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#334155] to-transparent"></div>
        
        {/* Copyright */}
        <div className="pt-8 text-center text-sm text-[#94a3b8]">
          <p>© {new Date().getFullYear()} SAGACITY TRIGRAM CLOTHING PVT LTD. All Rights Reserved.</p>
          <p className="mt-2">Designed and developed with cosmic inspiration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;