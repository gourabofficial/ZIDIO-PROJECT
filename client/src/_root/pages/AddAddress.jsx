import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import { FiMapPin, FiArrowLeft } from "react-icons/fi";
import { updateAddress, addAddress } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";
import toast, { Toaster } from 'react-hot-toast';

const AddAddress = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData } = useAuthdata();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    addressInfo: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  // Initialize form with existing address data if it exists
  useEffect(() => {
    if (currentUser?.address) {
      setAddressForm({
        addressInfo: currentUser.address.addressInfo || "",
        city: currentUser.address.city || "",
        state: currentUser.address.state || "",
        pinCode: currentUser.address.pinCode || "",
        country: currentUser.address.country || "",
      });
    }
  }, [currentUser]);

  if (!isLoaded) return <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center"><MiniLoader /></div>;

  if (!isAuth) {
    navigate("/sign-in");
    return null;
  }

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = async () => {
    // Form validation
    if (!addressForm.addressInfo || !addressForm.city || !addressForm.state || 
        !addressForm.pinCode || !addressForm.country) {
      toast.error("Please fill in all address fields");
      return;
    }
    
    setIsSubmitting(true);
    const hasExistingAddress = !!currentUser.address;
    const loadingToast = toast.loading(hasExistingAddress ? 'Updating address...' : 'Adding address...');
    
    try {
      const response = hasExistingAddress
        ? await updateAddress(addressForm)
        : await addAddress(addressForm);
      
      if (response.success) {
        await refetchUserData();
        toast.success(hasExistingAddress ? 'Address updated successfully!' : 'Address added successfully!', {
          id: loadingToast
        });
        navigate("/account-settings");
      } else {
        toast.error(response.message || 'Failed to save address', {
          id: loadingToast
        });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error('An error occurred while saving address', {
        id: loadingToast
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #374151'
          }
        }}
      />
      
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-white mb-6">
          <Link to="/account-settings" className="hover:text-[#c8a95a]">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">{currentUser.address ? 'Edit Address' : 'Add Address'}</h1>
        </div>

        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
            <FiMapPin className="text-[#c8a95a]" />
            <span>Shipping Address</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="addressInfo" className="block text-gray-300 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="addressInfo"
                name="addressInfo"
                value={addressForm.addressInfo}
                onChange={handleAddressInputChange}
                className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-4 py-2 text-white"
                placeholder="Street address, apartment, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-gray-300 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressInputChange}
                  className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-4 py-2 text-white"
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
                  className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pinCode" className="block text-gray-300 mb-1">Postal/ZIP Code</label>
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  value={addressForm.pinCode}
                  onChange={handleAddressInputChange}
                  className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-4 py-2 text-white"
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
                  className="w-full bg-[#0c0e16] border border-gray-700 rounded-md px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitAddress}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#c8a95a] hover:bg-[#b69a48] text-[#0c0e16] rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <MiniLoader size={16} /> : currentUser.address ? "Update Address" : "Save Address"}
              </button>
              
              <button
                onClick={() => navigate("/account-settings")}
                disabled={isSubmitting}
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

export default AddAddress;