import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import { FiUser, FiArrowLeft } from "react-icons/fi";
import { updateUserDetails, updateAccount } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";
import toast, { Toaster } from 'react-hot-toast';

const EditProfile = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData, updateUserState } = useAuthdata();
  const navigate = useNavigate();
  
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    avatar: "",
  });
  
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
      });
    }
  }, [currentUser]);

  if (!isLoaded) return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center"><MiniLoader /></div>;
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
    // Check if anything has changed
    if (profileForm.fullName === currentUser.fullName && 
        profileForm.avatar === currentUser.avatar) {
      toast.info("No changes to save");
      return;
    }
    
    const loadingToast = toast.loading('Updating your profile...');
    
    try {
      let hasUpdates = false;
      let userUpdates = {};
      
      // Update full name if changed
      if (profileForm.fullName !== currentUser.fullName) {
        console.log("Updating name from:", currentUser.fullName, "to:", profileForm.fullName);
        const nameResponse = await updateUserDetails({
          fullName: profileForm.fullName
        });
        
        if (!nameResponse.success) {
          toast.error(`Failed to update name: ${nameResponse.message || 'Unknown error'}`, {
            id: loadingToast
          });
          return;
        }
        hasUpdates = true;
        userUpdates.fullName = profileForm.fullName;
      }
      
      // Update avatar if changed
      if (profileForm.avatar !== currentUser.avatar) {
        console.log("Updating avatar from:", currentUser.avatar, "to:", profileForm.avatar);
        
        const avatarResponse = await updateAccount({
          avatarUrl: profileForm.avatar
        });
        
        if (!avatarResponse.success) {
          toast.error(`Failed to update avatar: ${avatarResponse.message || 'Unknown error'}`, {
            id: loadingToast
          });
          return;
        }
        hasUpdates = true;
        userUpdates.avatar = profileForm.avatar;
      }
      
      if (hasUpdates) {
        try {
          // First update the context state directly with the changes
          updateUserState(userUpdates);
          
          // Also trigger a refetch for good measure
          await refetchUserData();
          
          toast.success('Profile updated successfully!', {
            id: loadingToast,
            duration: 3000 
          });
          
          // Navigate without relying on router state
          navigate("/account");
        } catch (error) {
          console.error("Error during data refresh:", error);
          toast.error("Error refreshing data");
        }
      } else {
        toast.dismiss(loadingToast);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`, {
        id: loadingToast
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      {/* Toast container */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #374151'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />
      
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-white mb-6">
          <Link to="/account" className="hover:text-purple-400">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>

        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <FiUser className="text-purple-400" />
            <span>Profile Information</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileInputChange}
                className="w-full bg-[#121828] border border-gray-700 rounded-md px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Select Avatar</label>
              <div className="grid grid-cols-5 gap-4 mb-4">
                {superheroAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-md p-1 ${
                      profileForm.avatar === avatar
                        ? "ring-2 ring-purple-500 scale-105"
                        : "hover:bg-[#2e3446]"
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar option ${index + 1}`}
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
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => navigate("/account")}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded-md text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;