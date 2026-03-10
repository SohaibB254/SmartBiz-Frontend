import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";
import RedConfirmationModal from "../../../../components/common/RedConfirmationModal";
import Toast from "../../../../components/common/Toast";

const API_HOST = "http://localhost:3000";

const OrderDetailsModal = ({ isOpen, onClose, customOrderId }) => {
  // For canceallation modal
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Set up state to hold the toast configuration
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    success: false,
    message: ''
  });
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!customOrderId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_HOST}/orders/view/${customOrderId}`,
          {
            withCredentials: true,
          },
        );
        setOrderDetail(response.data?.order || response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        // Mock data fallback for visualization
        setOrderDetail({
          customOrderId: customOrderId,
          itemType: customOrderId.includes("S") ? "Service" : "Product", // Just a mock check
          title: customOrderId.includes("S")
            ? "Web Development-Basic Offer"
            : "Razer Blade Mouse",
          orderDate: "22-02-2026",
          approvedDate: "22-02-2026",
          completedDate: "25-02-2026",
          status: "Pending",
          amount: 324,
          paymentStatus: "Paid",
          paymentMethod: "Paypal",
          sellerName: "Sam William",
          sellerEmail: "samw@gmail.com",
          businessName: "Vu Cooders",
          // Service specific mock
          files: "design.fig",
          customerNotes: "Please convert this figma design to working website",
          // Product specific mock
          deliveryAddress: "House no #23, Downtown, Main Market",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchOrderDetails();
    }

  }, [isOpen, customOrderId]);
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.patch(`${API_HOST}/orders/${orderId}/cancelled`)
       setToastConfig({
        isVisible: true,
        success: response.data.success,
        message: response.data.message
      });

    } catch (error) {
      console.log(error.message)
    }
   setShowCancelConfirm(false);
 }
  const closeToast = () => {
  setToastConfig(prev => ({ ...prev, isVisible: false }));
};

  if (!isOpen) return null;

  return (
    <>
      {toastConfig.isVisible && (
        <Toast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={closeToast}
        />
      )}
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/40 backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-137.5 p-8 relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-black mb-6">Order Details</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#e29525]" />
          </div>
        ) : orderDetail ? (
          <div className="text-sm text-black space-y-6">
            {/* Top Section */}
            <div>
              <p className="font-bold mb-1">Id: {orderDetail.customOrderId}</p>
              <p>
                Item/Service:{" "}
                <span className="font-semibold text-[#e29525]">
                  {orderDetail.item.title}
                </span>
              </p>
              <div className="mt-1 leading-relaxed">
                <p>Timeline:</p>
                <p className="text-gray-600">
                  . Order Placed: {orderDetail.date_placed.split('T')[0]}
                </p>
                {orderDetail.order_category === "service" &&
                  orderDetail.date_approval && (
                    <p className="text-gray-600">
                      . Approved: {orderDetail.date_approval}
                    </p>
                  )}
                <p className="text-gray-400">
                  . Completed:{" "}
                  {orderDetail.status === "completed"
                    ? orderDetail.date_completion
                    : "pending..."}
                </p>
              </div>
              <div className="mt-3 flex items-center">
                <span className="mr-2">Order status:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-white text-xs font-medium ${
                    orderDetail.status === "pending"
                      ? "bg-[#e2c525]"
                      : orderDetail.status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                  }`}
                >
                  {orderDetail.status}
                </span>
              </div>
            </div>

            {/* Dynamic Section (Service vs Product) */}
            {orderDetail.order_category === "service" ? (
              <div>
                <h3 className="font-bold text-base mb-2">Your Requirements</h3>
                <p className="mb-2">
                  Files uploaded: {orderDetail.files}{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    [Download]
                  </a>
                </p>
                <div className="flex items-start">
                  <span className="mr-2 whitespace-nowrap">
                    Customer Notes:
                  </span>
                  <div className="bg-[#fdf3e7] rounded-full px-4 py-1.5 text-black inline-block">
                    {orderDetail.customerNotes}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-base mb-2">Delivery Details</h3>
                <p>{orderDetail.deliveryAddress}</p>
              </div>
            )}

            {/* Payment Details */}
            <div>
              <h3 className="font-bold text-base mb-2">Payment Details</h3>
              <p className="mb-1">
                Total Amount:{" "}
                <span className="text-[#e29525] font-semibold">
                  ${orderDetail.amount}
                </span>
              </p>
              <p className="mb-1 flex items-center">
                Payment status:
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full ${orderDetail.paymentStatus == 'paid' ? 'bg-green-500': 'bg-[#e2c525]'} text-white text-xs font-medium `}
                >
                  {orderDetail.paymentStatus}
                  Paid
                </span>
              </p>
              <p>
                Payment Method :{" "}
                <span className="font-semibold">
                  {orderDetail.paymentMethod}
                </span>
              </p>
            </div>

            {/* Seller Details */}
            <div className="relative">
              <h3 className="font-bold text-base mb-2">Seller Details</h3>
              <p className="mb-1">Name : {orderDetail.businessId.ownerName}</p>
              <p className="mb-1">
                Email :{" "}
                <a
                  href={`mailto:${orderDetail.sellerId.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {orderDetail.sellerId.email}
                </a>
              </p>
              <p>Business Name : {orderDetail.businessId.title}</p>

              {/* Conditional Cancel Button */}
              {orderDetail.status === "pending" && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="absolute bottom-0 right-0 bg-[#e04524] hover:bg-[#c93a1c] text-white text-sm font-medium py-2 px-6 rounded-full transition duration-200 shadow-sm"
                >
                  Cancel Order
                </button>
              )}
              {/* Render the generic confirmation modal on top */}
              <RedConfirmationModal
                isOpen={showCancelConfirm}
                onClose={() => setShowCancelConfirm(false)}
                onConfirm={()=> handleCancelOrder(orderDetail.customOrderId)}
                message="By confirming your order will be cancelled and a refund will be deposited in your wallet soon."
                note="This action cannot be undone"
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 py-10">
            Error loading order details.
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default OrderDetailsModal;
