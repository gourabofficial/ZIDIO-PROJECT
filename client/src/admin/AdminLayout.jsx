import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import { LoaderCircle } from 'lucide-react';
import { useAuthdata } from '../context/AuthContext';
import axiosInstance from '../Api/config';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  const location = useLocation();
  const { currentUser, isAuth, isLoaded } = useAuthdata();
  
  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      
      // Wait for auth to load first
      if (!isLoaded) return;
      
      // Not logged in
      if (!isAuth || !currentUser) {
        console.log("Not authenticated or no user data");
        setIsAdmin(false);
        setIsLoading(false);
        setDebugInfo({ stage: "auth-check", result: "not-authenticated" });
        return;
      }
      
      setDebugInfo({
        stage: "user-check", 
        role: currentUser.role,
        user: currentUser
      });
      
      // Fast client-side check - if role is explicitly "admin", immediately approve
      if (currentUser.role === 'admin') {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      // If explicitly user role, no need to check server
      if (currentUser.role === 'user') {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Verify admin status with backend for security
        const response = await axiosInstance.post('/users/admin');
        console.log("Admin API response:", response.data);
        
        setDebugInfo({
          stage: "api-check",
          apiResponse: response.data
        });
        
        setIsAdmin(response.data.success);
      } catch (error) {
        console.error("Admin authentication error:", error);
        setDebugInfo({
          stage: "api-error",
          error: error.message,
          status: error.response?.status
        });
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUser, isAuth, isLoaded]);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle sidebar handler for child component
  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  // Show loading while checking auth status
  if (isLoading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoaderCircle className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }
  
  // Show debug panel in development
  if (process.env.NODE_ENV === 'development' && !isAdmin) {
    console.log("Debug info in render:", debugInfo);
  }
  
  // Redirect to login if not authenticated
  if (!isAuth || !currentUser) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }
  
  // Redirect regular users to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Only admins reach this point
  return (
    <div className="flex bg-gray-900">
      {/* Sidebar */}
      <div className="fixed h-screen z-30">
        <AdminSidebar 
          sidebarOpen={isSidebarOpen} 
          toggleSidebar={handleSidebarToggle}
          location={location}
        />
      </div>
      
      {/* Main content - Scrollable */}
      <div 
        className={`w-full ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300 min-h-screen`}
      >
        <main className="p-6 bg-gray-900 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;