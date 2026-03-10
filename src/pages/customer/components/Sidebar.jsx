import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, MessageSquare, User, LogOut } from 'lucide-react';
import axios from 'axios';
import Toast from '../../../components/common/Toast';

const API_HOST = 'http://localhost:3000'

const Sidebar = ({ activeTab }) => {

    const navigate = useNavigate()
  // Set up state to hold the toast configuration
    const [toastConfig, setToastConfig] = useState({
      isVisible: false,
      success: false,
      message: ''
    });
  // Logout funtion
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
  const navItems = [
    { id: 'orders', label: 'Orders', icon: Ticket, path: '/profile' },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, path: '/profile/inquiries' },
    { id: 'account', label: 'Account', icon: User, path: '/profile/account' },
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
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col  fixed  h-[calc(100vh-73px)] overflow-y-auto shrink-0">
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
                isActive
                  ? 'bg-[#e29525] text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section at the bottom */}
      <div className="p-6 border-t border-gray-100 mt-auto">
        <button
        onClick={handleLogout}
        className="flex items-center text-gray-700 hover:text-red-600 transition-colors font-medium w-full">
          Logout
          <LogOut className="w-5 h-5 ml-auto" />
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;