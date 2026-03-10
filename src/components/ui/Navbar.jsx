import React from 'react';
import { Briefcase, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link
      to={'/'}
      className="text-2xl cursor-pointer font-bold text-[#e29525]">
        SmartBiz
      </Link>
      <div className="flex items-center space-x-6">
        <Link
        to={'/seller/dashboard/add-business'}
        className="flex items-center hover:underline hover:cursor-pointer space-x-2 text-gray-700 hover:text-black font-medium">
          <span>Add Business</span>
          <Briefcase className="w-5 h-5" />
        </Link>
        <Link
        to={'/profile'}
        className="flex items-center hover:underline hover:cursor-pointer space-x-2 text-gray-700 hover:text-black font-medium">
          <span>Profile</span>
          <User className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;