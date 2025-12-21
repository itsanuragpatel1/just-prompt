import React, { useState } from 'react'
import placeholder from '../assets/placeholder.png'
import farmer from '../assets/farmer.avif'
import { FaRegPenToSquare } from "react-icons/fa6";
import { PiDownloadLight } from "react-icons/pi";


const Gallary = () => {


  const filters = ["All", "Edited", "Generated"];
   const [activeFilter, setActiveFilter] = useState("All");


  return (
    <div>
            {/* Page Heading for medium screens (below lg but above mobile) */}
      
<section className="px-6 py-6 border-b border-gray-200 bg-white/70 backdrop-blur-md">
  <div className="flex flex-col md:flex-row items-center justify-between gap-5">
    {/* Left Section */}
    <div className="w-full md:w-auto text-center md:text-left">
      <h2 className="text-xl font-semibold text-gray-800">Your Creations</h2>
      <p className="text-sm text-gray-500">
        Manage your edited, generated, and uploaded visuals
      </p>
    </div>

    {/* Filter Toolbar */}
    <div className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-gray-200 rounded-full shadow-sm overflow-x-auto">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap
          ${
            activeFilter === filter
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  </div>
</section>







      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 p-4'>
        <div className='mb-4 rounded-lg overflow-hidden relative group'>
          <img src={farmer} alt="" />
          <div className='gap-4 items-center absolute top-0 right-0 bg-white rounded-lg p-2 mt-1 mr-1 hidden group-hover:block group-hover:flex'>
            <PiDownloadLight className='text-xl'/>
            <FaRegPenToSquare className='text-xl'/>
          </div>
        </div>

        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={farmer} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={farmer} alt="" className='mb-4 rounded-lg' />
        <img src={farmer} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={farmer} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
        <img src={farmer} alt="" className='mb-4 rounded-lg' />
        <img src={placeholder} alt="" className='mb-4 rounded-lg' />
      </div>
    </div>
  )
}

export default Gallary