import { createContext, useContext, useState, useEffect } from "react";
import { isLogin } from "../Api/user";
import {useUser} from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [overrideData, setOverrideData] = useState(null);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { user, isLoaded:isUserLoading } = useUser();

  // Function to fetch latest user data
  const refetchUserData = async () => {
    try {
      setIsLoaded(false);
      
      // Add a random query parameter to prevent caching
      const timestamp = Date.now();
      const response = await isLogin({ _t: timestamp });

      if (response.success && response.user) {
        
        const updatedUser = {
          id: response.user._id,
          clerkId: response.user.clerkId,
          fullName: response.user.fullName,
          email: response.user.email,
          role: response.user.role || 'user',
          avatar: response.user.avatar,
          address: response.user.address,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt
        };
        
        setCurrentUser(updatedUser);
        setIsAuth(true);
        setError(null);
        
        // Return the updated user data
        return updatedUser;
      } else {
        setCurrentUser(null);
        setIsAuth(false);
        if (!response.success) {
          setError(response.message || "Authentication failed");
        }
        return null;
      }
    } catch (err) {
      setCurrentUser(null);
      setIsAuth(false);
      setError("Failed to authenticate user");
      console.error("Auth check error:", err);
      return null;
    } finally {
      setIsLoaded(true);
    }
  };

  // Add this new function to directly update the user state with override
  const updateUserState = (updates) => {
    if (!currentUser) return;
    
    // Create the updated user object
    const updatedUser = {
      ...currentUser,
      ...updates
    };
    
    // Update the user state directly
    setCurrentUser(updatedUser);
    
    // Also store in overrideData to ensure it persists until backend catches up
    setOverrideData(updatedUser);
  };

  useEffect(() => {
    refetchUserData();
  }, [user, isUserLoading]);

  const authValues = {
    // If we have override data, use it, otherwise use currentUser
    currentUser: overrideData || currentUser,
    isAuth,
    isLoaded,
    error,
    refetchUserData,
    updateUserState
  };

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>;
};

export const useAuthdata = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};