import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import { FiUser, FiArrowLeft, FiCheck, FiCamera, FiPhone } from "react-icons/fi";
import { updateUserDetails, updateAvatarUrl } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const EditProfile = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData } = useAuthdata();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    avatar: "",
    phone: "", // Add phone field
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Superhero avatars
  const superheroAvatars = [
    "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1657558045738-21507cf53606?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://as2.ftcdn.net/v2/jpg/05/62/12/87/1000_F_562128745_Pt2bgKtkf0L5zbabWDeji6sGoszjFyfL.jpg",
    "https://as2.ftcdn.net/v2/jpg/03/68/87/37/1000_F_368873773_erdZlAfQNMSIiX0n9e8XVHTQ8QButcaN.jpg",
    "https://as2.ftcdn.net/v2/jpg/04/06/23/13/1000_F_406231350_sPZSAkWgSH3yhgVzfuQ2tyNvWAThCKYv.jpg",
  ];

  // Initialize with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || "",
        avatar: currentUser.avatar || "",
        phone: currentUser.phone || "", // Initialize phone
      });
    }
  }, [currentUser]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] flex items-center justify-center">
        <div className="text-white"><MiniLoader /></div>
      </div>
    );
  }
  
  if (!isAuth) {
    navigate("/sign-in");
    return null;
  }

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setProfileForm(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSubmitting(true);
      let updatedItems = [];
      
      // For avatar URL updates
      if (profileForm.avatar && profileForm.avatar !== currentUser.avatar) {
        const avatarResult = await updateAvatarUrl(profileForm.avatar);
        
        if (!avatarResult.success) {
          console.error(avatarResult.message);
          toast.error("Failed to update avatar");
          setIsSubmitting(false);
          return;
        }
        
        updatedItems.push("avatar");
      }
      
      // For name and phone updates
      const userUpdates = {};
      if (profileForm.fullName && profileForm.fullName !== currentUser.fullName) {
        userUpdates.fullName = profileForm.fullName;
      }
      
      if (profileForm.phone !== currentUser.phone) {
        userUpdates.phone = profileForm.phone;
      }
      
      // Only make API call if there are updates
      if (Object.keys(userUpdates).length > 0) {
        const userResult = await updateUserDetails(userUpdates);
        if (!userResult.success) {
          console.error("Failed to update user details:", userResult.message);
          toast.error("Failed to update user details");
          setIsSubmitting(false);
          return;
        }
        
        if (userUpdates.fullName) updatedItems.push("name");
        if (userUpdates.phone) updatedItems.push("phone number");
      }
      
      // If nothing was updated
      if (updatedItems.length === 0) {
        toast.info("No changes detected");
        setIsSubmitting(false);
        return;
      }
      
      // Refresh user data and navigate
      await refetchUserData();
      
      // Show success message
      toast.success(
        updatedItems.length > 1 
          ? "Profile updated successfully!" 
          : `Your ${updatedItems[0]} has been updated!`
      );
      
      // Small delay before navigation for toast to be visible
      setTimeout(() => navigate("/account", {
        state: { updatedUser: {
          ...currentUser,
          fullName: profileForm.fullName,
          avatar: profileForm.avatar,
          phone: profileForm.phone
        }}
      }), 1000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      {/* Toast container */}
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
          info: {
            icon: 'ℹ️',
            style: {
              background: 'rgba(19, 20, 31, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            },
          }
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
            to="/account-settings" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#13141f]/60 backdrop-blur-sm border border-indigo-500/20 text-white hover:bg-indigo-700/20 transition-all hover:border-indigo-500/40"
          >
            <FiArrowLeft size={20} />
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Edit Profile
          </h1>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-indigo-500/20"
        >
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-2 mb-8">
            <FiUser className="text-indigo-400" />
            <span>Profile Information</span>
          </h2>

          <div className="space-y-8">
            {/* Name Field */}
            <div>
              <label htmlFor="fullName" className=" text-indigo-300 text-sm mb-2 flex items-center gap-2">
                <FiUser size={14} /> Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileInputChange}
                placeholder="Enter your full name"
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md px-4 py-3 transition-colors outline-none"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phone" className=" text-indigo-300 text-sm mb-2 flex items-center gap-2">
                <FiPhone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileInputChange}
                placeholder="Enter your phone number"
                className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md px-4 py-3 transition-colors outline-none"
              />
              <p className="text-gray-400 text-xs mt-1">Format: +1234567890 or 1234567890</p>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-4">
              <label className=" text-indigo-300 text-sm mb-2 flex items-center gap-2">
                <FiCamera size={14} /> Choose Profile Avatar
              </label>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {superheroAvatars.map((avatar, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 
                      ${profileForm.avatar === avatar
                        ? "ring-2 ring-purple-500 ring-opacity-70 shadow-lg shadow-purple-500/20"
                        : "hover:shadow-md hover:shadow-indigo-500/10"
                      }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    {/* Border glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 to-purple-500/0 opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
                    
                    {/* Avatar image */}
                    <div className="aspect-square overflow-hidden bg-[#0c0e16]">
                      <img
                        src={avatar}
                        alt={`Avatar option ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Avatar";
                        }}
                      />
                    </div>
                    
                    {/* Selected indicator */}
                    {profileForm.avatar === avatar && (
                      <div className="absolute bottom-1 right-1 bg-purple-500 rounded-full p-1 shadow-lg">
                        <FiCheck size={12} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Selected Avatar Display */}
              <AnimatePresence>
                {profileForm.avatar && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 flex flex-col items-center"
                  >
                    <p className="text-indigo-300 text-sm mb-3">Selected Avatar:</p>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 blur-sm group-hover:opacity-75 transition-opacity duration-300"></div>
                      <img
                        src={profileForm.avatar}
                        alt="Selected avatar"
                        className="relative w-24 h-24 rounded-full object-cover border-2 border-purple-500/30"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Avatar";
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdateProfile}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiCheck size={16} /> Save Changes
                  </span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/account-settings")}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0c0e16] text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white rounded-md text-sm font-medium transition-all flex items-center justify-center"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditProfile;