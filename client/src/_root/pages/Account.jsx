import React, { useEffect } from 'react';
import { FiMail, FiPhone, FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiShield, FiShoppingCart } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthdata } from '../../context/AuthContext';
import { useClerk } from '@clerk/clerk-react';
import MiniLoader from '../../components/Loader/MiniLoader';
import { motion } from 'framer-motion';

const Account = () => {
  const { currentUser, isAuth, isLoaded } = useAuthdata();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have updated user data from navigation state
  const updatedUserData = location.state?.updatedUser;
  
  // Use updated data from navigation if available, otherwise use context
  const displayUser = updatedUserData || currentUser;
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] flex items-center justify-center">
        <div className="text-white"><MiniLoader /></div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] p-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md bg-[#13141f]/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-xl"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your account details</p>
          <Link 
            to="/sign-in" 
            className="px-8 py-3 bg-black border border-gray-700/50 rounded-md text-white font-medium transition-all hover:bg-[#111] hover:border-gray-600/70 inline-block"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  // Extract user details from displayUser instead of currentUser
  const fullName = displayUser?.fullName || 'User Name';
  const email = displayUser?.email || '';
  const phone = displayUser?.phone || 'Not provided';
  const imageUrl = displayUser?.avatar || 'https://img.freepik.com/premium-vector/influencer-icon-vector-image-can-be-used-digital-nomad_120816-263441.jpg?ga=GA1.1.987127041.1747852951&semt=ais_hybrid&w=740';

  // Updated sign out handler
  const handleSignOut = async () => {
    try {
      await signOut();
      // After signing out with Clerk, redirect to home or login page
      navigate('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const AccountItem = ({ icon: Icon, title, description, to, onClick, target, rel }) => (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="overflow-hidden"
    >
      {to ? (
        <Link 
          to={to}
          className="bg-[#13141f] rounded-xl p-5 text-white hover:bg-[#1a1b29] transition-all duration-300 flex flex-col h-full border border-purple-500/10 hover:border-purple-500/30 shadow-sm hover:shadow-md relative group "
          target={target}
          rel={rel}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex items-start">
            <div className="p-2.5 rounded-lg bg-[#1e293b] mr-3">
              <Icon className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
        </Link>
      ) : (
        <button 
          onClick={onClick}
          className="bg-[#13141f] rounded-xl p-5 text-white hover:bg-[#1a1b29] transition-all duration-300 flex flex-col h-full border border-purple-500/10 hover:border-purple-500/30 shadow-sm hover:shadow-md relative group w-full text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="flex items-start">
            <div className="p-2.5 rounded-lg bg-[#1e293b] mr-3">
              <Icon className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-8"
        >
          My Account
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl p-8 mb-8 shadow-lg border border-purple-500/20"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile image with glowing effect */}
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-300"></div>
              <img
                src={imageUrl}
                alt={fullName}
                className="relative w-28 h-28 rounded-full border-2 border-purple-500/30 object-cover bg-[#1e293b]"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            
            {/* User details */}
            <div className="flex-grow space-y-5 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{fullName}</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                  <FiUser className="text-purple-400" />
                  <span className="opacity-80">Account ID: <span className="font-mono tracking-wider">{displayUser.id.substring(0, 8)}...</span></span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                  <FiMail className="text-purple-400" />
                  <span>{email}</span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                  <FiPhone className="text-purple-400" />
                  <span>{phone}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Account actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Admin Dashboard - Only visible to admins */}
          {displayUser && displayUser.role === 'admin' && (
            <AccountItem
              icon={FiShield}
              title="Admin Dashboard" 
              description="Manage the store and products"
              to="/admin"
              target="_blank"
              rel="noopener noreferrer"
            />
          )}
          
          <AccountItem
            icon={FiShoppingBag}
            title="My Orders" 
            description="View your order history and status"
            to="/orders"
          />
          
          <AccountItem
            icon={FiHeart}
            title="My Wishlist" 
            description="Products you've saved for later"
            to="/wishlist"
          />
          
          {/* New Cart Item */}
          <AccountItem
            icon={FiShoppingCart}
            title="My Cart" 
            description="View and manage your shopping cart"
            to="/cart"
          />
          
          <AccountItem
            icon={FiSettings}
            title="Account Settings" 
            description="Update your profile and preferences"
            to="/account-settings"
          />
          
          <AccountItem
            icon={FiLogOut}
            title="Sign Out" 
            description="Log out of your account securely"
            onClick={handleSignOut}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Account;