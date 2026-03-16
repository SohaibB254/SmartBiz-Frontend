import React, { useState, useEffect, useRef } from 'react';
import SellerSidebar from '../components/SellerSidebar.jsx';
import { useSellerInquiry } from '../../../../context/SellerInquiryContext';
import { useBusiness } from '../../../../context/BusinessContext';
import { Briefcase, CreditCard } from 'lucide-react';
import SellerTopNav from '../components/SellerTopNav';

const SellerInquiries = () => {
  // ADDED: closeInquiry from context
  const { inquiries, fetchInquiries, sendMessage, closeInquiry } = useSellerInquiry();
  const { businessProfile } = useBusiness();
  const [activeTab, setActiveTab] = useState('Open'); // 'Open', 'Replied', 'Closed'
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedInquiry?.messages]);

  const getFilteredInquiries = () => inquiries.filter(i => {
    if (activeTab === 'Replied') return i.status.toLowerCase() === 'replied';
    if (activeTab === 'Closed') return i.status.toLowerCase() === 'closed';
    return i.status.toLowerCase() === 'open';
  });

  const getTabCount = (tabName) => {
    if (tabName === 'Replied') return inquiries.filter(i => i.status.toLowerCase() === 'replied').length;
    if (tabName === 'Closed') return inquiries.filter(i => i.status.toLowerCase() === 'closed').length;
    return inquiries.filter(i => i.status.toLowerCase() === 'open').length;
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedInquiry) return;
    setIsSending(true);
    try {
      await sendMessage(selectedInquiry._id, messageInput);

      const newMessage = { senderId: selectedInquiry.sellerId._id, text: messageInput, createdAt: new Date().toISOString() };
      setSelectedInquiry(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
      setMessageInput('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  // ADDED: Function to handle closing the inquiry
  const handleCloseInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      await closeInquiry(selectedInquiry._id);
      // Deselect the inquiry so the UI forces the user to pick a new one,
      // or optionally auto-switch to the Closed tab
      setSelectedInquiry(null);
    } catch (error) {
      console.error("Failed to close inquiry", error);
    }
  };
  // Random seed genrator for dps in inquiry chat
  const seed = Math.random().toString(36).substring(7);
  const avatarUrl = `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;

  return (
    <div className="h-screen bg-white font-sans overflow-hidden">
      {/* Top Nav */}
    <SellerTopNav/>
      <div className="flex  h-full">
         {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        <SellerSidebar activeTab="inquiries" />

        <main className="flex-1 flex flex-col  bg-white min-h-0">
          <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 shrink-0">
            <h1 className="text-3xl font-bold text-black">Inquiries</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
               <div className="text-gray-700 flex gap-2 items-center"><Briefcase size={18}/> {businessProfile?.title || 'Business'}</div>
              <div className="text-gray-700 flex gap-2 items-center"><CreditCard size={18}/> Balance : $5340</div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Left Pane */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col h-full bg-white">
              <div className="flex space-x-2 p-4">
                {['Open','Closed'].map((tab) => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setSelectedInquiry(null); }} className={`relative px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-[#e29525] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {tab}
                    {getTabCount(tab) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {getTabCount(tab) < 10 ? `0${getTabCount(tab)}` : getTabCount(tab)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 pb-4 border-b border-gray-200">
                <input type="text" placeholder="Search Inquiries by name" className="w-full px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {getFilteredInquiries().map((inq) => (
                  <div key={inq._id} onClick={() => setSelectedInquiry(inq)} className={`flex items-center px-4 py-4 border-b border-gray-100 cursor-pointer ${selectedInquiry?._id === inq._id ? 'bg-[#fdf3e7]' : 'hover:bg-gray-50'}`}>
                    {/* Profile pic */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 mr-3">
                      <img src={avatarUrl} alt="" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-sm text-gray-900 truncate">{inq.customerId?.username || 'Customer'}</h3>
                      <p className="text-gray-400 text-xs truncate">{inq.messages[inq.messages.length - 1]?.text || "No messages"}</p>
                    </div>
                  </div>
                ))}

                {getFilteredInquiries().length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No {activeTab.toLowerCase()} inquiries found.
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane */}
            <div className="w-2/3 flex flex-col h-full bg-white">
              {selectedInquiry ? (
                <>
                  <div className="px-8 py-4 border-b border-gray-100 flex items-center shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                      <img src={avatarUrl} alt="" />
                    </div>
                    <h2 className="text-lg font-bold text-black italic">{selectedInquiry.customerId?.username || 'Customer'}</h2>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col">
                    <div className="bg-[#e29525] rounded-xl p-4 text-white max-w-sm self-center w-full mb-8 shrink-0 shadow-sm relative">
                      <div className="text-xs opacity-90 mb-1">Inquiry #{selectedInquiry.uiStaticId}</div>
                      <div className="font-bold text-lg mb-1">{selectedInquiry.item.title}</div>
                      <div className="font-bold mb-1">Price: $ {selectedInquiry.item.price}</div>

                      {/* ADDED: Mark as closed button (Only visible if not already closed) */}
                      {selectedInquiry.status.toLowerCase() !== 'closed' && (
                        <button
                          onClick={handleCloseInquiry}
                          className="text-blue-700 font-medium text-sm hover:underline block mb-4"
                        >
                          [Mark as closed]
                        </button>
                      )}

                      <div className={`text-[10px] text-right opacity-80 italic ${selectedInquiry.status.toLowerCase() === 'closed' ? 'mt-4' : ''}`}>
                        Created At: {selectedInquiry.createdAt?.split('T')[0]}
                      </div>
                    </div>

                    <div className="space-y-6 flex-1 flex flex-col">
                      {selectedInquiry.messages.map((msg, idx) => {
                        const isSeller = msg.senderId === selectedInquiry.sellerId._id;

                        return (
                          <div key={idx} className={`flex flex-col max-w-[70%] ${isSeller ? 'self-end' : 'self-start'}`}>
                            <div className={`px-4 py-3 text-sm text-gray-800 ${isSeller ? 'bg-[#fdf3e7] rounded-2xl rounded-tr-none shadow-sm' : 'bg-white border border-gray-300 rounded-2xl rounded-tl-none'}`}>
                              {msg.text}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Input Area / Closed State */}
                  {selectedInquiry.status.toLowerCase() === 'closed' ? (
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-center shrink-0 text-gray-500 italic text-sm">
                      This inquiry has been closed
                    </div>
                  ) : (
                    <div className="p-6 bg-white border-t border-gray-100 flex items-center shrink-0">
                      <input
                        type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..."
                        disabled={isSending} className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#e29525] disabled:bg-gray-50"
                      />
                      <button onClick={handleSend} disabled={isSending || !messageInput.trim()} className="ml-4 bg-[#1ecb4f] hover:bg-[#19b043] disabled:bg-[#8ee5a7] text-white font-medium px-8 py-3 rounded-full text-sm shadow-sm">
                        {isSending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                 <div className="flex-1 flex items-center justify-center text-gray-400">Select an inquiry from the left to view details.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerInquiries;