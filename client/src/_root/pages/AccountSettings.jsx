import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import {
  FiUser,
  FiMapPin,
  FiEdit,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import { updateAddress, addAddress } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";

const AccountSettings = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData } = useAuthdata();
  const navigate = useNavigate();

  // Address management state
  const [isManagingAddress, setIsManagingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressInfo: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  // Handle loading state
  if (!isLoaded) return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center"><MiniLoader /></div>;

  // Redirect if not authenticated
  if (!isAuth) {
    return (
      <div className="bg-[#0c0e16] p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your account settings</p>
          <Link to="/sign-in" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md text-white font-medium">Sign In</Link>
        </div>
      </div>
    );
  }

  // Navigate to edit profile page
  const handleEditProfileClick = () => navigate("/edit-profile");

  // Address form handlers
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleManageAddress = () => {
    // Initialize form with existing data when editing
    if (currentUser.address) {
      setAddressForm({
        addressInfo: currentUser.address.addressInfo || "",
        city: currentUser.address.city || "",
        state: currentUser.address.state || "",
        pinCode: currentUser.address.pinCode || "",
        country: currentUser.address.country || "",
      });
    }
    setIsManagingAddress(true);
  };

  const handleCancelAddressEdit = () => setIsManagingAddress(false);

  const handleSubmitAddress = async () => {
    try {
      const response = currentUser.address 
        ? await updateAddress(addressForm)
        : await addAddress(addressForm);
        
      if (response.success) {
        await refetchUserData();
        setIsManagingAddress(false);
      } else {
        alert(response.message || "Failed to manage address");
      }
    } catch (error) {
      console.error("Error managing address:", error);
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
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <FiMapPin className="text-[#c8a95a]" />
            <span>Address Management</span>
          </h2>

          <div>
            {currentUser.address ? (
              <div className="border border-gray-700 rounded-lg p-4">
                <p className="text-white">{currentUser.address.addressInfo}</p>
                <p className="text-gray-400">
                  {currentUser.address.city}, {currentUser.address.state} {currentUser.address.pinCode}
                </p>
                <p className="text-gray-400">{currentUser.address.country}</p>

                <Link
                  to="/add-address"
                  className="flex items-center gap-1 text-[#c8a95a] hover:text-[#b69a48] mt-3 text-sm"
                >
                  <FiEdit size={14} />
                  <span>Edit</span>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">No address added yet.</p>
                <Link
                  to="/add-address"
                  className="flex items-center gap-2 px-4 py-2 bg-[#c8a95a] hover:bg-[#b69a48] text-[#0c0e16] rounded-md text-sm font-medium w-fit"
                >
                  <FiPlus size={16} />
                  <span>Add Address</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;