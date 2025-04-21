import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
        role: user.publicMetadata?.role || 'user' 
      });
      setIsAuth(true);
    } else if (isLoaded && !user) {
      setCurrentUser(null);
      setIsAuth(false);
    }
  }, [isLoaded, user]);

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