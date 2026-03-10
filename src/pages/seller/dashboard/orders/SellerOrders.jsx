import React, { useState, useEffect } from "react";
import { Briefcase, ChevronDown, CreditCard, Loader2, X } from "lucide-react";
import SellerSidebar from "../components/SellerSideBar";
import { useSellerOrder } from "../../../../context/SellerOrdersContext";
import { useBusiness } from "../../../../context/BusinessContext";
import Toast from "../../../../components/common/Toast";
import SellerTopNav from "../components/SellerTopNav";

// --- Inner Modal Component ---
const SellerOrderModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const handleAction = async (action) => {
    setIsProcessing(true);
    await onStatusUpdate(order.customOrderId, action);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-137.5 p-8 relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-black mb-6">Order Details</h2>

        <div className="text-sm text-black space-y-6">
          <div>
            <p className="font-bold mb-1">Id: {order.customOrderId}</p>
            <p>
              Item/Service:{" "}
              <span className="font-semibold text-[#e29525]">
                {order.item.title}
              </span>
            </p>
            <div className="mt-1 leading-relaxed">
              <p>Timeline:</p>
              <p className="text-gray-600">
                . Order Placed:{" "}
                {order.date_placed.split("T")[0] || "22-02-2026"}
              </p>
              <p className="text-gray-600">. Approved: 22-02-2026</p>
              <p className="text-gray-400">
                . Completed:{" "}
                {order.status === "completed"
                  ? order.date_completion.split("T")[0]
                  : "Pending..."}
              </p>
            </div>
            <div className="mt-3 flex items-center">
              <span className="mr-2">Order status:</span>
              <span
                className={`px-3 py-0.5 rounded-full text-white text-xs font-medium ${order.status === "pending" ? "bg-[#e2c525]" : order.status === "Completed" ? "bg-green-500" : "bg-red-500"}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Dynamic Section (Service vs Product) */}
          {order.order_category === "service" ? (
            <div>
              <h3 className="font-bold text-base mb-2">Your Requirements</h3>
              <p className="mb-2">
                Files uploaded: {order.upload_files}{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  [Download]
                </a>
              </p>
              <div className="flex items-start">
                <span className="mr-2 whitespace-nowrap">Customer Notes:</span>
                <div className="bg-[#fdf3e7] rounded-full px-4 py-1.5 text-black inline-block">
                  {order.customerNotes}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-base mb-2">Delivery Details</h3>
              <p>{order.deliveryAddress}</p>
            </div>
          )}

          <div>
            <h3 className="font-bold text-base mb-2">Payment Details</h3>
            <p className="mb-1">
              Total Amount:{" "}
              <span className="text-[#e29525] font-semibold">
                ${order.amount}
              </span>
            </p>
            <p className="mb-1 flex items-center">
              Payment status:{" "}
              <span className="ml-2 px-2 py-0.5 rounded-full text-white text-xs font-medium bg-green-500">
                Paid
              </span>
            </p>
            <p>
              Payment Method :{" "}
              <span className="font-semibold">{order.paymentMethod}</span>
            </p>
          </div>

          <div className="relative">
            <h3 className="font-bold text-base mb-2">Customer Details</h3>
            <p className="mb-1">Name : {order.customerId.username}</p>
            <p className="mb-1">
              Email :{" "}
              <a href="#" className="text-blue-600 hover:underline">
                {order.customerId.email}
              </a>
            </p>

            {/* Action Buttons (Only visible if pending) */}
            {order.status === "pending" && (
              <div className="absolute bottom-0 right-0 flex space-x-3">
                <button
                  onClick={() => handleAction("completed")}
                  disabled={isProcessing}
                  className="bg-[#1ecb4f] hover:bg-[#19b043] text-white text-sm font-medium py-2 px-6 rounded-full transition duration-200 shadow-sm disabled:opacity-70"
                >
                  {isProcessing ? "Processing..." : "Mark as Completed"}
                </button>
                <button
                  onClick={() => handleAction("cancelled")}
                  disabled={isProcessing}
                  className="bg-[#e04524] hover:bg-[#c93a1c] text-white text-sm font-medium py-2 px-6 rounded-full transition duration-200 shadow-sm disabled:opacity-70"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const SellerOrders = () => {
  const { orders, isLoading, fetchOrders, updateOrderStatus } =
    useSellerOrder();
  const { businessProfile } = useBusiness();
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  const handleStatusUpdate = async (customOrderId, action) => {
    try {
      const result = await updateOrderStatus(customOrderId, action);
      setToastConfig({
        isVisible: true,
        success: true,
        message: result.message,
      });
    } catch (error) {
      setToastConfig({
        isVisible: true,
        success: false,
        message: "Failed to update order status.",
      });
    }
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-[#e2c525]";
    if (status === "completed") return "bg-green-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Nav */}
    <SellerTopNav/>

      {toastConfig.isVisible && (
        <Toast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={() => setToastConfig({ ...toastConfig, isVisible: false })}
        />
      )}

      <div className="flex">
        {/* Empty div to make align horizontal elements  */}
        <div className="w-64"></div>
        <SellerSidebar activeTab="orders" />

        <main className="flex-1 p-8  min-h-[calc(100vh-73px)]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Orders</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="text-gray-700 flex gap-2 items-center">
                <Briefcase size={18} /> {businessProfile?.title || "Business"}
              </div>
              <div className="text-gray-700 flex gap-2 items-center">
                <CreditCard size={18} />
                Balance: $5340
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-7 gap-4 px-6 py-3 font-semibold text-sm text-gray-900 border-b border-gray-200">
              <div className="col-span-1">Id</div>
              <div className="col-span-2">Order Details</div>
              <div className="col-span-1">Customer</div>
              <div className="col-span-1 flex items-center">
                Order Date <ChevronDown className="w-4 h-4 ml-1" />
              </div>

              <div className="col-span-1 relative">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                >
                  Status {statusFilter !== "All" && `(${statusFilter})`}{" "}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
                {isFilterDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
                    {["All", "Pending", "Completed", "Cancelled"].map(
                      (status) => (
                        <div
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsFilterDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                        >
                          {status}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
              <div className="col-span-1 ">Amount</div>
            </div>

            <div className="mt-2 space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#e29525]" />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.customOrderId}
                    className="grid grid-cols-7 gap-4 px-6 py-4 items-center bg-white border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="col-span-1 text-blue-600">
                      {order.customOrderId}
                    </div>
                    <div className="col-span-2 font-medium">
                      {order.item.title}
                    </div>
                    <div className="col-span-1 text-gray-700">
                      {order.customerId.username}
                    </div>
                    <div className="col-span-1 text-gray-700">
                      {order.date_placed.split("T")[0]}
                    </div>
                    <div className="col-span-1 flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(order.status)}`}
                      ></span>
                      <span
                        className={
                          order.status === "pending"
                            ? "text-[#e2c525]"
                            : order.status === "completed"
                              ? "text-green-500"
                              : "text-red-500"
                        }
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-between items-center">
                      <span className="font-medium">$ {order.amount}</span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 font-medium px-2 py-1 hover:underline"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              ): (
                <div className="text-center py-12 text-gray-500">
                  No orders found for this status.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <SellerOrderModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default SellerOrders;
