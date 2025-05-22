import { createContext, useContext, useState, useEffect } from "react";
import { isLogin } from "../Api/user";
import { useUser } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [overrideData, setOverrideData] = useState(null);
  const [error, setError] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { user, isLoaded: isUserLoading } = useUser();

  const refetchUserData = async () => {
    try {
      setIsLoaded(false);

      const timestamp = Date.now();
      const response = await isLogin({ _t: timestamp });

      // console.log("Auth check response:", response);

      if (response.success && response.user) {
        const updatedUser = {
          id: response.user._id,
          clerkId: response.user.clerkId,
          fullName: response.user.fullName,
          email: response.user.email,
          phone: response.user.phone || "",
          role: response.user.role || "user",
          avatar: response.user.avatar,
          address: response.user.address,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
          cartData: response?.user.cart || null,
          wishlist: response?.user.wishlist || [],
        };

        setCurrentUser(updatedUser);
        setIsAuth(true);
        setError(null);

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

  const updateUserState = (updates) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updates,
    };

    setCurrentUser(updatedUser);

    setOverrideData(updatedUser);
  };

  useEffect(() => {
    refetchUserData();
  }, [user, isUserLoading]);

  const authValues = {
    currentUser: overrideData || currentUser,
    isAuth,
    isLoaded,
    error,
    refetchUserData,
    updateUserState,
  };

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export const useAuthdata = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
