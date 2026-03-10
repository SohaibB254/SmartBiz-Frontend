import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import SellerSidebar from '../components/SellerSideBar';
import { useListing } from '../../../../context/ListingsContext';
import Toast from '../../../../components/common/Toast';


const API_HOST = 'http://localhost:3000'
const ManageListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, updateListing, toggleStatus } = useListing();
  const fileInputRef = useRef(null);

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, success: false, message: '' });

  // Form State for Editing
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({ title: '', price: '', description: '' });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getListingById(id);
        setItem(data.item);
        // Pre-fill form state
        setFormData({ title: data.title, price: data.price, description: data.description });
        setImagePreview(`${API_HOST}/${data.item.image}` || '');
      } catch (error) {
        setToastConfig({ isVisible: true, success: false, message: "Could not load item details." });
        // Fallback mock data for visualization if API fails
        setItem({ _id: id, title: 'Web Development', price: 78, description: 'Detailed info...', status: 'active', type: 'Service' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleStatusToggle = async () => {
    setIsProcessing(true);
    try {
      const result = await toggleStatus(id, item.status || 'active');
      setItem(prev => ({ ...prev, status: result.newStatus }));
      setToastConfig({ isVisible: true, success: true, message: result.message });
    } catch (error) {
      setToastConfig({ isVisible: true, success: false, message: "Failed to update status." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description);
    if (imageFile) submitData.append('image', imageFile);

    try {
      const result = await updateListing(id, submitData);
      setToastConfig({ isVisible: true, success: true, message: result.message });
      // Update local view state
      setItem(prev => ({ ...prev, title: formData.title, price: formData.price, description: formData.description, imageUrl: imagePreview }));
      setIsEditing(false);
    } catch (error) {
      setToastConfig({ isVisible: true, success: false, message: error.response?.data?.message || "Failed to update." });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center">Item not found.</div>;

  const isDeactivated = item.status === 'deactivate';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="text-2xl font-bold text-[#e29525]">SmartBiz</div>
      </header>

      {toastConfig.isVisible && <Toast success={toastConfig.success} message={toastConfig.message} onClose={() => setToastConfig({...toastConfig, isVisible: false})} />}

      <div className="flex flex-1 overflow-hidden">
        <SellerSidebar activeTab="listings" />

        <main className="flex-1 p-8 bg-gray-50/30 overflow-y-auto flex justify-center">

          <div className="w-full max-w-3xl bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">

            {/* Banner Image */}
            <div className="w-full h-87.5 bg-blue-100 rounded-3xl overflow-hidden mb-8 relative">
              <img
                src={imagePreview || "https://placehold.co/800x400/e2e8f0/64748b?text=Item"}
                alt="Listing"
                className="w-full h-full object-cover mix-blend-multiply"
              />
              {isEditing && (
                <>
                  <button onClick={() => fileInputRef.current.click()} className="absolute top-4 right-4 bg-white/80 p-2 rounded hover:bg-white transition-colors shadow-sm">
                    <Edit className="w-5 h-5 text-gray-900" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                  }} className="hidden" accept="image/*" />
                </>
              )}
            </div>

            {/* --- VIEW MODE --- */}
            {!isEditing ? (
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h1 className="text-3xl font-bold text-black">{item.title}</h1>
                  <span className="text-3xl font-bold text-black">$ {item.price}</span>
                </div>

                <div className="text-[#e29525] font-semibold text-lg mb-8 capitalize">
                  {item.category || 'Service'}
                </div>

                <div className="mb-10">
                  <h2 className="font-bold text-gray-900 text-lg mb-2">Description:</h2>
                  <p className="text-gray-500 whitespace-pre-line leading-relaxed max-w-2xl">{item.description}</p>
                </div>

                <div className="flex space-x-4">
                  <button onClick={() => setIsEditing(true)} className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors">
                    Update
                  </button>
                  <button
                    onClick={handleStatusToggle} disabled={isProcessing}
                    className={`${isDeactivated ? 'bg-[#1ecb4f] hover:bg-[#19b043]' : 'bg-[#e04524] hover:bg-[#c93a1c]'} text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors disabled:opacity-70`}
                  >
                    {isProcessing ? 'Processing...' : (isDeactivated ? 'Activate' : 'Deactivate')}
                  </button>
                </div>
              </div>

            // --- EDIT MODE ---
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Title</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-2">Price</label>
                    <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-900 mb-2">Description</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525] h-32 resize-none"></textarea>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" disabled={isProcessing} className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors disabled:opacity-70">
                    {isProcessing ? 'Updating...' : 'Update'}
                  </button>
                  <button type="button" onClick={() => { setIsEditing(false); setImagePreview(item.imageUrl || ''); }} className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-full transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageListing;