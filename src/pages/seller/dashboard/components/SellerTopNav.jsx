import React from 'react'
import { Link } from 'react-router-dom'

const SellerTopNav = () => {
  return (
   <>
    <header className="sticky top-0 w-full z-40 h-18.25 border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#e29525]">
          <Link to={'/seller/overview'}>
            SmartBiz
          </Link>
            </div>
      </header>
   </>
  )
}

export default SellerTopNav
