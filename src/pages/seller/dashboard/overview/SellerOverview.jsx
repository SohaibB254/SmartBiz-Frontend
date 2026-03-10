import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SellerSidebar from '../components/SellerSideBar';
import { useBusiness } from '../../../../context/BusinessContext';
import { useListing } from '../../../../context/ListingsContext';
import { useSellerOrder } from '../../../../context/SellerOrdersContext';

const SellerOverview = () => {
  const { businessProfile } = useBusiness();
  const { listings, fetchListings } = useListing();
  const { orders, fetchOrders } = useSellerOrder();

  // Fetch fresh data when the dashboard loads
  useEffect(() => {
    fetchListings();
    fetchOrders('all');
  }, []);

  // Calculate dynamic stats
  const totalListings = listings?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status.toLowerCase() === 'pending').length || 0;

  // Grab only the 5 most recent orders for the table
  const recentOrders = orders?.slice(0, 5) || [];

  // Helper for table status text colors based on the screenshot (no pill background, just text color)
  const getStatusTextColor = (status) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 'text-[#e2c525]';
    if (s === 'completed') return 'text-[#1ecb4f]';
    if (s === 'canceled' || s === 'cancelled') return 'text-[#e04524]';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-40 h-18.25 border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#e29525]">SmartBiz</div>
      </header>

      <div className="flex pt-18.25 flex-1">
         {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        {/* Sidebar */}
        <SellerSidebar activeTab="overview" />

        {/* Main Content */}
        <main className="flex-1  p-8 bg-white min-h-[calc(100vh-73px)]">

          {/* Header Area */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Overview</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="flex items-center text-gray-700">
                <span className="mr-2">💼</span> {businessProfile?.title || 'Business'}
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-2">💳</span> Balance: $5672
              </div>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

            {/* Card 1: Total Listings */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
              <div className="text-sm text-gray-400 font-medium mb-2">Total Listings :</div>
              <div className="text-5xl font-semibold text-black text-center my-6">{totalListings}</div>
              <div className="mt-auto">
                <Link to="/seller/listings" className="text-blue-600 text-sm font-medium hover:underline">
                  View all
                </Link>
              </div>
            </div>

            {/* Card 2: Total Orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
              <div className="text-sm text-gray-400 font-medium mb-2">Total Orders :</div>
              <div className="text-5xl font-semibold text-black text-center my-6">{totalOrders}+</div>
              <div className="mt-auto flex justify-between items-end">
                <span className="text-xs text-gray-400">Last 30 days</span>
                <Link to="/seller/orders" className="text-blue-600 text-sm font-medium hover:underline">
                  View all
                </Link>
              </div>
            </div>

            {/* Card 3: Pending Orders */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
              <div className="text-sm text-gray-400 font-medium mb-2">Pending Orders :</div>
              <div className="text-5xl font-semibold text-black text-center my-6">{pendingOrders}</div>
              <div className="mt-auto flex justify-between items-end">
                <span className="text-xs text-gray-400">In this month</span>
                <Link to="/seller/orders" className="text-blue-600 text-sm font-medium hover:underline">
                  View all
                </Link>
              </div>
            </div>

            {/* Card 4: Total Earnings (Mocked) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col shadow-sm">
              <div className="text-sm text-gray-400 font-medium mb-2">Total Earnings :</div>
              <div className="text-5xl font-semibold text-black text-center my-6">$ 356</div>
              <div className="mt-auto">
                <span className="text-xs text-gray-400">In Last 30 days</span>
              </div>
            </div>

          </div>

          {/* Recent Orders Table */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-medium text-black">Recent Orders</h2>
              <Link to="/seller/orders" className="text-blue-600 text-sm font-medium hover:underline">
                View all
              </Link>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm text-left">
                <thead className="bg-white">
                  <tr>
                    <th className="border border-gray-300 px-6 py-3 font-semibold text-black text-center w-24">Id</th>
                    <th className="border border-gray-300 px-6 py-3 font-semibold text-black">Order Details</th>
                    <th className="border border-gray-300 px-6 py-3 font-semibold text-black text-center">Customer</th>
                    <th className="border border-gray-300 px-6 py-3 font-semibold text-black text-center">Order Date</th>
                    <th className="border border-gray-300 px-6 py-3 font-semibold text-black text-center">Status</th>
                    <th className="border border-gray-300 px-6 py-3 font-semibold text-black text-center">Amount</th>
                    {/* Empty header cell to match the screenshot structure */}
                    <th className="border border-gray-300 px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, idx) => (
                      <tr key={order.customOrderId || idx} className="bg-white">
                        <td className="border border-gray-300 px-6 py-4 text-center text-gray-800">{order.customOrderId}</td>
                        <td className="border border-gray-300 px-6 py-4 text-gray-800">{order.item.title}</td>
                        <td className="border border-gray-300 px-6 py-4 text-center text-gray-800">{order.customerId.username}</td>
                        <td className="border border-gray-300 px-6 py-4 text-center text-gray-800">{order.date_placed.split('T')[0]}</td>
                        <td className={`border border-gray-300 px-6 py-4 text-center font-medium ${getStatusTextColor(order.status)}`}>
                          {order.status}
                        </td>
                        <td className="border border-gray-300 px-6 py-4 text-center font-medium text-gray-800">$ {order.amount}</td>
                        <td className="border border-gray-300 px-6 py-4 text-center">
                          {/* Optional view action button, left empty to mimic screenshot or add link */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border border-gray-300 px-6 py-8 text-center text-gray-500">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                  {/* Empty buffer row exactly as seen in the screenshot bottom */}
                  <tr className="bg-white h-10">
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                    <td className="border border-gray-300"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default SellerOverview;