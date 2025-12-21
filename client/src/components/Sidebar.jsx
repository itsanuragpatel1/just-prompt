import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

const Sidebar = ({sidebarOpen , onCross}) => {

  const navigate=useNavigate();



  return (
    <>
    
      {sidebarOpen && <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={onCross}></div> }
    


    <div className={`${sidebarOpen ? 'absolute': 'hidden' } bg-white lg:static lg:block z-50  duration-300 `}>
    <div className='flex flex-col w-xs p-4 lg:border-r border-gray-300 h-[100vh]'>
        <div className='flex items-center gap-2'>
              <RxCross2 className='text-2xl cursor-pointer lg:hidden' onClick={onCross}/>
              <h2 className='text-xl'>Just Prompt</h2>
        </div>
        <div className='flex flex-col mt-8 gap-3'>
          <button className='rounded-3xl bg-blue-600 text-white p-2 text-lg font-[400] hover:bg-blue-700'>Upload Photo</button>
          <button className='rounded-3xl bg-gray-200 text-black p-2 text-lg font-[400] hover:bg-gray-300' >Generate Photo</button>
        </div>
      <div className='flex flex-col mt-6 gap-2'>
        <p>MENU</p>
        <button className='menubtn' onClick={()=>{navigate('/');onCross()} }>Editor</button>
        <button className='menubtn' onClick={()=>{navigate('/presets');onCross()}}>Trending Presets</button>
        <button className='menubtn'onClick={()=>{navigate('/gallary');onCross()}}>My Gallary</button>
      </div>
    </div>
    </div>
    </>




  )
}

export default Sidebar