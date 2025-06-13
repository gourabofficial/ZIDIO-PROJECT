import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateHomeContent } from "../../Api/admin";
import AdminSettingsNewArrival from "./AdminSettingsNewArrival";
import AdminSettingsHotItems from "./AdminSettingsHotItems";
import AdminSettingsTrendingItems from "./AdminSettingsTrendingItems";
import { getHomeContent } from "../../Api/public";
import { 
  Settings, 
  Home, 
  AlertCircle, 
  Check, 
  RefreshCw, 
  ShoppingBag, 
  Flame, 
  TrendingUp 
} from "lucide-react";
import { useAuthdata } from "../../context/AuthContext";

const AdminSettings = () => {
    const { token} = useAuthdata();
  
  const [newArrivals, setNewArrivals] = useState([]);
  const [hotItems, setHotItems] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [changedSections, setChangedSections] = useState({});
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    newArrivals: true,
    hotItems: true,
    trendingItems: true
  });

  // Compute if there are any changes
  const hasChanges = Object.keys(changedSections).length > 0;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const homeContentUpdate = async (section, productIds) => {
    console.log(`Updating ${section} with products:`, productIds);
    setError("");

    // Update local state
    switch (section) {
      case "newArrivals":
        setNewArrivals(productIds);
        break;
      case "hotItems":
        setHotItems(productIds);
        break;
      case "trendingItems":
        setTrendingItems(productIds);
        break;
      default:
        console.error("Unknown section:", section);
        return;
    }

    // Track this section as changed
    setChangedSections((prev) => ({
      ...prev,
      [section]: productIds,
    }));

    // Save only the changed section to database
    try {
      setIsLoading(true);
      const data = {
        [section]: productIds,
      };

      const response = await updateHomeContent(data,token);

      if (response.success) {
        toast.success(`${section} updated successfully!`, {
          icon: <Check className="text-green-500" />,
        });
        // Remove this section from changed sections
        setChangedSections((prev) => {
          const updated = { ...prev };
          delete updated[section];
          return updated;
        });
      } else {
        toast.error(response.message || `Failed to update ${section}`);
        setError(response.message || `Failed to update ${section}`);
      }
    } catch (error) {
      console.error("Error updating home content:", error);
      toast.error(`Error: ${error.message || "Failed to update home content"}`);
      setError(error.message || "Failed to update home content");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHomeContent = async () => {
    try {
      setIsFetching(true);
      setError("");
      const response = await getHomeContent();
      
      if (response.success) {
        const { newArrivals, hotItems, trendingItems } = response.data;

        const newArrivalsIds = newArrivals?.map((item) => item._id) || [];
        const hotItemsIds = hotItems?.map((item) => item._id) || [];
        const trendingItemsIds = trendingItems?.map((item) => item._id) || [];

        setNewArrivals(newArrivalsIds);
        setHotItems(hotItemsIds);
        setTrendingItems(trendingItemsIds);
      } else {
        toast.error(response.message || "Failed to fetch home content");
        setError(response.message || "Failed to fetch home content");
      }
    } catch (error) {
      console.error("Error fetching home content:", error);
      toast.error(`Error: ${error.message || "Failed to fetch home content"}`);
      setError(error.message || "Failed to fetch home content");
    } finally {
      setIsFetching(false);
    }
  };

  const saveAllChanges = async () => {
    if (!hasChanges) return;

    try {
      setIsLoading(true);
      setError("");
      // Only send the sections that have changes
      const data = changedSections;

      const response = await updateHomeContent(data);

      if (response.success) {
        toast.success("All home content sections updated successfully!", {
          icon: <Check className="text-green-500" />,
        });
        // Clear all changed sections
        setChangedSections({});
      } else {
        toast.error(response.message || "Failed to update home content");
        setError(response.message || "Failed to update home content");
      }
    } catch (error) {
      console.error("Error updating home content:", error);
      toast.error(`Error: ${error.message || "Failed to update home content"}`);
      setError(error.message || "Failed to update home content");
    } finally {
      setIsLoading(false);
    }
  };

  const discardChanges = () => {
    if (window.confirm("Are you sure you want to discard all unsaved changes?")) {
      fetchHomeContent();
      setChangedSections({});
      toast.info("All changes have been discarded");
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  // Get section names for better display
  const getSectionName = (key) => {
    const names = {
      newArrivals: "New Arrivals",
      hotItems: "Hot Items",
      trendingItems: "Trending Items"
    };
    return names[key] || key;
  };

  // Get section icons
  const getSectionIcon = (key) => {
    switch(key) {
      case "newArrivals": return <ShoppingBag size={18} />;
      case "hotItems": return <Flame size={18} />;
      case "trendingItems": return <TrendingUp size={18} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-16 h-fit">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section with enhanced styling */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
          <div className="flex items-center">
            <Settings className="text-blue-400 mr-3" size={28} />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Home Content Settings
              </h1>
              <p className="text-gray-400">
                Customize your homepage sections and featured products
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
            {hasChanges && (
              <>
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  onClick={discardChanges}
                  disabled={isLoading}
                >
                  Discard Changes
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 shadow-lg font-medium flex items-center"
                  onClick={saveAllChanges}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <RefreshCw className="animate-spin mr-2" size={18} />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2" size={18} />
                      Save All Changes
                    </>
                  )}
                </button>
              </>
            )}
            
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center transition-colors"
              onClick={fetchHomeContent}
              disabled={isFetching}
            >
              <RefreshCw className={`mr-2 ${isFetching ? 'animate-spin' : ''}`} size={18} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        {/* Change summary */}
        {hasChanges && (
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mt-4">
            <h3 className="text-blue-300 font-medium mb-2 flex items-center">
              <Home className="mr-2" size={16} />
              Pending Homepage Changes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(changedSections).map(section => (
                <div key={section} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center text-gray-300 mb-1">
                    {getSectionIcon(section)}
                    <span className="ml-2 font-medium">{getSectionName(section)}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {changedSections[section].length} products selected
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="bg-red-900/40 backdrop-blur-sm border border-red-700/50 text-red-200 px-5 py-4 rounded-lg mt-4 flex items-center">
            <AlertCircle className="mr-3 text-red-400 flex-shrink-0" size={20} />
            <span className="font-medium">{error}</span>
            <button 
              onClick={() => setError("")} 
              className="ml-auto text-red-400 hover:text-red-300 transition-colors"
            >
              &times;
            </button>
          </div>
        )}
      </div>
      
      {/* Loading state */}
      {isFetching ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <div className="inline-block">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-400 absolute top-0 left-0" style={{animationDuration: '1.2s'}}></div>
            </div>
          </div>
          <p className="text-gray-300 font-medium text-lg">Loading home content settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* New Arrivals Section */}
          <div className="bg-gray-800/40 rounded-lg border border-gray-700 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-gray-800 to-gray-750 px-6 py-4 cursor-pointer flex items-center justify-between"
              onClick={() => toggleSection("newArrivals")}
            >
              <div className="flex items-center">
                <ShoppingBag className="text-blue-400 mr-3" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-white">New Arrivals</h2>
                  <p className="text-gray-400 text-sm">Products to display in the New Arrivals section</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-900/50 text-blue-300 rounded-full px-3 py-1 text-xs font-medium mr-4">
                  {newArrivals.length} selected
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.newArrivals ? "rotate-180" : ""}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedSections.newArrivals && (
              <div className="p-6">
                <AdminSettingsNewArrival
                  selectedIds={newArrivals}
                  onSave={(ids) => homeContentUpdate("newArrivals", ids)}
                />
              </div>
            )}
          </div>

          {/* Hot Items Section */}
          <div className="bg-gray-800/40 rounded-lg border border-gray-700 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-gray-800 to-gray-750 px-6 py-4 cursor-pointer flex items-center justify-between"
              onClick={() => toggleSection("hotItems")}
            >
              <div className="flex items-center">
                <Flame className="text-orange-400 mr-3" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-white">Hot Items</h2>
                  <p className="text-gray-400 text-sm">Featured products for the Hot Items section</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="bg-orange-900/50 text-orange-300 rounded-full px-3 py-1 text-xs font-medium mr-4">
                  {hotItems.length} selected
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.hotItems ? "rotate-180" : ""}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedSections.hotItems && (
              <div className="p-6">
                <AdminSettingsHotItems
                  selectedIds={hotItems}
                  onSave={(ids) => homeContentUpdate("hotItems", ids)}
                />
              </div>
            )}
          </div>

          {/* Trending Items Section */}
          <div className="bg-gray-800/40 rounded-lg border border-gray-700 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-gray-800 to-gray-750 px-6 py-4 cursor-pointer flex items-center justify-between"
              onClick={() => toggleSection("trendingItems")}
            >
              <div className="flex items-center">
                <TrendingUp className="text-green-400 mr-3" size={20} />
                <div>
                  <h2 className="text-xl font-bold text-white">Trending Items</h2>
                  <p className="text-gray-400 text-sm">Popular products for the Trending section</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="bg-green-900/50 text-green-300 rounded-full px-3 py-1 text-xs font-medium mr-4">
                  {trendingItems.length} selected
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.trendingItems ? "rotate-180" : ""}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedSections.trendingItems && (
              <div className="p-6">
                <AdminSettingsTrendingItems
                  selectedIds={trendingItems}
                  onSave={(ids) => homeContentUpdate("trendingItems", ids)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;