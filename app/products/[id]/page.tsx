import React from 'react';

const ProductCard: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto border border-gray-200 rounded-lg shadow-md p-6 bg-white">
      {/* Image Section */}
      <div className="flex flex-col items-center md:w-1/2">
        <img
          src="https://via.placeholder.com/300x200?text=Laptop+Image"
          alt="HP AMD Ryzen 3 Laptop"
          className="w-64 h-40 object-contain mb-4"
        />
        <div className="flex space-x-2">
          <img
            src="https://via.placeholder.com/50x50?text=Thumbnail+1"
            alt="Thumbnail 1"
            className="w-12 h-12 object-contain border border-gray-200 rounded"
          />
          <img
            src="https://via.placeholder.com/50x50?text=Thumbnail+2"
            alt="Thumbnail 2"
            className="w-12 h-12 object-contain border border-gray-200 rounded"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="md:w-1/2 mt-4 md:mt-0 md:ml-6">
        <h2 className="text-xl font-semibold text-gray-800">HP AMD Ryzen 3</h2>
        <p className="text-2xl font-bold text-teal-600 mt-1">$529.99</p>
        <p className="text-green-600 text-sm mt-1 flex items-center">
          <span className="w-3 h-3 bg-green-600 rounded-full mr-1"></span>
          Availability: <span className="font-semibold ml-1">In stock</span>
        </p>
        <p className="text-red-600 text-sm mt-1">Hurry up! only 34 product left in stock!</p>

        {/* RAM Options */}
        <div className="mt-4">
          <p className="text-gray-700 text-sm mb-2">Ram:</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">4 GB</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">8 GB</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100">16 GB</button>
          </div>
        </div>

        {/* Quantity and Buttons */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded">
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-100">-</button>
            <span className="px-4 py-1 text-gray-700">1</span>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-100">+</button>
          </div>
          <button className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
          <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Buy it now</button>
          <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;