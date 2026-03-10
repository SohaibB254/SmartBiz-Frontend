import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useBusiness } from './BusinessContext';

const API_HOST = 'http://localhost:3000';
const ListingContext = createContext();

export const ListingProvider = ({ children }) => {
  const { businessProfile } = useBusiness();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to determine the dynamic endpoint base ('products' or 'services')
  const getEndpointType = useCallback(() => {
    return businessProfile?.businessType === 'Service Based' ? 'services' : 'products';
  }, [businessProfile]);

  // Fetch all listings for this business
  const fetchListings = async () => {
    if (!businessProfile) return;
    setIsLoading(true);
    try {
      const type = getEndpointType();
      // Using 'ckabnt' as requested in your prompt (this might be a specific business ID in your actual backend)
      const response = await axios.get(`${API_HOST}/${type}/${businessProfile.customId}/view-all`, {
        withCredentials: true
      });
      setListings(response.data?.items || response.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      // Mock data for UI visualization
      setListings([
        { _id: '1', title: 'Web Development', price: 32, description: 'This is a service provided...', type: businessProfile?.businessType === 'Service Based' ? 'Service' : 'Product' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new listing
  const addListing = async (formData) => {
    try {
      const type = getEndpointType();
      const response = await axios.post(`${API_HOST}/${type}/add`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Refresh listings after adding
      await fetchListings();
      return { success: true, message: "Listing added successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // Get a single listing by ID
  const getListingById = async (id) => {
    try {
      const type = getEndpointType();
      const response = await axios.get(`${API_HOST}/${type}/${id}/view`, {
        withCredentials: true
      });
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  };

  // Update an existing listing
  const updateListing = async (id, formData) => {
    try {
      const type = getEndpointType();
      const response = await axios.put(`${API_HOST}/${type}/${id}/edit`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, message: "Listing updated successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // Toggle Activate/Deactivate
  const toggleStatus = async (id, currentStatus) => {
    try {
      const type = getEndpointType();
      const newStatus = currentStatus === 'active' ? 'deactivate' : 'activate';
      // Sending status as a param as requested
      const response = await axios.patch(`${API_HOST}/${type}/${id}/${newStatus}`, {}, {
        withCredentials: true
      });
      return { success: true, message: `Listing ${newStatus}d successfully!`, newStatus };
    } catch (error) {
      throw error;
    }
  };

  return (
    <ListingContext.Provider value={{
      listings,
      isLoading,
      fetchListings,
      addListing,
      getListingById,
      updateListing,
      toggleStatus
    }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListing = () => useContext(ListingContext);