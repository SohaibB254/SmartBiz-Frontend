import React, { useState, useRef } from 'react';
import { Edit } from 'lucide-react';
import SellerSidebar from '../components/SellerSidebar.jsx';
import { useBusiness } from '../../../../context/BusinessContext';
import Toast from '../../../../components/common/Toast';
import { useListing } from '../../../../context/ListingsContext';
import SellerTopNav from '../components/SellerTopNav';

const API_HOST = 'http://localhost:3000'

const BusinessProfile = () => {

  const { listings } = useListing()
  const { businessProfile, updateProfile, toggleStatus } = useBusiness();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, success: false, message: '' });

// Business banner image url

const imageUrl = `${API_HOST}/${businessProfile?.image}`

  // Edit Form State (pre-filled from context)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(imageUrl || '');
  const [formData, setFormData] = useState({
    title: businessProfile?.title || '',
    businessType: businessProfile?.businessType || '',
    ownerName: businessProfile?.ownerName || '',
    description: businessProfile?.description || ''
  });

  // Early return or redirect if no profile exists
  if (!businessProfile) {
    return <div className="p-8 text-center text-gray-500">No profile found. Please create one first.</div>;
  }

  const isDeactivated = businessProfile.status === 'deactivate';

  const handleStatusToggle = async () => {
    setIsProcessing(true);
    try {
      const result = await toggleStatus(businessProfile.customId, businessProfile.status || 'active');
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
    submitData.append('businessType', formData.businessType);
    submitData.append('ownerName', formData.ownerName);
    submitData.append('description', formData.description);
    if (imageFile) submitData.append('image', imageFile);

    try {
      const result = await updateProfile(businessProfile.customId, submitData);
      setToastConfig({ isVisible: true, success: true, message: result.message });
      setIsEditing(false); // Switch back to view mode
    } catch (error) {
      setToastConfig({ isVisible: true, success: false, message: error.response?.data?.message || "Failed to update." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
     {/* Top Nav */}
    <SellerTopNav/>

      {toastConfig.isVisible && (
        <Toast success={toastConfig.success} message={toastConfig.message} onClose={() => setToastConfig({...toastConfig, isVisible: false})} />
      )}

      <div className="flex flex-1 overflow-hidden">
         {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        <SellerSidebar activeTab="business-profile" />

        <main className="flex-1 p-8 bg-white overflow-y-auto flex justify-center">

          <div className="w-full max-w-3xl">
            {/* Banner Image Area */}
            <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-8 relative">
              <img
                src={imagePreview || "https://placehold.co/800x400/e2e8f0/64748b?text=Business+Banner"}
                alt="Business Banner"
                className="w-full h-full object-cover"
              />

              {/* Floating Edit Button (Only visible during edit mode) */}
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded hover:bg-white transition-colors shadow-sm"
                  >
                    <Edit className="w-5 h-5 text-gray-900" />
                  </button>
                  <input
                    type="file"
                    name='image'
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden" accept="image/*"
                  />
                </>
              )}
            </div>

            {/* --- VIEW MODE --- */}
            {!isEditing ? (
              <div className="text-sm text-gray-900">
                <div className="grid grid-cols-2 gap-y-4 mb-8 font-medium">
                  <p>Business ID : <span className="font-normal text-gray-600">{businessProfile.customId || '2a3i8h'}</span></p>
                  <p className="invisible">Spacer</p> {/* To match layout alignment */}

                  <p>Business Name : <span className="font-normal text-gray-600">{businessProfile.title}</span></p>
                  <p>Business Type : <span className="font-normal text-gray-600">{businessProfile.businessType}</span></p>

                  <p>Owner Name : <span className="font-normal text-gray-600">{businessProfile.ownerName}</span></p>
                  <p>Total Listings : <span className="font-normal text-gray-600">{listings.length || 0}</span></p>

                  <p>Created On : <span className="font-normal text-gray-600">{businessProfile.createdAt ? businessProfile.createdAt.split('T')[0] : 'N/A'}</span></p>
                </div>

                <div className="mb-10">
                  <p className="font-bold mb-2">Description</p>
                  <p className="text-gray-600 leading-relaxed max-w-2xl">{businessProfile.description}</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors"
                  >
                    Edit Business Profile
                  </button>

                  <button
                    onClick={handleStatusToggle}
                    disabled={isProcessing}
                    className={`${isDeactivated ? 'bg-[#1ecb4f] hover:bg-[#19b043]' : 'bg-[#e04524] hover:bg-[#c93a1c]'} text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors disabled:opacity-70`}
                  >
                    {isProcessing ? 'Processing...' : (isDeactivated ? 'Activate Business Profile' : 'Deactivate Business Profile')}
                  </button>
                </div>
              </div>

            // --- EDIT MODE ---
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Enter Business Name</label>
                    <input
                      type="text" name="title" required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]"
                    />
                  </div>
                  <div className="col-span-1"></div> {/* Spacer for layout */}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Owner Name</label>
                    <input
                      type="text" name="ownerName" required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525] h-32 resize-none"
                  ></textarea>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit" disabled={isProcessing}
                    className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors disabled:opacity-70"
                  >
                    {isProcessing ? 'Updating...' : 'Update Business Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setImagePreview(imageUrl || ''); // Reset preview if cancelled
                    }}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-8 rounded-full transition-colors"
                  >
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

export default BusinessProfile;