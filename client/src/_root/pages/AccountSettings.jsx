import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthdata } from '../../context/AuthContext';
import { FiUser, FiMapPin, FiEdit, FiPlus, FiTrash2, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { updateUserDetails, updateAddress, addAddress } from '../../Api/user';
import MiniLoader from '../../components/Loader/MiniLoader';

const AccountSettings = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData } = useAuthdata();
  const navigate = useNavigate();
  
  // User profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    avatar: ''  // This will store the selected superhero avatar URL
  });

  // Define the superhero avatars
  const superheroAvatars = [
    "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Iron Man
    "https://images.unsplash.com/photo-1657558045738-21507cf53606?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Captain America
    "https://as2.ftcdn.net/v2/jpg/05/62/12/87/1000_F_562128745_Pt2bgKtkf0L5zbabWDeji6sGoszjFyfL.jpg", // Black Widow
    "https://as2.ftcdn.net/v2/jpg/03/68/87/37/1000_F_368873773_erdZlAfQNMSIiX0n9e8XVHTQ8QButcaN.jpg",// Spider-Man
    "https://as2.ftcdn.net/v2/jpg/04/06/23/13/1000_F_406231350_sPZSAkWgSH3yhgVzfuQ2tyNvWAThCKYv.jpg"//hulk
    
  ];
  
  // Address management states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressInfo: '',
    city: '',
    state: '',
    pinCode: '',
    country: ''
  });
  
  // Initialize user data when component loads
  React.useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);
  
  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center">
        <p className="text-white"><MiniLoader /></p>
      </div>
      
    );
  }

  // Redirect if not authenticated
  if (!isAuth) {
    return (
      <div className=" bg-[#0c0e16] p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your account settings</p>
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

  // Profile form handlers
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle selecting a superhero avatar
  const handleAvatarSelect = (avatarUrl) => {
    setProfileForm(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
  };

  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      fullName: currentUser.fullName || '',
      avatar: currentUser.avatar || ''
    });
    setIsEditingProfile(false);
  };

  const handleUpdateProfile = async () => {
    try {
      // Create FormData for the update
      const formData = new FormData();
      formData.append('fullName', profileForm.fullName);
      
      // Only append avatar if it's different from current
      if (profileForm.avatar !== currentUser.avatar) {
        formData.append('avatar', profileForm.avatar);
      }
      
      const response = await updateUserDetails(formData);
      if (response.success) {
        await refetchUserData();
        setIsEditingProfile(false);
        alert("Profile updated successfully!");
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile");
    }
  };

  // Address form handlers
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditAddressClick = () => {
    // For editing the user's address
    if (currentUser.address) {
      setAddressForm({
        addressInfo: currentUser.address.addressInfo || '',
        city: currentUser.address.city || '',
        state: currentUser.address.state || '',
        pinCode: currentUser.address.pinCode || '',
        country: currentUser.address.country || ''
      });
      setIsEditingAddress(true);
      setIsAddingAddress(false);
    }
  };

  const handleAddAddressClick = () => {
    setAddressForm({
      addressInfo: '',
      city: '',
      state: '',
      pinCode: '',
      country: ''
    });
    setIsAddingAddress(true);
    setIsEditingAddress(false);
  };

  const handleCancelAddressEdit = () => {
    setIsEditingAddress(false);
    setIsAddingAddress(false);
  };

  const handleUpdateAddress = async () => {
    try {
      const response = await updateAddress(addressForm);
      if (response.success) {
        await refetchUserData();
        setIsEditingAddress(false);
        alert("Address updated successfully!");
      } else {
        alert(response.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("An error occurred while updating your address");
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await addAddress(addressForm);
      if (response.success) {
        await refetchUserData();
        setIsAddingAddress(false);
        alert("Address added successfully!");
      } else {
        alert(response.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred while adding your address");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-white mb-6">
          <Link to="/account" className="hover:text-purple-400 transition-colors">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>

        {/* User Profile Information */}
        <div className="bg-[#1e293b] rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <FiUser className="text-purple-400" />
            <span>Profile Information</span>
          </h2>
          
          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileInputChange}
                  className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Select Avatar</label>
                
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {superheroAvatars.map((avatar, index) => (
                    <div 
                      key={index}
                      className={`cursor-pointer rounded-md p-1 transition-all ${
                        profileForm.avatar === avatar ? 'ring-2 ring-purple-500 scale-105' : 'hover:bg-[#2e3446]'
                      }`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <img 
                        src={avatar} 
                        alt={`Superhero avatar ${index+1}`}
                        className="w-16 h-16 rounded-full object-cover mx-auto"
                      />
                    </div>
                  ))}
                </div>
                
                {profileForm.avatar && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Selected Avatar:</p>
                    <img 
                      src={profileForm.avatar} 
                      alt="Selected avatar" 
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80?text=Error';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition-colors text-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelProfileEdit}
                  className="px-4 py-2 bg-gray-700 rounded-md text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-6 mb-6">
                <div className="flex-shrink-0">
                  <img 
                    src={currentUser.avatar || "https://via.placeholder.com/80?text=Avatar"} 
                    alt={currentUser.fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Full Name</p>
                      <p className="text-white">{currentUser.fullName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email Address</p>
                      <p className="text-white">{currentUser.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Account Type</p>
                      <p className="text-white capitalize">{currentUser.role || "User"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleEditProfileClick}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <FiEdit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Address Management */}
        <div className="bg-[#1e293b] rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <FiMapPin className="text-purple-400" />
            <span>Address Management</span>
          </h2>
          
          {isEditingAddress || isAddingAddress ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="addressInfo" className="block text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  id="addressInfo"
                  name="addressInfo"
                  value={addressForm.addressInfo}
                  onChange={handleAddressInputChange}
                  className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressInputChange}
                    className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-300 mb-1">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressInputChange}
                    className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pinCode" className="block text-gray-300 mb-1">Pin Code</label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={addressForm.pinCode}
                    onChange={handleAddressInputChange}
                    className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-gray-300 mb-1">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressInputChange}
                    className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                {isEditingAddress ? (
                  <button
                    onClick={handleUpdateAddress}
                    className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition-colors text-sm"
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 transition-colors text-sm"
                  >
                    Add Address
                  </button>
                )}
                <button
                  onClick={handleCancelAddressEdit}
                  className="px-4 py-2 bg-gray-700 rounded-md text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {currentUser.address ? (
                <div className="border border-gray-700 rounded-lg p-4">
                  <p className="text-white">{currentUser.address.addressInfo}</p>
                  <p className="text-gray-400">
                    {currentUser.address.city}, {currentUser.address.state} {currentUser.address.pinCode}
                  </p>
                  <p className="text-gray-400">{currentUser.address.country}</p>
                  
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={handleEditAddressClick}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                    >
                      <FiEdit size={14} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 mb-4">No address added yet.</p>
              )}
              
              {!currentUser.address && (
                <button
                  onClick={handleAddAddressClick}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mt-4"
                >
                  <FiPlus size={16} />
                  <span>Add Address</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;