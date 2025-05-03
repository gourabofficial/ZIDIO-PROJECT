import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import { LoaderCircle } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  
  // Check authentication status
  useEffect(() => {
    // This would typically come from your auth context or API
    // Simulating auth check with timeout
    const checkAuth = setTimeout(() => {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(checkAuth);
  }, []);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle sidebar handler for child component
  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoaderCircle className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        sidebarOpen={isSidebarOpen} 
        toggleSidebar={handleSidebarToggle}
        location={location}
      />
      
      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-64' : 'ml-0'
      } p-6 overflow-y-auto bg-gray-900 text-white`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;