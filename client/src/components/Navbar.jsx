import React, { useState } from 'react'
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegPenToSquare } from "react-icons/fa6";
import { VscFlame } from "react-icons/vsc";
import { IoMdImages } from "react-icons/io";
import { useAuth } from '../context/AuthContext';
import { FaRegUser } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = ({onMenu,setShowLogin}) => {

  const navigate=useNavigate();

  const location1=useLocation();
  const {user,setUser}=useAuth();
  const [open,setOpen]=useState(false);

  const pageTitles={
    '/':'Editor',
    '/project':'Editor',
    '/presets':'Trending Presets',
    '/gallary':'My Gallary',
    '/profile':'Profile'
  };

  const logoutHandle=async()=>{
    try {
      const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`;
      const {data}=await axios.get(endpoint,{withCredentials:true});

      if(data.success){
        setUser(null);
        toast.success(data.message);
        setOpen(false);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error in logoutHandle",error);
    }
  }


  return (
    <div className='flex justify-between p-4 py-4 border-gray-300 border-b '>
        <div className='flex items-center gap-2'>
            <IoMenu  onClick={onMenu} className='text-2xl cursor-pointer lg:hidden' />
            <h2 className='text-xl lg:hidden'>Just Prompt</h2>
            {location1.pathname=='/'? <FaRegPenToSquare className='text-xl hidden lg:block' /> : (location1.pathname=='/presets'?  <VscFlame className='text-xl hidden lg:block' />:  <IoMdImages className='text-xl hidden lg:block' /> )}
            <h2 className='text-xl hidden lg:block'>{location1.pathname.startsWith('/project')?'Projects':pageTitles[location1.pathname]}</h2>
        </div>
        <div>
          { 
           user ?
<div className="relative">

  {/* Profile section */}
  <div className="flex items-center gap-2.5">
    <div className="border border-gray-300 h-8 w-8 rounded-full overflow-hidden flex justify-center items-center bg-white shadow-sm">
      {user?.avatar ? (
        <img src={user.avatar} className="h-full w-full object-cover" alt="avatar" />
      ) : (
        <FaRegUser className="w-full h-full p-1 text-gray-600" />
      )}
    </div>

    <FaCaretDown className={`text-gray-600 cursor-pointer duration-200 ${open && 'rotate-180'}`}   onClick={()=>setOpen(!open)}/>
  </div>

  {/* Dropdown */}
  {open && <div className="absolute top-10 right-0 bg-white px-1 py-1 rounded-xl shadow-lg border border-gray-100  w-36 z-20">
    <div className="flex flex-col gap-1">

      <button onClick={()=>navigate('/profile')} className="cursor-pointer px-2 py-2 rounded-lg hover:bg-gray-100 text-center transition">
        Profile
      </button>

      <button onClick={()=>logoutHandle()} className="cursor-pointer px-2 py-2 rounded-lg hover:bg-red-100 text-red-600 text-center transition">
        Logout
      </button>

    </div>
  </div>
  }
  

</div>
 : 
            <button className='text-lg rounded-xl border-gray-400 border px-4 color text-gray-600' onClick={()=>setShowLogin(true)}>Login</button>
          }
          {/* <button className='text-lg rounded-xl border-gray-400 border px-4 color text-gray-600' onClick={()=>setShowLogin(true)}>Login</button>   */}
        </div>
    </div>
  )
}

export default Navbar