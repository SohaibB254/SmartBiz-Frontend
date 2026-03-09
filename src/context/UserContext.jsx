import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context
const UserContext = createContext();

// 2. Create the Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Loading...',
    email: 'Loading...',
    joinedDate: 'Loading...'
  });

  useEffect(() => {
    // Read from localStorage when the app first loads
    const storedUserStr = localStorage.getItem('user');

    if (storedUserStr) {
      try {
        const parsedUser = JSON.parse(storedUserStr);
        setUser({
          ...parsedUser, // Spread to keep any other data like _id, role, etc.
          name: parsedUser.name || parsedUser.username || 'Sam Julian',
          email: parsedUser.email || 'samj@gmail.com',
          joinedDate: parsedUser.createdAt
            ? new Date(parsedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'February 23 2026'
        });
      } catch (error) {
        console.error("Failed to parse user from local storage");
      }
    } else {
      // Optional fallback if no user is found
      setUser({
        name: 'Guest User',
        email: 'guest@smartbiz.com',
        joinedDate: 'N/A'
      });
    }
  }, []);

  // Provide both the user object and the function to update it
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Create a custom hook so you don't have to import useContext everywhere
export const useUser = () => {
  return useContext(UserContext);
};