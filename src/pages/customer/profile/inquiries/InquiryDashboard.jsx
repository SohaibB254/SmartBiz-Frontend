import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Ticket } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useUser } from '../../../../context/UserContext';
import { Link } from 'react-router-dom';
import TopNav from '../../components/TopNav';

const API_HOST = 'http://localhost:3000';

const InquiriesDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Open'); // 'Open', 'Sent', 'Closed'
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  // Add a loading state for the send button
  const [isSending, setIsSending] = useState(false);
  // 1. Create a reference for the bottom of the message list
  const messagesEndRef = useRef(null);
  // 2. Create a function to smoothly scroll to that reference
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

// User from user context

const { user } = useUser()
  // Helper to generate a stable random 4-digit ID for UI display
  const generateRandomId = () => Math.floor(1000 + Math.random() * 9000);

  useEffect(() => {
      const fetchInquiries = async () => {
          setIsLoading(true);
          try {
              const response = await axios.get(`${API_HOST}/inquiry/customer/inquiries`, {
                  withCredentials: true
                });

                // Map over data to attach a stable random ID for the UI
                const fetchedData = (response.data?.inquiries || response.data || []).map(inq => ({
                    ...inq,
          uiStaticId: generateRandomId()
        }));

        setInquiries(fetchedData);
    } catch (error) {
        console.error("Failed to fetch inquiries:", error);


        // Robust Mock Data mimicking your backend's exact nested structure
        const mockData = [
            {
                _id: 'inq_1',
                status: 'Open',
            createdAt: '2026-02-23T10:53:35.935Z',
            uiStaticId: 4256,
            customerId: { _id: 'cust_1' },
            sellerId: { _id: 'seller_1' },
            item: {
              title: 'Web Development-Basic Offer',
              price: 89,
              businessId: { ownerName: 'Vu Cooders' }
            },
            messages: [
              { senderId: 'cust_1', text: 'Can you convert this figma to next Js?', createdAt: '2026-02-23T21:23:00.000Z' },
              { senderId: 'seller_1', text: 'Yea sure!', createdAt: '2026-02-23T22:02:00.000Z' },
              { senderId: 'cust_1', text: 'Thanks a lot❤', createdAt: '2026-02-23T22:05:00.000Z' }
            ]
          },
          {
            _id: 'inq_2',
            status: 'Replied', // Maps to "Sent" tab
            createdAt: '2026-02-22T10:53:35.935Z',
            uiStaticId: 1024,
            customerId: { _id: 'cust_1' },
            sellerId: { _id: 'seller_2' },
            item: {
              title: 'HTML Page design',
              price: 45,
              businessId: { ownerName: 'Sams Tech' }
            },
            messages: [
              { senderId: 'cust_1', text: 'I need help in this html page...', createdAt: '2026-02-22T14:23:00.000Z' }
            ]
          },
          {
            _id: 'inq_3',
            status: 'Closed',
            createdAt: '2026-02-20T10:53:35.935Z',
            uiStaticId: 8832,
            customerId: { _id: 'cust_1' },
            sellerId: { _id: 'seller_3' },
            item: {
              title: 'Graphic Design Project',
              price: 150,
              businessId: { ownerName: "Billi's Graphic Design" }
            },
            messages: [
              { senderId: 'cust_1', text: 'What about my project?', createdAt: '2026-02-20T09:00:00.000Z' },
              { senderId: 'seller_3', text: 'It is completed and delivered.', createdAt: '2026-02-20T10:00:00.000Z' }
            ]
          }
        ];
        setInquiries(mockData);
        // Auto-select the first open inquiry
        const firstOpen = mockData.find(i => i.status.toLowerCase() === 'open');
        if (firstOpen) setSelectedInquiry(firstOpen);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);
  useEffect(()=>{
      scrollToBottom();
  },[selectedInquiry?.messages])
  // The function to handle sending a new message
  const handleSendMessage = async () => {
    // Don't send if the input is empty or just spaces
    if (!messageInput.trim() || !selectedInquiry) return;

    setIsSending(true);
    try {
      const payload = { text: messageInput };

      const response = await axios.post(
        `${API_HOST}/inquiry/${selectedInquiry._id}/message`,
        payload,
        { withCredentials: true } // Don't forget this so your cookies are sent!
      );

      // Create a local message object to instantly update the UI
      // (assuming the logged-in user is the customer here)
      const newMessage = {
        senderId: selectedInquiry.customerId._id,
        text: messageInput,
      };

      // 1. Update the currently selected inquiry
      const updatedInquiry = {
        ...selectedInquiry,
        messages: [...selectedInquiry.messages, newMessage]
      };
      setSelectedInquiry(updatedInquiry);

      // 2. Update the main list of inquiries so the sidebar preview updates too
      setInquiries((prevInquiries) =>
        prevInquiries.map((inq) =>
          inq._id === selectedInquiry._id ? updatedInquiry : inq
        )
      );

      // Clear the input field
      setMessageInput('');
    } catch (error) {
      console.error("Failed to send message:", error);
      // If you still have the Toast component setup, you could trigger an error toast here!
    } finally {
      setIsSending(false);
    }
  };

  // Helper to allow sending by pressing the "Enter" key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Format Helpers
  const formatDate = (isoString) => isoString ? isoString.split('T')[0] : '';
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  };

  // Filter logic for tabs
  const openInquiries = inquiries.filter(i => i.status.toLowerCase() === 'open');
  const sentInquiries = inquiries.filter(i => i.status.toLowerCase() === 'replied');
  const closedInquiries = inquiries.filter(i => i.status.toLowerCase() === 'closed');

  const getFilteredInquiries = () => {
    if (activeTab === 'Open') return openInquiries;
    if (activeTab === 'Sent') return sentInquiries;
    if (activeTab === 'Closed') return closedInquiries;
    return [];
  };

  // Select the appropriate count for the tab badges
  const getTabCount = (tabName) => {
    if (tabName === 'Open') return openInquiries.length;
    if (tabName === 'Sent') return sentInquiries.length;
    if (tabName === 'Closed') return closedInquiries.length;
    return 0;
  };

  return (
    <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">
      {/* Top Navbar Placeholder */}
     {/* Top Navbar Placeholder */}
    <TopNav/>

      <div className="flex flex-1 overflow-hidden">
         {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        {/* Sidebar Component */}
        <Sidebar activeTab="inquiries" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">

          {/* Header */}
          <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
            <h1 className="text-3xl font-bold text-black">Inquiries</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2" /> {user.name}
              </div>
              <div className="flex items-center text-gray-700">
                <Ticket className="w-4 h-4 mr-2" /> Balance: $5672
              </div>
            </div>
          </div>

          {/* Split Pane Interface */}
          <div className="flex flex-1 overflow-hidden min-h-0">

            {/* Left Pane: Inquiry List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">

              {/* Tabs */}
              <div className="flex space-x-2 p-4">
                {['Open', 'Sent', 'Closed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedInquiry(null); // Reset selection on tab change
                    }}
                    className={`relative px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-[#e29525] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tab}
                    {/* Notification Badge */}
                    {getTabCount(tab) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {getTabCount(tab) < 10 ? `0${getTabCount(tab)}` : getTabCount(tab)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="px-4 pb-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search Inquiries by name"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]"
                />
              </div>

              {/* List of Inquiries */}
              <div className="flex-1 overflow-y-auto">
                {getFilteredInquiries().map((inq) => {
                  const isSelected = selectedInquiry?._id === inq._id;
                  const latestMessage = inq.messages[inq.messages.length - 1]?.text || "No messages yet";

                  return (
                    <div
                      key={inq._id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`flex items-center px-4 py-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#fdf3e7]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full text-xl bg-gray-200 shrink-0 mr-3">
                        {inq.item.businessId.ownerName.split(' ')[2]}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-bold text-sm text-gray-900 truncate">
                          {inq.item.businessId.title}
                        </h3>
                        <p className="text-gray-400 text-xs truncate">{latestMessage}</p>
                      </div>
                    </div>
                  );
                })}
                {getFilteredInquiries().length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No {activeTab.toLowerCase()} inquiries found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Chat Interface */}
            <div className="w-2/3 flex flex-col bg-white">
              {selectedInquiry ? (
                <>
                  {/* Chat Header */}
                  <div className="px-8 py-4 border-b border-gray-100 flex items-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 shrink-0"></div>
                    <h2 className="text-lg font-bold text-black italic">
                      {selectedInquiry.item.businessId.title}
                    </h2>
                  </div>

                  {/* Chat Body */}
                  <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col">

                    {/* Item Detail Card */}
                    <div className="bg-[#e29525] rounded-xl p-4 text-white max-w-sm self-center w-full mb-8 shadow-sm">
                      <div className="text-xs opacity-90 mb-1">Inquiry #{selectedInquiry.uiStaticId}</div>
                      <div className="font-bold text-lg leading-tight mb-1">{selectedInquiry.item.title}</div>
                      <div className="font-bold mb-1">Price: $ {selectedInquiry.item.price}</div>
                      <Link to={`/details/${selectedInquiry.itemType}/${selectedInquiry.item._id}`} className="text-blue-700 font-medium text-sm hover:underline block mb-4">
                        [Place Order]
                      </Link>
                      <div className="text-[10px] text-right opacity-80 italic">
                        Created At: {formatDate(selectedInquiry.createdAt)}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="space-y-6 flex-1 flex flex-col">
                      {selectedInquiry.messages.map((msg, idx) => {
                        // Assuming the logged in user is the customer.
                        // Customer messages align Right (white), Seller messages align Left (yellow)
                        const isCustomer = msg.senderId === selectedInquiry.customerId._id;

                        return (
                          <div key={idx} className={`flex flex-col max-w-[70%] ${isCustomer ? 'self-end' : 'self-start'}`}>
                            <div className={`px-4 py-3 text-sm text-gray-800 ${
                              isCustomer
                                ? 'bg-white border border-gray-300 rounded-2xl rounded-tr-none shadow-sm'
                                : 'bg-[#fdf3e7] rounded-2xl rounded-tl-none'
                            }`}>
                              {msg.text}
                            </div>
                            <span className={`text-[10px] text-gray-400 mt-1 italic ${isCustomer ? 'text-right' : 'text-left'}`}>
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        );
                      })}
                      {/* Invisible Div for scrolling  */}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                {/* Message Input (Hidden if Closed) */}
                  {selectedInquiry.status.toLowerCase() !== 'closed' && (
                    <div className="p-6 bg-white border-t border-gray-100 flex items-center shrink-0">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyPress} // Added Enter key support
                        placeholder="Type a message..."
                        disabled={isSending}
                        className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#e29525] disabled:bg-gray-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSending || !messageInput.trim()} // Disable if empty or sending
                        className="ml-4 bg-[#1ecb4f] hover:bg-[#19b043] disabled:bg-[#8ee5a7] text-white font-medium px-8 py-3 rounded-full text-sm transition-colors shadow-sm"
                      >
                        {isSending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select an inquiry from the left to view details.
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default InquiriesDashboard;