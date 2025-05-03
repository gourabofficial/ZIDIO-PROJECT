
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail,
  Phone,
  Save,
  RefreshCw,
  Check,
  Upload
} from 'lucide-react';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@marvel-apparel.com',
    phone: '+91 98765 43210',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile({
      ...adminProfile,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdminProfile({
          ...adminProfile,
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!adminProfile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!adminProfile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(adminProfile.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return newErrors;
  };

  const handleSaveSettings = async () => {
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 sm:p-6 border-b border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
          <SettingsIcon className="mr-3" size={24} />
          My Profile
        </h2>
        <p className="text-purple-100 mt-2">
          Manage your personal account information
        </p>
      </div>
      
      <div className="p-4 sm:p-6">
        {saveSuccess && (
          <div className="mb-6 bg-green-600 bg-opacity-20 border border-green-500 text-green-300 px-4 py-3 rounded flex items-center">
            <Check size={20} className="mr-2" />
            <span>Profile saved successfully!</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-750 rounded-lg overflow-hidden p-5">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative group mb-4">
                  <img 
                    src={adminProfile.avatar} 
                    alt={adminProfile.name} 
                    className="w-full h-full rounded-full object-cover border-4 border-gray-700"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Upload size={24} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{adminProfile.name}</h3>
                <p className="text-gray-400">Administrator</p>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">Click on the image to upload a new profile picture</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gray-750 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={adminProfile.name}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={adminProfile.email}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md py-2 pl-10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={adminProfile.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
