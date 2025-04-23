import { createContext, useContext, useState, useEffect } from "react";
import { isLogin } from "../Api/user";
import {useUser} from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { user, isLoaded:isUserLoading } = useUser();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setIsLoaded(false);
        const response = await isLogin();

        if (response.success && response.user) {
          setCurrentUser({
            id: response.user._id,
            clerkId: response.user.clerkId,
            fullName: response.user.fullName,
            email: response.user.email,
            role: response.user.role || 'user',
            avatar: response.user.avatar,
            createdAt: response.user.createdAt,
            updatedAt: response.user.updatedAt
          });
          setIsAuth(true);
          setError(null);
        } else {
          setCurrentUser(null);
          setIsAuth(false);
          if (!response.success) {
            setError(response.message || "Authentication failed");
          }
        }
      } catch (err) {
        setCurrentUser(null);
        setIsAuth(false);
        setError("Failed to authenticate user");
        console.error("Auth check error:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    checkLoginStatus();
  }, [user, isUserLoading]);

  const authValues = {
    currentUser,
    isAuth,
    isLoaded,
    error
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