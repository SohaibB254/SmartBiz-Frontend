import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // <-- ADDED: Import your User Context

const API_HOST = 'http://localhost:3000';
const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessProfile, setBusinessProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // <-- ADDED: Get the logged in user
  const { user } = useUser();

  // Load from backend based on user ID, fallback to local storage
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      // If we don't have a user ID yet, we can't fetch their business
      if (!user || !user._id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Hit your special route using the user's ID
        const response = await axios.get(`${API_HOST}/business/${user._id}/view`, {
          withCredentials: true
        });

        // Assuming backend sends it in a 'business' object
        const fetchedProfile = response.data?.business || response.data;

        setBusinessProfile(fetchedProfile);
        localStorage.setItem('businessProfile', JSON.stringify(fetchedProfile));
      } catch (error) {
        // If it fails (e.g., 404 because they haven't created one yet),
        // we check local storage just as a final fallback, otherwise clear it.
        console.error("No business profile found on backend or fetch failed.");
        const storedBusiness = localStorage.getItem('businessProfile');

        if (storedBusiness) {
          setBusinessProfile(JSON.parse(storedBusiness));
        } else {
          setBusinessProfile(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [user]); // <-- Re-runs whenever the 'user' state changes/loads

  // API Call: Create Profile
  const createProfile = async (formData) => {
    try {
      // Note: We use formData here directly so Multer can read the attached file
      const response = await axios.post(`${API_HOST}/business/create-profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newProfile = response.data?.newBusiness || response.data;
      setBusinessProfile(newProfile);
      localStorage.setItem('businessProfile', JSON.stringify(newProfile));
      return { success: true, message: response.data?.message || "Profile created successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // API Call: Update Profile
  const updateProfile = async (customId, formData) => {
    try {
      const response = await axios.put(`${API_HOST}/business/${customId}/update`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedProfile = response.data?.updatedBusiness || response.data;
      setBusinessProfile(updatedProfile);
      localStorage.setItem('businessProfile', JSON.stringify(updatedProfile));
      return { success: true, message: response.data?.message || "Profile updated successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // API Call: Toggle Status (Activate/Deactivate)
  const toggleStatus = async (customId, currentStatus) => {
    try {
      const endpointStatus = currentStatus === 'active' ? 'deactivate' : 'activate';
      const response = await axios.patch(`${API_HOST}/business/${customId}/${endpointStatus}`, {}, {
        withCredentials: true
      });

      const updatedProfile = { ...businessProfile, status: endpointStatus };
      setBusinessProfile(updatedProfile);
      localStorage.setItem('businessProfile', JSON.stringify(updatedProfile));
      return { success: true, message: `Profile ${endpointStatus}d successfully!` };
    } catch (error) {
      throw error;
    }
  };

  return (
    <BusinessContext.Provider value={{
      businessProfile,
      isLoading,
      createProfile,
      updateProfile,
      toggleStatus
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);