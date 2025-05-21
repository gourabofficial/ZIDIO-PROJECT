import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import {
  FiUser,
  FiMapPin,
  FiEdit,
  FiPlus,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiHome,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { updateAddress, addAddress, getAddressById } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const AccountSettings = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData } = useAuthdata();
  const navigate = useNavigate();
  
  const [addressData, setAddressData] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [isManagingAddress, setIsManagingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressInfo: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  // Fetch address details when component mounts or when address ID changes
  useEffect(() => {
    setAddressError(false);
    
    async function fetchAddressData() {
      if (currentUser?.address && typeof currentUser.address === 'string') {
        if (!addressData) {
          setLoadingAddress(true);
        }
        
        try {
          const response = await getAddressById(currentUser.address);
          if (response.success && response.address) {
            setAddressData(response.address);
          } else {
            setAddressError(true);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          
          if (error.response && error.response.status === 404) {
            setAddressError(false);
            setAddressData(null);
          } else {
            setAddressError(true);
          }
        } finally {
          setLoadingAddress(false);
        }
      }
    }
    
    if (isAuth && currentUser?.address) {
      fetchAddressData();
    }
  }, [currentUser?.address, isAuth]);

  // Handle loading state for the entire component
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] flex items-center justify-center">
        <MiniLoader />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] p-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md bg-[#13141f]/70 backdrop-blur-md p-8 rounded-xl border border-purple-500/20"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your account settings</p>
          <Link 
            to="/sign-in" 
            className="px-8 py-3 bg-black text-white rounded-md hover:bg-[#111] transition-all shadow-lg border border-purple-500/20 hover:border-purple-500/40 inline-block"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleEditProfileClick = () => navigate("/edit-profile");

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleManageAddress = () => {
    if (addressData) {
      setAddressForm({
        addressInfo: addressData.addressInfo || "",
        city: addressData.city || "",
        state: addressData.state || "",
        pinCode: addressData.pinCode || "",
        country: addressData.country || "",
      });
    }
    setIsManagingAddress(true);
  };

  const handleCancelAddressEdit = () => setIsManagingAddress(false);

  const handleRetryAddressFetch = async () => {
    setAddressError(false);
    setLoadingAddress(true);
    
    try {
      const response = await getAddressById(currentUser.address);
      if (response.success) {
        setAddressData(response.address);
      } else {
        setAddressError(true);
      }
    } catch (error) {
      console.error("Error retrying address fetch:", error);
      setAddressError(true);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSubmitAddress = async () => {
    try {
      setIsSubmitting(true);
      
      let response;
      
      if (currentUser.address) {
        const updateData = {
          ...addressForm,
          addressId: currentUser.address
        };
        
        try {
          response = await updateAddress(updateData);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            response = await addAddress(addressForm);
          } else {
            throw error;
          }
        }
      } else {
        response = await addAddress(addressForm);
      }
      
      if (response.success) {
        const userData = await refetchUserData();
        
        if (response.address) {
          setAddressData(response.address);
        } else if (response.addressId || (userData && userData.address)) {
          const addressId = response.addressId || userData.address;
          const addressResponse = await getAddressById(addressId);
          if (addressResponse.success) {
            setAddressData(addressResponse.address);
          }
        }
        
        setIsManagingAddress(false);
        toast.success(currentUser.address 
          ? "Address updated successfully!" 
          : "New address added successfully!");
      } else {
        toast.error(response.message || "Failed to manage address");
      }
    } catch (error) {
      console.error("Error managing address:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the address section based on the current state
  const renderAddressSection = () => {
    if (isManagingAddress) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-sm bg-[#13141f]/60 border border-indigo-500/20 rounded-lg p-5"
        >
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <FiHome className="text-indigo-400" />
            {currentUser.address ? "Edit Address" : "Add New Address"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm mb-1.5">Address</label>
              <input
                type="text"
                name="addressInfo"
                value={addressForm.addressInfo}
                onChange={handleAddressInputChange}
                placeholder="Street address, apartment, etc."
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md p-2.5 transition-colors outline-none"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleAddressInputChange}
                placeholder="City"
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md p-2.5 transition-colors outline-none"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">State</label>
              <input
                type="text"
                name="state"
                value={addressForm.state}
                onChange={handleAddressInputChange}
                placeholder="State/Province"
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md p-2.5 transition-colors outline-none"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={addressForm.pinCode}
                onChange={handleAddressInputChange}
                placeholder="ZIP/Postal code"
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md p-2.5 transition-colors outline-none"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">Country</label>
              <input
                type="text"
                name="country"
                value={addressForm.country}
                onChange={handleAddressInputChange}
                placeholder="Country"
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md p-2.5 transition-colors outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmitAddress}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <MiniLoader size={16} color="#ffffff" /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FiCheck size={16} /> Save Address
                </span>
              )}
            </button>
            
            <button
              onClick={handleCancelAddressEdit}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#111827] hover:bg-[#1e2532] text-white border border-gray-700 rounded-md text-sm font-medium transition-all flex items-center gap-2"
            >
              <FiX size={16} /> Cancel
            </button>
          </div>
        </motion.div>
      );
    }

    if (loadingAddress) {
      return (
        <div className="flex justify-center p-5 border border-indigo-500/20 rounded-lg bg-[#13141f]/60 backdrop-blur-sm">
          <MiniLoader />
          <span className="ml-3 text-indigo-300">Loading address...</span>
        </div>
      );
    }
    
    if (addressError) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-red-500/30 bg-red-900/5 backdrop-blur-sm rounded-lg p-5"
        >
          <div className="flex flex-col items-center justify-center py-3">
            <p className="text-gray-300 mb-4">Could not retrieve your address information</p>
            <div className="flex gap-3">
              <button 
                onClick={handleRetryAddressFetch}
                className="px-4 py-2 bg-[#111827] hover:bg-[#1e2532] text-white border border-gray-700 rounded-md text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Retry
              </button>
              
              <button 
                onClick={handleManageAddress}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center gap-2"
              >
                <FiPlus size={16} /> Add New Address
              </button>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (addressData) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-sm bg-[#13141f]/60 border border-indigo-500/20 rounded-lg p-5"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 mb-2">
                <FiHome size={16} />
                <span className="font-medium">Shipping Address</span>
              </div>
              
              <p className="text-gray-300">{addressData.addressInfo}</p>
              <p className="text-gray-300">
                {addressData.city}, {addressData.state} {addressData.pinCode}
              </p>
              <p className="text-gray-300">{addressData.country}</p>
            </div>
            
            <button
              onClick={handleManageAddress}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors h-fit group"
            >
              <FiEdit size={16} className="group-hover:animate-pulse" />
              <span className="text-sm">Edit</span>
            </button>
          </div>
        </motion.div>
      );
    }
    
    // No address yet
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center border border-indigo-500/20 border-dashed rounded-lg p-5 bg-[#13141f]/60 backdrop-blur-sm"
      >
        <p className="text-gray-400">
          {currentUser.address ? "Your address information needs to be updated" : "No address added yet"}
        </p>
        
        <button
          onClick={handleManageAddress}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
        >
          <FiPlus size={16} />
          <span>{currentUser.address ? "Update" : "Add"}</span>
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            icon: '🚀',
            style: {
              background: 'rgba(19, 20, 31, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(124, 58, 237, 0.3)',
            },
          },
          error: {
            icon: '❌',
            style: {
              background: 'rgba(19, 20, 31, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            },
          },
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Link 
            to="/account" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#13141f]/60 backdrop-blur-sm border border-indigo-500/20 text-white hover:bg-indigo-700/20 transition-all hover:border-indigo-500/40"
          >
            <FiArrowLeft size={20} />
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Account Settings
          </h1>
        </div>

        {/* User Profile Information */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-6 shadow-lg border border-indigo-500/20"
        >
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-2 mb-6">
            <FiUser className="text-indigo-400" />
            <span>Profile Information</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0 relative group mx-auto md:mx-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-300"></div>
              <img
                src={currentUser.avatar || "https://via.placeholder.com/100?text=Avatar"}
                alt={currentUser.fullName}
                className="relative w-24 h-24 rounded-full object-cover border-2 border-indigo-500/30"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100?text=Avatar";
                }}
              />
            </div>
            
            <div className="flex-grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="space-y-1">
                  <p className="text-indigo-300 text-sm flex items-center gap-2">
                    <FiUser size={14} /> Full Name
                  </p>
                  <p className="text-white font-medium">{currentUser.fullName || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-indigo-300 text-sm flex items-center gap-2">
                    <FiMail size={14} /> Email Address
                  </p>
                  <p className="text-white font-medium">{currentUser.email}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-indigo-300 text-sm flex items-center gap-2">
                    <FiPhone size={14} /> Phone Number
                  </p>
                  <p className="text-white font-medium">{currentUser.phone || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-indigo-300 text-sm">Account Type</p>
                  <p className="text-white font-medium capitalize">
                    {currentUser.role === 'admin' ? (
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">Admin</span>
                    ) : (
                      currentUser.role || "User"
                    )}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleEditProfileClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0c0e16] text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 rounded-md text-sm font-medium transition-all"
              >
                <FiEdit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Address Management */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-6 shadow-lg border border-indigo-500/20"
        >
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-2 mb-6">
            <FiMapPin className="text-indigo-400" />
            <span>Shipping Address</span>
          </h2>

          {renderAddressSection()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountSettings;