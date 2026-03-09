import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket,  User,  ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';
import Sidebar from '../../components/Sidebar';
import { useUser } from '../../../../context/UserContext';

const API_HOST = 'http://localhost:3000';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  //user from context
  const { user } = useUser()
  // Filtering and Modal States
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch orders when the component mounts or when statusFilter changes
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        let endpoint = `${API_HOST}/orders/customer/orders`;

        if (statusFilter !== 'All') {
          endpoint = `${API_HOST}/orders/customer/orders?page=1&limit=10&status=${statusFilter.toLowerCase()}`;
        }

        const response = await axios.get(endpoint, { withCredentials: true });

        setOrders(response.data?.orders || response.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Fallback Mock Data
        setOrders([
          { customOrderId: '3245', title: 'Web Development', sellerName: 'Mark Felix', date: '23-02-2026', status: 'Pending', amount: 435 },
          { customOrderId: 'S-9912', title: 'Web Development', sellerName: 'Mark Felix', date: '23-02-2026', status: 'Completed', amount: 435 },
          { customOrderId: 'P-1023', title: 'Razer Blade Mouse', sellerName: 'Mark Felix', date: '23-02-2026', status: 'Cancelled', amount: 435 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setIsFilterDropdownOpen(false);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-[#e2c525]';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Top Navbar Placeholder (Assuming you have this wrapped in App.jsx usually) */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="text-2xl font-bold text-[#e29525]">SmartBiz</div>
      </header>

      <div className="flex flex-1">
      <Sidebar activeTab={'orders'}/>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white/50">

          {/* Header Row */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Orders</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2" /> {user.name}
              </div>
              <div className="flex items-center text-gray-700">
                <Ticket className="w-4 h-4 mr-2" /> Balance: $5672
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center mb-4 text-sm text-gray-700 space-x-2">
            <span>Page</span>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-medium">01</span>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>

          {/* Data Table */}
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 px-6 py-3 font-semibold text-sm text-gray-900 border-b border-gray-200">
              <div className="col-span-1">Id</div>
              <div className="col-span-2">Order Details</div>
              <div className="col-span-1">Seller</div>
              <div className="col-span-1 flex items-center cursor-pointer">
                Order Date <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
              </div>

              {/* Status Filter Dropdown Header */}
              <div className="col-span-1 relative">
                <div
                  className="flex items-center cursor-pointer hover:text-[#e29525] transition-colors"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                >
                  Status {statusFilter !== 'All' && `(${statusFilter})`} <ChevronDown className="w-4 h-4 ml-1" />
                </div>

                {isFilterDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
                    {['All', 'Pending', 'Completed', 'Cancelled'].map(status => (
                      <div
                        key={status}
                        onClick={() => handleStatusSelect(status)}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${statusFilter === status ? 'bg-gray-100 font-semibold' : ''}`}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-1 text-right">Amount</div>
            </div>

            {/* Table Body */}
            <div className="mt-2 space-y-3">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#e29525]" />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.customOrderId} className="grid grid-cols-7 gap-4 px-6 py-4 items-center bg-white border border-gray-200 rounded-lg text-sm transition-shadow hover:shadow-sm">
                    <div className="col-span-1 text-blue-600">{order.customOrderId}</div>
                    <div className="col-span-2 font-medium text-gray-900">{order.item.title}</div>
                    <div className="col-span-1 text-gray-700">{order.businessId.ownerName}</div>
                    <div className="col-span-1 text-gray-700">{order.date_placed.split('T')[0]}</div>
                    <div className="col-span-1 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(order.status)}`}></span>
                      <span className={order.status === 'Pending' ? 'text-[#e2c525]' : order.status === 'Completed' ? 'text-green-500' : 'text-red-500'}>
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-between items-center">
                      <span className="font-medium text-gray-900">$ {order.amount}</span>
                      <button
                        onClick={() => setSelectedOrderId(order.customOrderId)}
                        className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No orders found for this status.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        customOrderId={selectedOrderId}
      />

    </div>
  );
};

export default OrdersDashboard;