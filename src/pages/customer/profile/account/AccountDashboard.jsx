import React, { useState, useEffect } from 'react';
import { User, Ticket, Edit } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useUser } from '../../../../context/UserContext';

const AccountDashboard = () => {
const { user } = useUser()

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Top Navbar Placeholder */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="text-2xl font-bold text-[#e29525]">SmartBiz</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar activeTab="account" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-white p-8 overflow-y-auto">

          {/* Header Row */}
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-black">Account</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2" /> {user.name}
              </div>
              <div className="flex items-center text-gray-700">
                <Ticket className="w-4 h-4 mr-2" /> Balance: $5672
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-black mb-6 border-b border-gray-200 pb-2 flex justify-between items-end">
              Personal Details
            </h2>

            <div className="relative">
              {/* Edit Icon */}
              <button className="absolute top-0 right-0 p-2 text-gray-700 hover:text-black transition-colors">
                <Edit className="w-5 h-5" />
              </button>

              <div className="space-y-6 text-sm">

                <div>
                  <p className="font-bold text-black">Name:</p>
                  <p className="text-gray-400">{user.name}</p>
                </div>

                <div>
                  <p className="font-bold text-black">Email:</p>
                  <p className="text-gray-400">{user.email}</p>
                </div>

                <div>
                  <p className="font-bold text-black">Joined:</p>
                  <p className="text-gray-400">{user.joinedDate}</p>
                </div>

                <div className="pt-4">
                  <button className="border border-black text-black hover:bg-gray-50 font-medium py-2 px-6 rounded-full transition duration-200">
                    Update Password
                  </button>
                </div>

              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default AccountDashboard;