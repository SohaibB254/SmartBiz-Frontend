import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SellerSidebar from '../components/SellerSideBar';
import { useListing } from '../../../../context/ListingsContext';
import { useBusiness } from '../../../../context/BusinessContext';
import Toast from '../../../../components/common/Toast';
import SellerTopNav from '../components/SellerTopNav';

const API_HOST = 'http://localhost:3000'
// A specialized card just for the seller dashboard so clicking 'View Details' goes to the edit page
const SellerItemCard = ({ item }) => {
  const imgUrl = `${API_HOST}/${item.image}` || "https://placehold.co/600x400/e2e8f0/64748b?text=Illustration";
  const badgeBg = item.category?.toLowerCase() === 'service' ? 'bg-green-400' : 'bg-gray-300';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 bg-blue-100 w-full">
        <img src={imgUrl} alt={item.title} className="w-full h-full object-cover mix-blend-multiply" />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-black ${badgeBg}`}>
          {item.category || 'Item'}
        </span>
      </div>
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-[#e29525] font-bold text-xl mb-3">$ {item.price}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">{item.description}</p>
        <Link
          to={`/seller/listings/${item._id}`}
          className="w-32 bg-[#e29525] hover:bg-[#c9831f] text-white text-sm font-medium py-2 rounded-full text-center transition duration-200 mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const SellerListings = () => {
  const { fetchListings, listings, isLoading, addListing } = useListing();
  const { businessProfile } = useBusiness();
  const fileInputRef = useRef(null);

  const [toastConfig, setToastConfig] = useState({ isVisible: false, success: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', description: '' });

  useEffect(() => {
    fetchListings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('price', formData.price);
    submitData.append('description', formData.description);
    if (imageFile) submitData.append('image', imageFile);

    try {
      const result = await addListing(submitData);
      setToastConfig({ isVisible: true, success: true, message: result.message });
      // Reset Form
      setFormData({ title: '', price: '', description: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      setToastConfig({ isVisible: true, success: false, message: error.response?.data?.message || "Failed to add listing" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProduct = businessProfile?.businessType === 'Product Based';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Top Nav */}
    <SellerTopNav/>

      {toastConfig.isVisible && <Toast success={toastConfig.success} message={toastConfig.message} onClose={() => setToastConfig({...toastConfig, isVisible: false})} />}

      <div className="flex flex-1 overflow-hidden">
         {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        <SellerSidebar activeTab="listings" />

        <main className="flex-1 p-8 bg-gray-50/30 overflow-y-auto">

          <h1 className="text-2xl font-bold text-black mb-6">Add a New {isProduct ? 'Product' : 'Listing'}</h1>

          {/* Add Listing Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 max-w-3xl mx-auto shadow-sm mb-12">

            <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 mb-8 relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <button type="button" onClick={() => fileInputRef.current.click()} className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-2 px-6 rounded-full shadow-sm relative z-10">
                  Upload Image
                </button>
              )}
              <input type="file" name='image' ref={fileInputRef} onChange={(e) => {
                const file = e.target.files[0];
                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
              }} className="hidden" accept="image/*" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleInputChange} placeholder="Item Name" className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Price</label>
                <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="$ 0.00" className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525]" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-900 mb-2">Description</label>
              <textarea name="description" required value={formData.description} onChange={handleInputChange} placeholder="Detailed description..." className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#e29525] h-32 resize-none"></textarea>
            </div>

            <button type="submit" disabled={isSubmitting} className="bg-[#e29525] hover:bg-[#c9831f] text-white font-medium py-3 px-8 rounded-full shadow-sm transition-colors disabled:opacity-70">
              {isSubmitting ? 'Adding...' : 'Add New'}
            </button>
          </form>

          {/* All Listings Grid */}
          <h2 className="text-2xl font-bold text-black mb-6">All {isProduct ? 'Products' : 'Listings'}</h2>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading listings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.length > 0 ? (
                listings.map(item => <SellerItemCard key={item._id} item={item} />)
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">No items found. Create your first listing above!</div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default SellerListings;