import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateHomeContent } from '../../Api/admin';
import AdminSettingsNewArrival from './AdminSettingsNewArrival';
import AdminSettingsHotItems from './AdminSettingsHotItems';
import AdminSettingsTrendingItems from './AdminSettingsTrendingItems';

const AdminSettings = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [hotItems, setHotItems] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [changedSections, setChangedSections] = useState({});

  // Compute if there are any changes
  const hasChanges = Object.keys(changedSections).length > 0;

  const homeContentUpdate = async (section, productIds) => {
    console.log(`Updating ${section} with products:`, productIds);
    
    // Update local state
    switch(section) {
      case 'newArrivals':
        setNewArrivals(productIds);
        break;
      case 'hotItems':
        setHotItems(productIds);
        break;
      case 'trendingItems':
        setTrendingItems(productIds);
        break;
      default:
        console.error('Unknown section:', section);
        return;
    }

    // Track this section as changed
    setChangedSections(prev => ({
      ...prev,
      [section]: productIds
    }));
    
    // Save only the changed section to database
    try {
      setIsLoading(true);
      const data = {
        [section]: productIds
      };
      
      const response = await updateHomeContent(data);
      
      if (response.success) {
        toast.success(`${section} updated successfully!`);
        // Remove this section from changed sections
        setChangedSections(prev => {
          const updated = {...prev};
          delete updated[section];
          return updated;
        });
      } else {
        toast.error(response.message || `Failed to update ${section}`);
      }
    } catch (error) {
      console.error('Error updating home content:', error);
      toast.error(`Error: ${error.message || 'Failed to update home content'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllChanges = async () => {
    if (!hasChanges) return;
    
    try {
      setIsLoading(true);
      // Only send the sections that have changes
      const data = changedSections;
      
      const response = await updateHomeContent(data);
      
      if (response.success) {
        toast.success('All home content sections updated successfully!');
        // Clear all changed sections
        setChangedSections({});
      } else {
        toast.error(response.message || 'Failed to update home content');
      }
    } catch (error) {
      console.error('Error updating home content:', error);
      toast.error(`Error: ${error.message || 'Failed to update home content'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-16 h-fit">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Home Content Settings</h1>
          <p className="text-gray-400">Customize your homepage sections and featured content</p>
        </div>
        <div className="text-right text-gray-400">
          {hasChanges && (
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
              onClick={saveAllChanges}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save All Changes'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <AdminSettingsNewArrival 
          selectedIds={newArrivals} 
          onSave={(ids) => homeContentUpdate('newArrivals', ids)} 
        />
        
        <AdminSettingsHotItems 
          selectedIds={hotItems} 
          onSave={(ids) => homeContentUpdate('hotItems', ids)} 
        />
        
        <AdminSettingsTrendingItems 
          selectedIds={trendingItems} 
          onSave={(ids) => homeContentUpdate('trendingItems', ids)} 
        />
      </div>
    </div>
  );
};

export default AdminSettings;