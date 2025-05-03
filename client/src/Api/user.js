import axiosInstance from "./config";

// update account (avatar)
export const updateAccount = async (formData) => {
   try {
      const res = await axiosInstance.patch('/user/update-profile', formData);
      return res.data;
   } catch (error) {
      console.error("Error updating account:", error);
      return {
         message: error.response?.data?.message || "Failed to update account",
         success: false
      };
   }
};

// update userDetails
export const updateUserDetails = async (userData) => {
   try {
      const res = await axiosInstance.patch('/user/update-user', userData);
      return res.data;
   } catch (error) {
      console.error("Error updating user details:", error);
      return {
         message: "Failed to update user details",
         success: false
      };
   }
};

// update address
export const updateAddress = async (addressData) => {
   try {
      const res = await axiosInstance.patch('/user/update-address', addressData);
      return res.data;
   } catch (error) {
      console.error("Error updating address:", error);
      return {
         message: "Failed to update address",
         success: false
      };
   }
};

// add address
export const addAddress = async (addressData) => {
   try {
      const res = await axiosInstance.post('/user/add-address', addressData);
      return res.data;
   } catch (error) {
      console.error("Error adding address:", error);
      return {
         message: "Failed to add address",
         success: false
      };
   }
};

// is login
export const isLogin = async () => {
   try {
      const res = await axiosInstance.post('/user/is-login');
      return res.data;
   } catch (error) {
      console.error("Error checking login status:", error);
      return {
         message: "Failed to check login status",
         success: false
      };
   }
};

// update avatar
export const updateAvatar = async (avatarData) => {
   try {
      console.log("Sending avatar update:", avatarData);  // Debug log
      const res = await axiosInstance.patch('/user/update-avatar', avatarData);
      console.log("Avatar update response:", res.data);  // Debug log
      return res.data;
   } catch (error) {
      console.error("Error updating avatar:", error.response?.data || error.message);
      return {
         message: error.response?.data?.message || "Failed to update avatar",
         success: false
      };
   }
};