import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const API_HOST = "http://localhost:3000"
  // Determine badge styling based on type
  const isService = item.category?.toLowerCase() === 'service';
  const badgeBg = isService ? 'bg-green-400' : 'bg-gray-300';

  // Default placeholder image if none is provided
  const imgUrl = `${API_HOST}/${item.image}` || "https://placehold.co/600x400/e2e8f0/64748b?text=Illustration";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-[#e29525] transition-colors duration-200 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 bg-blue-100 w-full">
        <img
          src={imgUrl}
          alt={item.title}
          className="w-full h-full object-cover mix-blend-multiply"
        />
        {/* Type Badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-black ${badgeBg}`}>
          {isService ? 'Service' : 'Product'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
        <p className="text-[#e29525] font-bold text-xl mb-3">$ {item.price}</p>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">
          {item.description}
        </p>

        <div className="text-sm text-gray-700 mb-5">
          Provided by: <a href='#' className="text-blue-600 hover:underline">{item.businessId.title}</a>
        </div>

   <Link
  to={`/details/${item.category}/${item._id}`}
  className="w-32 bg-[#e29525] hover:bg-[#c9831f] text-white text-sm font-medium py-2 rounded-full transition duration-200 mt-auto flex items-center justify-center text-center"
>
  View Details
</Link>
      </div>
    </div>
  );
};

export default ItemCard;