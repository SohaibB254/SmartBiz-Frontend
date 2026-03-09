import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/ui/Navbar';
import ItemCard from '../components/common/ItemCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Centralized Host Variable
const API_HOST = 'http://localhost:3000';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // States for filtering and searching
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'products', 'services'
  const [searchInput, setSearchInput] = useState('');

  // Fetch data whenever the tab changes or a search is submitted
  const fetchMarketplaceData = async (searchOverride = '') => {
    setIsLoading(true);
    try {
      let endpoint = '';

      // If a search term is active, use the search endpoint
      if (searchOverride) {
        // Sending the same query to both title and businessName as requested
        endpoint = `${API_HOST}/marketplace/search?title=${searchOverride}&businessName=${searchOverride}`;
      } else {
        // Otherwise, use the category endpoints
        endpoint = `${API_HOST}/marketplace/${activeTab}`;
      }

      const response = await axios.get(endpoint);

      // Assuming the backend returns an array directly, or an object like { data: [...] }
      setItems(response.data?.items || response.data || []);

    } catch (error) {
      console.error("Failed to fetch marketplace items:", error);
      // Fallback/Mock Data just so you can see the layout if the server is down
      setItems([
        { id: 1, type: 'Service', title: 'Web Development', price: 32, description: 'This is a service provided by someone who is good at web development.', providerName: 'James julian' },
        { id: 2, type: 'Product', title: 'Razer Blade gaming mouse', price: 35, description: 'High performance gaming mouse with RGB.', providerName: 'Sara Jones' },
        { id: 3, type: 'Service', title: 'Web Development', price: 32, description: 'This is a service provided by someone who is good at web development.', providerName: 'James julian' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when the tab changes (and clear search to avoid confusion)
  useEffect(() => {
    if (!searchInput) {
      fetchMarketplaceData();
    }
  }, [activeTab]);

  // Handle Search Input Submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to "All" tab when doing a global search for better UX
    setActiveTab('all');
    fetchMarketplaceData(searchInput);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header & Search */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-xl font-bold text-gray-900 mb-6">What are you looking for?</h1>

          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search by titles or business names"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e29525] focus:border-transparent text-gray-700"
            />
          </form>
        </div>

        {/* Filters */}
        <div className="flex space-x-3 mb-8 justify-start max-w-2xl mx-auto">
          {['all', 'products', 'services'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSearchInput(''); // Clear search when switching tabs manually
                setActiveTab(tab);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeTab === tab && !searchInput
                  ? 'bg-[#e29525] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e29525]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.length > 0 ? (
              items.map((item, index) => (
                <ItemCard key={item.id || index} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No items found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-4 mt-12 text-sm text-gray-700">
          <span>Page</span>
          <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium">01</span>
          <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;