import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import OrderConfirmationModal from "./customer/profile/orders/OrderConfirmationModal";
import InquiryModal from "./customer/profile/inquiries/InquiryModal";

const API_HOST = "http://localhost:3000";

const ItemDetails = () => {
  // for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // for inquiry modal
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  // Extract category and id from the URL params
  const { category, id } = useParams();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true);
      try {
        // Automatically append 's' to the category (e.g., 'product' -> 'products')
        const endpointCategory = `${category.toLowerCase()}s`;
        const endpoint = `${API_HOST}/${endpointCategory}/${id}/view`;

        const response = await axios.get(endpoint);
        setItem(response.data?.item || response.data);
      } catch (err) {
        console.error("Failed to fetch item details:", err);
        setError("Could not load item details. Please try again later.");

        // Mock data fallback for visualization if server is offline
        setItem({
          id,
          title: "Web development",
          price: 78,
          category: category || "Service",
          description:
            "This is a service provided by someone\nwho is good at web development and This is a service provided by someone\nwho is good at web development and.",
          providerName: "James julian",
          providerId: "bus_123",
          imageUrl:
            "https://placehold.co/1200x600/e2e8f0/64748b?text=Illustration",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id && category) {
      fetchItemDetails();
    }
  }, [id, category]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e29525]"></div>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center text-red-500 font-medium">
          {error}
        </div>
      </div>
    );
  }

  // Dynamic values based on category
  const isService = item?.category?.toLowerCase() === "service";
  const actionButtonText = isService ? "Make a booking" : "Place order";
  const imageUrl = `${API_HOST}/${item.image}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-10 bg-white shadow-sm border border-gray-100 rounded-b-xl mt-4">
        {/* Banner Image */}
        <div className="w-full h-87.5 md:h-112.5 bg-blue-100 rounded-4xl overflow-hidden mb-8">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        {/* Title and Price Row */}
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-3xl font-bold text-black">{item.title}</h1>
          <span className="text-3xl font-bold text-black">$ {item.price}</span>
        </div>

        {/* Category Badge/Text */}
        <div className="text-[#e29525] font-semibold text-lg mb-8 capitalize">
          {item.category}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Description:</h2>
          <p className="text-gray-400 whitespace-pre-line leading-relaxed max-w-2xl">
            {item.description}
          </p>
        </div>

        {/* Provider Info */}
        <div className="text-sm font-medium text-gray-900 mb-12">
          Provided by: <span className="mr-2">{item.providerName}</span>
          <Link
            to={`/business/${item.providerId}`}
            className="text-blue-600 hover:underline font-normal"
          >
            View Business
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full transition duration-200"
          >
            {actionButtonText}
          </button>
          {/*  Order confirmation modal */}
          <OrderConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            item={item}
          />

          <div className="text-sm text-gray-900">
            Have a question?{" "}
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="text-blue-600 hover:underline font-normal"
            >
              Generate an inquiry
            </button>
          </div>
          {/* Inquiry modal */}
          <InquiryModal
            isOpen={isInquiryModalOpen}
            onClose={() => setIsInquiryModalOpen(false)}
            item={item}
          />
        </div>
      </main>
    </div>
  );
};

export default ItemDetails;
