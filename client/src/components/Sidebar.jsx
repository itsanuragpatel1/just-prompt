import { useAuth } from '../context/AuthContext';
import React, { useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import defProfile from '../assets/profile.png'

const Sidebar = ({sidebarOpen , onCross}) => {

  const navigate=useNavigate();

  const {user}=useAuth();

  //user.plan
  //user.avatar
  //user.fullName
  //user.email

const SidebarProfile = () => {

  return (
    <div
      onClick={() => navigate("/profile")}
      className="
        flex items-center gap-3 
        p-3 rounded-xl cursor-pointer
        hover:bg-gray-100 transition
      "
    >
      {/* Avatar */}
      <img
        src={user?.avatar || defProfile  }
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Info */}
      <div className="min-w-0 leading-tight">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user?.fullName || "User Name"}
        </p>

        <p className="text-xs text-gray-500 truncate">
          {user?.email || "user@email.com"}
          <span className="mx-1">•</span>
          <span className="capitalize">
            {user?.plan || "free"}
          </span>
        </p>
      </div>
    </div>
  );
};

return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCross}
        ></div>
      )}

      <div className={`${sidebarOpen ? 'absolute' : 'hidden'} bg-white lg:static lg:block z-50 duration-300`}>
        {/* 🔹 ONLY CHANGE: flex + h-full */}
        <div className="flex flex-col w-xs p-4 lg:border-r border-gray-300 h-[100vh]">

          {/* Existing content (UNCHANGED) */}
          <div>
            <div className='flex items-center gap-2'>
              <RxCross2 className='text-2xl cursor-pointer lg:hidden' onClick={onCross} />
              <h2 className='text-xl'>Just Prompt</h2>
            </div>

            <div className='flex flex-col mt-8 gap-3'>
              <button
                onClick={() => navigate('/')}
                className='rounded-3xl bg-blue-600 text-white p-2 text-lg hover:bg-blue-700'
              >
                Upload Photo
              </button>
              <button
                onClick={() => navigate('/')}
                className='rounded-3xl bg-gray-200 text-black p-2 text-lg hover:bg-gray-300'
              >
                Generate Photo
              </button>
            </div>

            <div className='flex flex-col mt-6 gap-2'>
              <p>MENU</p>
              <button className='menubtn' onClick={() => { navigate('/'); onCross(); }}>Editor</button>
              <button className='menubtn' onClick={() => { navigate('/presets'); onCross(); }}>Trending Presets</button>
              <button className='menubtn' onClick={() => { navigate('/gallary'); onCross(); }}>My Gallary</button>
              <button className='menubtn' onClick={() => { navigate('/projects'); onCross(); }}>Projects</button>
            </div>
          </div>

          {/* 🔹 PROFILE AT BOTTOM (NEW) */}
          <div className="mt-auto" onClick={()=>{navigate('/profile')}}>
            <SidebarProfile/>
          </div>

        </div>
      </div>
    </>
  );
}

export default Sidebar