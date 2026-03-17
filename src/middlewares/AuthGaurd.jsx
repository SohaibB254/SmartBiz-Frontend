import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import API_HOST from '../config';


// A shared loading component to keep things clean
const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader2 className="w-10 h-10 animate-spin text-[#e29525]" />
  </div>
);

// ----------------------------------------------------
// Protects routes that require the user to be logged in
// ----------------------------------------------------
export const RequireAuth = () => {
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Send a request to your backend to verify the httpOnly cookie
        const response = await axios.get(`${API_HOST}/auth/verify`, { withCredentials: true });
        setAuthStatus('authenticated');

      } catch (error) {
        // If the backend returns a 401 Unauthorized, the cookie is missing or invalid
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();

  }, []);

  if (authStatus === 'checking') {
    return <FullScreenLoader />;
  }

  // If no valid cookie exists, redirect to login ("/")
  if (authStatus === 'unauthenticated') {
    return <Navigate to="/" replace />;
  }

  // If cookie is valid, render the requested child route
  return <Outlet />;
};

// ----------------------------------------------------
// Prevents logged-in users from seeing the login/signup pages
// ----------------------------------------------------
export const RequireNoAuth = () => {
  const [authStatus, setAuthStatus] = useState('checking');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_HOST}/auth/verify`, { withCredentials: true });
        setAuthStatus('authenticated');
      } catch (error) {
        setAuthStatus('unauthenticated');

      }
    };
    checkAuth();
  }, []);

  if (authStatus === 'checking') {
    return <FullScreenLoader />;
  }

  // If a valid cookie exists, redirect straight to the marketplace
  if (authStatus === 'authenticated') {
    return <Navigate to="/marketplace" replace />;
  }

  // If no valid cookie, allow them to see the login page
  return <Outlet />;
};