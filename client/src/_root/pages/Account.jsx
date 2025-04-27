import React, { useState } from 'react';
import { FiMail, FiPhone, FiUser, FiEdit } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthdata } from '../../context/AuthContext';
import { useClerk } from '@clerk/clerk-react';

const Account = () => {
  const { currentUser, isAuth, isLoaded } = useAuthdata();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  // New states for edit profile
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    avatar: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center">
        <p className="text-white">Loading...</p>
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

  // Extract user details from currentUser
  const fullName = currentUser?.fullName || 'User Name';
  const email = currentUser?.email || '';
  const phone = '629400000'; // You may need to add this field to your user object
  const imageUrl = currentUser?.avatar ;

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

  // Initialize edit form with current values
  const handleEditClick = () => {
    setEditForm({
      fullName: fullName || '',
      phone: phone || '',
      avatar: imageUrl || ''
    });
    setIsEditing(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Submit profile updates
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      // This would need to be implemented in your auth context
      // await updateUserProfile(editForm);
      console.log("Profile update data:", editForm);
      
      // For now, just log the data and close the edit mode
      setIsEditing(false);
      
      // Show success message or update the UI directly
      // This is just a placeholder - you would update with actual API response
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
        
        <div className="bg-[#1e293b] rounded-xl p-6 mb-8 shadow-lg">
          {/* Profile Card Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
              >
                <FiEdit size={16} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm bg-gray-700 rounded-md text-white hover:bg-gray-600"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-3 py-1 text-sm bg-purple-600 rounded-md text-white hover:bg-purple-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile image */}
            <div className="flex-shrink-0">
              {isEditing ? (
                <div className="space-y-2">
                  <img
                    src={editForm.avatar || imageUrl}
                    alt={fullName}
                    className="w-24 h-24 rounded-full border-4 border-purple-500/30 object-cover mb-2"
                  />
                  <input
                    type="text"
                    name="avatar"
                    value={editForm.avatar}
                    onChange={handleInputChange}
                    placeholder="Avatar URL"
                    className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-3 py-1 text-white text-sm"
                  />
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-full border-4 border-purple-500/30 object-cover"
                />
              )}
            </div>
            
            {/* User details */}
            <div className="flex-grow space-y-4 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white">{fullName}</h2>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
                      <FiUser className="text-purple-400" />
                      <span>Account ID: {currentUser.id.substring(0, 8)}...</span>
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
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Account actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/orders" className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors">
            <h3 className="font-medium mb-1">My Orders</h3>
            <p className="text-sm text-gray-400">View your order history</p>
          </Link>
          
          <Link to="/wishlist" className="bg-[#1e293b] rounded-lg p-4 text-white hover:bg-[#2d3748] transition-colors">
            <h3 className="font-medium mb-1">My Wishlist</h3>
            <p className="text-sm text-gray-400">View items you've saved</p>
          </Link>
          
          <Link 
            to="/settings"
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