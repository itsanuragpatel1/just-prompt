import React from 'react'
import placeholder from '../assets/placeholder.png'
import farmer from '../assets/farmer.avif'


const Presets = () => {
  return (
    <div>
      <section className="text-center py-8 border-b border-gray-300 bg-gray-50 rounded-xl mx-6 mt-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Transform Instantly with What’s Hot Now
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Just pick your favorite preset, upload your photo, and watch the magic happen
        </p>
      </section>

      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 p-4'>
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

export default Presets