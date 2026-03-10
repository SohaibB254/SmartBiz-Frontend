import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_HOST = 'http://localhost:3000';
const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businessProfile, setBusinessProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on initial mount
  useEffect(() => {
    const storedBusiness = localStorage.getItem('businessProfile');
    if (storedBusiness) {
      setBusinessProfile(JSON.parse(storedBusiness));
    }
    setIsLoading(false);
  }, []);

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