import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/ui/Navbar';
import ItemCard from '../components/common/ItemCard';
import Pagination from '../components/common/Pagination'; // Make sure this path matches your structure

// Centralized Host Variable
const API_HOST = 'http://localhost:3000';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // States for filtering and searching
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'products', 'services'
  const [searchInput, setSearchInput] = useState('');

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 3; // Using 9 since you have a 3-column grid (looks much cleaner!)

  // Fetch data whenever the tab changes, page changes, or search is submitted
  const fetchMarketplaceData = async (searchOverride = searchInput, currentPage = page) => {
    setIsLoading(true);
    try {
      let endpoint = '';

      // If a search term is active, use the search endpoint with pagination
      if (searchOverride) {
        endpoint = `${API_HOST}/marketplace/search?title=${searchOverride}&businessName=${searchOverride}&page=${currentPage}&limit=${limit}`;
      } else {
        // Otherwise, use the category endpoints with pagination
        endpoint = `${API_HOST}/marketplace/${activeTab}?page=${currentPage}&limit=${limit}`;
      }

      const response = await axios.get(endpoint);

      // Extract items and totalCount from your backend response
      setItems(response.data?.items || response.data?.data || []);
      console.log(response.data?.items.length);

      setTotalItems(response.data?.totalCount|| 0);

      // Keep state in sync
      setPage(currentPage);

    } catch (error) {
      console.error("Failed to fetch marketplace items:", error);
      // Fallback/Mock Data
      setItems([
        { id: 1, type: 'Service', title: 'Web Development', price: 32, description: 'This is a service provided by someone who is good at web development.', providerName: 'James julian' },
        { id: 2, type: 'Product', title: 'Razer Blade gaming mouse', price: 35, description: 'High performance gaming mouse with RGB.', providerName: 'Sara Jones' },
        { id: 3, type: 'Service', title: 'Web Development', price: 32, description: 'This is a service provided by someone who is good at web development.', providerName: 'James julian' },
      ]);
      setTotalItems(15); // Mock total items to test pagination UI
      setPage(currentPage);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when the tab changes
  useEffect(() => {
    if (!searchInput) {
      // Always reset to page 1 when switching tabs
      fetchMarketplaceData('', 1);
    }
  }, [activeTab]);

  // Handle Search Input Submission
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveTab('all'); // Reset to "All" tab when doing a global search
    fetchMarketplaceData(searchInput, 1); // Always reset to page 1 for new searches
  };

  // Handle Pagination Next/Prev Clicks
  const handlePageChange = (newPage) => {
    fetchMarketplaceData(searchInput, newPage);
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

        {/* Dynamic Pagination Component */}
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md">
            <Pagination
              currentPage={page}
              totalItems={totalItems}
              limit={limit}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;