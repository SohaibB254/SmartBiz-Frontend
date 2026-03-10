import React from 'react'
import { Link } from 'react-router-dom'

const TopNav = () => {
  return (
    <>

      <header className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="text-2xl font-bold text-[#e29525]">
            <Link to={'/marketplace'}>SmartBiz</Link>
            </div>
      </header>
      </>
  )
}

export default TopNav
