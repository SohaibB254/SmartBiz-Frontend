import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Layers, Ticket, MessageSquare, User, LogOut } from 'lucide-react';
import { useBusiness } from '../../../../context/BusinessContext';
import Toast from '../../../../components/common/Toast';
import axios from 'axios';

const API_HOST = 'http://localhost:3000'

const SellerSidebar = ({ activeTab, isLocked = false }) => {
  const { businessProfile } = useBusiness();

  const navigate = useNavigate()
  // Set up state to hold the toast configuration
    const [toastConfig, setToastConfig] = useState({
      isVisible: false,
      success: false,
      message: ''
    });
  // Logout function
  const handleLogout = async ()=>{
    try {
      const response = await axios.post(`${API_HOST}/auth/logout`)
       setToastConfig({
        isVisible: true,
        success: response.data.success,
        message: response.data.message
      });
      navigate('/')
    } catch (error) {
      setToastConfig({
       isVisible: true,
       success: false,
       message: "Error logging out"
     });

    }
  }
  const closeToast = () => {
  setToastConfig(prev => ({ ...prev, isVisible: false }));
};

  // Dynamically change text based on business type (defaults to product labels)
  const isProductBased = businessProfile?.businessType !== 'Service Based';
  const listingsLabel = isProductBased ? 'My Listings' : 'My Services';
  const ordersLabel = isProductBased ? 'Orders' : 'Bookings';

  // Navigation structure updated to match the new screenshot exactly
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/seller/overview' },
    { id: 'business-profile', label: 'Business Profile', icon: Briefcase, path: '/seller/profile' },
    { id: 'listings', label: listingsLabel, icon: Layers, path: '/seller/listings' },
    { id: 'orders', label: ordersLabel, icon: Ticket, path: '/seller/orders' },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, path: '/seller/inquiries' },
    { id: 'account', label: 'Account', icon: User, path: '/seller/account' },
  ];

  return (
    <>
     {toastConfig.isVisible && (
        <Toast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={closeToast}
        />
      )}
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col fixed top-18.7 h-[calc(100vh-73px)] overflow-y-auto shrink-0">

      {/* Navigation Links */}
      <nav className={`flex-1 flex flex-col mt-4 space-y-1 ${isLocked ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-3.5 text-[15px] transition-colors ${
                isActive && !isLocked
                  ? 'bg-[#e29525] text-white font-medium'
                  : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon
                className="w-5 h-5 mr-3"
                strokeWidth={isActive && !isLocked ? 2 : 1.5}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section at the bottom */}
      <div className="p-6 mt-auto">
        <button
        onClick={handleLogout}
        className="flex items-center text-gray-800 hover:text-red-600 transition-colors text-[15px] font-medium w-full">
          <LogOut className="w-5 h-5 mr-2 text-[#b04a62]" strokeWidth={1.5} />
          Logout
          {/* Matches the specific reddish/pink stroke color from the screenshot */}
        </button>
      </div>

    </aside>
    </>
  );
};

export default SellerSidebar;