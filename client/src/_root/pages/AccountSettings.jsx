import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import {
  FiUser,
  FiMapPin,
  FiEdit,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import { updateAddress, addAddress, getAddressById } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";
import toast, { Toaster } from 'react-hot-toast';

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
  if (!isLoaded) return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center"><MiniLoader /></div>;

  // Redirect if not authenticated
  if (!isAuth) {
    return (
      <div className="bg-[#0c0e16] p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your account settings</p>
          <Link to="/sign-in" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md text-white font-medium">Sign In</Link>
        </div>
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
            // Keep this one informative log
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
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">
            {currentUser.address ? "Edit Address" : "Add New Address"}
          </h3>
          {/* Form fields stay the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-1">Address</label>
              <input
                type="text"
                name="addressInfo"
                value={addressForm.addressInfo}
                onChange={handleAddressInputChange}
                className="w-full bg-[#131825] text-white border border-gray-700 rounded p-2"
              />
            </div>
            {/* Other form fields remain the same */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">City</label>
              <input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleAddressInputChange}
                className="w-full bg-[#131825] text-white border border-gray-700 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">State</label>
              <input
                type="text"
                name="state"
                value={addressForm.state}
                onChange={handleAddressInputChange}
                className="w-full bg-[#131825] text-white border border-gray-700 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={addressForm.pinCode}
                onChange={handleAddressInputChange}
                className="w-full bg-[#131825] text-white border border-gray-700 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={addressForm.country}
                onChange={handleAddressInputChange}
                className="w-full bg-[#131825] text-white border border-gray-700 rounded p-2"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmitAddress}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#c8a95a] hover:bg-[#b69a48] text-[#0c0e16] rounded-md text-sm font-medium"
            >
              {isSubmitting ? <span className="flex items-center gap-2"><MiniLoader size={16} color="#0c0e16" /> Saving...</span> : "Save Address"}
            </button>
            <button
              onClick={handleCancelAddressEdit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (loadingAddress) {
      return (
        <div className="flex justify-center p-4 border border-gray-700 rounded-lg">
          <MiniLoader />
          <span className="ml-2 text-gray-400">Loading address...</span>
        </div>
      );
    }
    
    if (addressError) {
      return (
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="flex flex-col items-center justify-center py-2">
            <p className="text-gray-300 mb-3">Could not retrieve your address information</p>
            <div className="flex gap-3">
              <button 
                onClick={handleRetryAddressFetch}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm font-medium"
              >
                Retry
              </button>
              <button 
                onClick={handleManageAddress}
                className="px-4 py-2 bg-[#c8a95a] hover:bg-[#b69a48] text-[#0c0e16] rounded-md text-sm font-medium"
              >
                Add New Address
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (addressData) {
      return (
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-300 mb-1">{addressData.addressInfo}</p>
              <p className="text-gray-300">
                {addressData.city}, {addressData.state} {addressData.pinCode}
              </p>
              <p className="text-gray-300">{addressData.country}</p>
            </div>
            <button
              onClick={handleManageAddress}
              className="flex items-center gap-1 text-[#c8a95a] hover:text-[#b69a48] h-fit"
            >
              <FiEdit size={16} />
              <span className="text-sm">Edit</span>
            </button>
          </div>
        </div>
      );
    }
    
    // No address yet
    return (
      <div className="flex justify-between items-center border border-gray-700 border-dashed rounded-lg p-4">
        <p className="text-gray-400">
          {currentUser.address ? "Your address information needs to be updated" : "No address added yet"}
        </p>
        <button
          onClick={handleManageAddress}
          className="flex items-center gap-2 px-3 py-1 bg-[#c8a95a] hover:bg-[#b69a48] text-[#0c0e16] rounded-md text-sm font-medium"
        >
          <FiPlus size={14} />
          <span>{currentUser.address ? "Update" : "Add"}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #c8a95a',
            },
          },
          error: {
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #ef4444',
            },
          },
        }}
      />
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

        {/* Address Management */}
        <div className="bg-[#1e293b] rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <FiMapPin className="text-[#c8a95a]" />
            <span>My Address</span>
          </h2>

          {renderAddressSection()}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;