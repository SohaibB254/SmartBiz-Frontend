import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import API_HOST from '../config';

const SellerInquiryContext = createContext();

export const SellerInquiryProvider = ({ children }) => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_HOST}/inquiry/seller/inquiries`, {
        withCredentials: true
      });
      // Attach a random UI ID just like the customer side
      const fetchedData = (response.data?.inquiries || response.data || []).map(inq => ({
        ...inq, uiStaticId: Math.floor(1000 + Math.random() * 9000)
      }));
      setInquiries(fetchedData);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
      // Mock Data
      setInquiries([
         {
            _id: 'inq_1', status: 'Open', createdAt: '2026-02-23T10:53:35.935Z', uiStaticId: 4256,
            customerId: { _id: 'cust_1', name: 'King Bob' },
            sellerId: { _id: 'seller_1' },
            item: { title: 'Web Development-Basic Offer', price: 89 },
            messages: [
              { senderId: 'cust_1', text: 'Can you convert this figma to next Js?', createdAt: '2026-02-23T21:23:00.000Z' },
              { senderId: 'seller_1', text: 'Yea sure!', createdAt: '2026-02-23T22:02:00.000Z' }
            ]
          }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
//  Close inquiry method

  const closeInquiry = async (inquiryId) => {
    try {
      await axios.patch(`${API_HOST}/inquiry/${inquiryId}/closed`, {}, {
        withCredentials: true
      });
      // Refresh the list to move the inquiry to the 'Closed' tab
      await fetchInquiries();
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
//   Send message method
  const sendMessage = async (inquiryId, text) => {
    try {
      await axios.post(`${API_HOST}/inquiry/${inquiryId}/message`, { text }, {
        withCredentials: true
      });
      // Refresh list to get new message
      await fetchInquiries();
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
  return (
    <SellerInquiryContext.Provider value={{ inquiries, isLoading, fetchInquiries, sendMessage, closeInquiry }}>
      {children}
    </SellerInquiryContext.Provider>
  );
};

export const useSellerInquiry = () => useContext(SellerInquiryContext);