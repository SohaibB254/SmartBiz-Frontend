import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import Toast from '../../../../components/common/Toast';
import API_HOST from '../../../../config';


const InquiryModal = ({ isOpen, onClose, item }) => {
  const [inquiryText, setInquiryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast State
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    success: false,
    message: ''
  });

  if (!isOpen || !item) return null;

  const handleSend = async () => {
    // Basic validation to prevent sending empty messages
    if (!inquiryText.trim()) {
      setToastConfig({ isVisible: true, success: false, message: "Message cannot be empty." });
      return;
    }

    setIsSubmitting(true);

    try {
      const itemId = item._id || item.id;
        console.log(itemId);

      // Sending only the text message as requested
      const response = await axios.post(`${API_HOST}/inquiry/${itemId}/create-inquiry`,
        { text: inquiryText },
        { withCredentials: true } // Ensures your auth cookie is sent
      );


      // Trigger success toast using the message from your backend
      setToastConfig({
        isVisible: true,
        success: response.data?.success || true,
        message: response.data?.message || 'Inquiry sent successfully!'
      });

      // Clear the text area
      setInquiryText('');

      // Optional: Auto-close the modal after 2 seconds so the user has time to read the toast
      setTimeout(() => {
        onClose();
        setToastConfig({ ...toastConfig, isVisible: false }); // Reset toast
      }, 2000);

    } catch (error) {
      console.error("Inquiry failed:", error);

      // Trigger error toast
      setToastConfig({
        isVisible: true,
        success: false,
        message: error.response?.data?.message || 'Failed to send inquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setInquiryText(''); // Reset text when manually closed
    setToastConfig({ ...toastConfig, isVisible: false });
    onClose();
  };

  const closeToast = () => setToastConfig(prev => ({ ...prev, isVisible: false }));

  return (
    <>
      {/* Toast Notification */}
      {toastConfig.isVisible && (
        <Toast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={closeToast}
        />
      )}

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 transition-all">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-105 p-6 relative border border-gray-100">

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-center text-black mb-2 mt-2">
            Send an Inquiry
          </h2>

          <p className="text-center text-sm text-gray-500 mb-6">
            To: <span className="font-semibold text-gray-800">{item.businessId.title}</span>
          </p>

          {/* Inquiry Text Area */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-black mb-2">
              Your Message
            </label>
            <textarea
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              placeholder="Type your question or requirements here..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e29525] focus:border-transparent resize-none h-32"
            ></textarea>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isSubmitting}
            className="w-full bg-[#e29525] hover:bg-[#c9831f] text-white text-sm font-medium py-3 px-6 rounded-full transition duration-200 disabled:opacity-70 flex justify-center items-center"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

        </div>
      </div>
    </>
  );
};

export default InquiryModal;