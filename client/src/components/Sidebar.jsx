import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import defProfile from '../assets/profile.png';
import { RxCross2, RxDashboard, RxRocket, RxImage, RxMagicWand, RxPlus } from "react-icons/rx";
import { FiLayers } from "react-icons/fi";
import toast from 'react-hot-toast';

const Sidebar = ({ sidebarOpen, onCross }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user,credits } = useAuth();
  const creditLimit=3;

  // Helper for consistent menu styling
  const MenuLink = ({ label, path, icon: Icon, onClick }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={onClick}
        className={`
          relative w-full text-left px-4 py-3 text-sm transition-all duration-200 rounded-xl group cursor-pointer flex items-center gap-3
          ${isActive 
            ? 'font-bold text-gray-900 bg-white shadow-sm border border-gray-100' 
            : 'font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
          }
        `}
      >
        {/* Icon wrapper */}
        <span className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
          <Icon />
        </span>
        
        {label}
      </button>
    );
  };

  const SidebarProfile = () => {
    return (
      <div
        onClick={() => navigate("/profile")}
        className="
          flex items-center gap-3 
          p-2 rounded-2xl cursor-pointer
          hover:bg-gray-100 transition-all duration-300
          border border-transparent hover:border-gray-200
        "
      >
        <img
          src={user?.avatar || defProfile}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <div className="min-w-0 leading-tight">
          <p className="text-sm font-bold text-gray-800 truncate">
            {user?.fullName || "User Name"}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.email || "user@email.com"}
          </p>
        </div>
      </div>
    );
  };

  // A widget to fill space and look professional
  const UsageWidget = () => (
    <div className="mx-1 mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#394855] to-gray-800 text-white relative overflow-hidden shadow-lg">
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      
      <p className="text-xs font-medium text-gray-300 mb-1">Credits</p>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-2xl font-bold">{creditLimit-credits}</span>
        <span className="text-sm text-gray-400 mb-1">/ {creditLimit} used</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden mb-3">
        <div className={`h-full bg-blue-400 w-[${Math.floor(((creditLimit-credits)/creditLimit)*100)}%] rounded-full`}></div>
      </div>

      <button 
        onClick={() => {}}
        className="w-full py-2 text-xs font-bold bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Upgrade Plan
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCross}
        ></div>
      )}

      {/* Main Sidebar */}
      <div className={`
          fixed inset-y-0 left-0 z-50 bg-[#F8FAFC] 
          lg:static lg:block
          w-[270px]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-out
          border-r border-gray-200 lg:shadow-none shadow-2xl
        `}>

        <div className="flex flex-col h-full px-5 py-6">

          {/* Logo Section */}
          <div className='flex items-center justify-between mb-8 pl-1'>
            <h2 className='text-xl font-black tracking-tight text-gray-900 flex items-center gap-2'>
              <img src='/logo.png' alt="" className='h-7 w-7' />
              Just Prompt
            </h2>
            <RxCross2 
              className='text-2xl text-gray-400 hover:text-black transition-colors cursor-pointer lg:hidden' 
              onClick={onCross} 
            />
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => navigate('/')}
            className='
              w-full py-3.5 px-4 mb-8 rounded-xl
              bg-blue-600 text-white text-sm font-semibold tracking-wide
              hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center gap-2
              group
            '
          >
            <RxPlus className="text-xl group-hover:rotate-90 transition-transform duration-300"/>
            Start New Project
          </button>

          {/* Navigation */}
          <div className='flex-1 flex flex-col gap-1.5 overflow-y-auto'>
            <p className='px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
              Menu
            </p>
            
            <MenuLink 
              label="Editor" 
              path="/" 
              icon={RxMagicWand} 
              onClick={() => { navigate('/'); onCross(); }} 
            />
            <MenuLink 
              label="My Gallery" 
              path="/gallary" 
              icon={RxImage} 
              onClick={() => { user? (navigate('/gallary'),onCross()):toast.error("Please Login to Continue") }} 
            />
             <MenuLink 
              label="Projects" 
              path="/projects" 
              icon={FiLayers} 
              onClick={() => { user? (navigate('/projects'),onCross()): toast.error("Please Login to Continue") }} 
            />
            
            <div className="my-2 border-b border-gray-100"></div>

            <p className='px-4 mb-2 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
              Discover
            </p>
            <MenuLink 
              label="Trending Presets" 
              path="/presets" 
              icon={RxDashboard} 
              onClick={() => { navigate('/presets'); onCross(); }} 
            />
          </div>

          {/* Bottom Section: Usage Widget + Profile */}
          {user && 
          <div className="mt-auto">
            {/* The widget fills the visual gap left by removing the big buttons */}
            <UsageWidget />
            
            <div className="pt-2 border-t border-gray-200/60">
              <SidebarProfile />
            </div>
          </div>
          }

        </div>
      </div>
    </>
  );
}

export default Sidebar;