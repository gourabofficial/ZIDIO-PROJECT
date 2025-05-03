import React from 'react';
import { FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthdata } from '../../context/AuthContext';
import { useClerk } from '@clerk/clerk-react';
import MiniLoader from '../../components/Loader/MiniLoader';

const Account = () => {
  const { currentUser, isAuth, isLoaded } = useAuthdata();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have updated user data from navigation state
  const updatedUserData = location.state?.updatedUser;
  
  // Use updated data from navigation if available, otherwise use context
  const displayUser = updatedUserData || currentUser;
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center">
        <p className="text-white"><MiniLoader /></p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0e16] p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your account details</p>
          <Link 
            to="/sign-in" 
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Extract user details from displayUser instead of currentUser
  const fullName = displayUser?.fullName || 'User Name';
  const email = displayUser?.email || '';
  const phone = '629400000';
  const imageUrl = displayUser?.avatar;

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

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
        
        <div className="bg-[#1e293b] rounded-xl p-6 mb-8 shadow-lg">
          {/* Profile Card Header */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile image */}
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={fullName}
                className="w-24 h-24 rounded-full border-4 border-purple-500/30 object-cover"
              />
            </div>
            
            {/* User details */}
            <div className="flex-grow space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                  <FiUser className="text-purple-400" />
                  <span>Account ID: {displayUser.id.substring(0, 8)}...</span>
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
        </div>
        
        {/* Account actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Admin Dashboard - Only visible to admins */}
          {displayUser && displayUser.role === 'admin' && (
            <Link 
              to="/admin"
              className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="font-medium mb-1">Admin Dashboard</h3>
              <p className="text-sm text-gray-400">Manage the store</p>
            </Link>
          )}
          
          <Link to="/orders" className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors">
            <h3 className="font-medium mb-1">My Orders</h3>
            <p className="text-sm text-gray-400">View your order history</p>
          </Link>
          
          <Link to="/wishlist" className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors">
            <h3 className="font-medium mb-1">My Wishlist</h3>
            <p className="text-sm text-gray-400">View items you've saved</p>
          </Link>
          
          <Link 
            to="/account-settings"
            className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors"
          >
            <h3 className="font-medium mb-1">Account Settings</h3>
            <p className="text-sm text-gray-400">Manage your account details</p>
          </Link>
          
          <button 
            className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors text-left"
            onClick={handleSignOut}
          >
            <h3 className="font-medium mb-1">Sign Out</h3>
            <p className="text-sm text-gray-400">Log out of your account</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;