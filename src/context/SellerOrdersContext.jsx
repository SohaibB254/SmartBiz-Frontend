import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const API_HOST = 'http://localhost:3000';
const SellerOrderContext = createContext();

export const SellerOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async (status = 'all') => {
    setIsLoading(true);
    try {
      // Setup for future pagination as requested: page=1&limit=10
      const response = await axios.get(`${API_HOST}/orders/seller/orders?page=1&limit=10&status=${status.toLowerCase()}`, {
        withCredentials: true
      });
      setOrders(response.data?.orders || response.data || []);

    } catch (error) {
      console.error("Failed to fetch seller orders:", error);
      // Mock data for UI
      setOrders([
        { customOrderId: '3245', title: 'Web Development', customerName: 'Mark Felix', date: '23-02-2026', status: 'Pending', amount: 435 },
        { customOrderId: 'S-9912', title: 'Web Development', customerName: 'Mark Felix', date: '23-02-2026', status: 'Completed', amount: 435 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (customOrderId, action) => {
    // action should be 'completed' or 'cancelled'
    try {
      const response = await axios.patch(`${API_HOST}/orders/${customOrderId}/${action}`, {}, {
        withCredentials: true
      });
      // Refresh orders list
      await fetchOrders();
      return { success: true, message: `Order marked as ${action}!` };
    } catch (error) {
      throw error;
    }
  };

  return (
    <SellerOrderContext.Provider value={{ orders, isLoading, fetchOrders, updateOrderStatus }}>
      {children}
    </SellerOrderContext.Provider>
  );
};

export const useSellerOrder = () => useContext(SellerOrderContext);