import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CreditCard, Edit } from 'lucide-react';
import SellerSidebar from '../components/SellerSidebar.jsx'
import { useUser } from '../../../../context/UserContext';
import { useBusiness } from '../../../../context/BusinessContext';
import SellerTopNav from '../components/SellerTopNav';

const SellerAccount = () => {
  const { user } = useUser();
  const { businessProfile } = useBusiness();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
    {/* Top Nav */}
    <SellerTopNav />

      <div className="flex  flex-1">
        {/* Empty div to make align horizontal elements  */}
        <div className='w-64'></div>
        <SellerSidebar activeTab="account" />

        <main className="flex-1  p-8 bg-white min-h-[calc(100vh-73px)]">

          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-black">Account</h1>
            <div className="flex items-center space-x-6 text-sm font-medium">
              <div className="text-gray-700 flex gap-2 items-center"><Briefcase size={18}/> {businessProfile?.title || 'Business'}</div>
              <div className="text-gray-700 flex gap-2 items-center"><CreditCard size={18}/>Balance: $5340</div>
            </div>
          </div>

          <div className="max-w-4xl space-y-10">

            {/* Personal Details */}
            <div>
              <h2 className="text-xl font-bold text-black mb-6 border-b border-gray-200 pb-2 relative">
                Personal Details
                <button className="absolute right-0 bottom-2 text-gray-700 hover:text-black">
                  <Edit className="w-5 h-5" />
                </button>
              </h2>
              <div className="space-y-4 text-sm pl-2">
                <div>
                  <p className="font-bold text-black">Name:</p>
                  <p className="text-gray-500">{user.name}</p>
                </div>
                <div>
                  <p className="font-bold text-black">Email:</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <div>
                  <p className="font-bold text-black">Joined:</p>
                  <p className="text-gray-500">{user.createdAt ? user.createdAt.split('T')[0]: "N/A"}</p>
                </div>
                <div className="pt-2">
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-6 rounded-full transition duration-200">
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h2 className="text-xl font-bold text-black mb-6 border-b border-gray-200 pb-2 flex items-center">
                Business Details
                <Link to="/seller/profile" className="text-blue-600 text-xs font-semibold hover:underline ml-2 mb-0.5">
                  [Go to Business Profile]
                </Link>
              </h2>
              <div className="space-y-4 text-sm pl-2">
                <div>
                  <p className="font-bold text-black">Business Name:</p>
                  <p className="text-gray-500">{businessProfile?.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-black">Business Type:</p>
                  <p className="text-gray-500">{businessProfile?.businessType || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-bold text-black">Joined:</p>
                  <p className="text-gray-500">{businessProfile?.createdAt ? businessProfile.createdAt.split('T')[0] : 'N/A'}</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerAccount;