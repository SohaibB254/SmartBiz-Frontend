import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_HOST = 'http://localhost:3000';

const OrderConfirmationModal = ({ isOpen, onClose, item }) => {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerNotes, setCustomerNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!isOpen || !item) return null;

  const isService = item?.category?.toLowerCase() === 'service';

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        paymentMethod,
        ...(isService ? { customerNotes } : { deliveryAddress })
      };

      // Using item._id
      const itemId = item._id || item.id;

      await axios.post(`${API_HOST}/orders/${itemId}/create-order`, payload, {
        withCredentials: true // Ensures your HTTP-only cookie is sent
      });

      // Show the success modal upon successful request
      setStep('success');
    } catch (error) {
      console.error("Order failed:", error);
      // Optionally handle error state here (e.g., show a toast)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form'); // Reset state when closing
    setCustomerNotes('');
    setDeliveryAddress('');
    onClose();
  };

  // ----------------------------------------
  // SUCCESS VIEW
  // ----------------------------------------
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 transition-all">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-100 p-8 pt-12 pb-10 relative text-center border border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-black mb-6">
            Your Purchase is Confirmed
          </h2>

          <div className="flex items-center justify-center space-x-2 text-sm font-bold">
            <Link to="/profile" className="text-blue-600 hover:underline">
              View Orders
            </Link>
            <span className="text-black text-xs font-normal">or</span>
            <Link to="/marketplace" className="text-blue-600 hover:underline">
              Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------
  // FORM VIEW
  // ----------------------------------------
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-105 p-6 relative border border-gray-100">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-center text-black mb-6 mt-2">
          Confirm your purchase
        </h2>

        {/* Item Details */}
        <div className="flex justify-between items-center text-xs font-bold text-black mb-2 pr-6">
          <span>{isService ? 'Service' : 'Product'} : {item.title}</span>
          <span>Price: $ {item.price}</span>
        </div>
        <div className="text-xs font-bold text-black mb-4">
          Seller : {item.businessId.ownerName}
        </div>

        {/* Dynamic Static Field (Upload vs Quantity) */}
        {isService ? (
          <div className="text-xs font-bold text-black mb-4 flex items-center">
            Upload Files:
            <button className="text-blue-500 font-normal hover:underline ml-1">
              [Upload]
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-black mb-4 flex items-center">
            Quantity:
            <input
              type="text"
              defaultValue="01"
              className="w-12 border border-gray-300 rounded px-1 ml-2 text-center font-normal focus:outline-none"
            />
          </div>
        )}

        {/* Payment Methods */}
        <div className="text-xs font-bold text-black mb-2 flex items-center">
          Payment Method:
       { !isService &&  <label className="inline-flex items-center ml-3 cursor-pointer font-normal">
            <input
              type="checkbox"
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
              className="form-checkbox h-3 w-3 text-blue-600 rounded-sm mr-1 accent-blue-600"
            />
            COD
          </label>}
          <label className="inline-flex items-center ml-3 cursor-pointer font-normal">
            <input
              type="checkbox"
              checked={paymentMethod === 'Wallet'}
              onChange={() => setPaymentMethod('Wallet')}
              className="form-checkbox h-3 w-3 text-blue-600 rounded-sm mr-1 accent-blue-600"
            />
            Wallet
          </label>
        </div>

        {/* Static Card Details */}
        <div className="flex gap-4 mb-2 items-end">
          <div className="flex-1">
            <label className="inline-flex items-center cursor-pointer text-xs font-normal mb-1">
              <input
                type="checkbox"
                checked={paymentMethod === 'Card'}
                onChange={() => setPaymentMethod('Card')}
                className="form-checkbox h-3 w-3 text-blue-600 rounded-sm mr-1 accent-blue-600"
              />
              Card
            </label>
            <input
              type="text"
              placeholder="0000-0000-0000-0000"
              disabled={paymentMethod !== 'Card'}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-gray-400 placeholder-gray-300 focus:outline-none focus:border-blue-400 disabled:bg-gray-50"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-normal mb-1">Security no.</label>
            <input
              type="text"
              placeholder="000"
              disabled={paymentMethod !== 'Card'}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center text-gray-400 placeholder-gray-300 focus:outline-none focus:border-blue-400 disabled:bg-gray-50"
            />
          </div>
        </div>
        <div className="w-24 mb-4">
          <label className="block text-xs font-normal mb-1">Expiry</label>
          <input
            type="text"
            placeholder="12/34"
            disabled={paymentMethod !== 'Card'}
            className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center text-gray-400 placeholder-gray-300 focus:outline-none focus:border-blue-400 disabled:bg-gray-50"
          />
        </div>

        {/* Dynamic Input (Requirements vs Address) */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-black mb-2">
            {isService ? 'Your Requirements' : 'Delivery Address'}
          </label>
          <textarea
            value={isService ? customerNotes : deliveryAddress}
            onChange={(e) => isService ? setCustomerNotes(e.target.value) : setDeliveryAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#e29525] focus:border-transparent resize-none h-20"
          ></textarea>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-[#e29525] hover:bg-[#c9831f] text-white text-xs font-medium py-2 px-6 rounded-full transition duration-200 disabled:opacity-70"
        >
          {isSubmitting ? 'Processing...' : 'Confirm'}
        </button>

      </div>
    </div>
  );
};

export default OrderConfirmationModal;