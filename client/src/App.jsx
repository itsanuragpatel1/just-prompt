import React, { useState } from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Presets from './pages/Presets'
import Gallary from './pages/Gallary'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'
import Profile from './pages/Profile'
import Projects from './pages/Projects'
import { ProtectedRoute } from './context/ProtectedRoute.jsx'

const App = () => {

  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [showLogin,setShowLogin]=useState(false);

  return (
    <>
    <Toaster/>

    {showLogin && <Login setShowLogin={setShowLogin}/>}

    <div className='lg:flex h-screen'>
       <Sidebar  onCross={()=>{setSidebarOpen(false)}} sidebarOpen={sidebarOpen} />
       <div className='flex-1 overflow-y-auto'>
            <Navbar onMenu={()=>{setSidebarOpen(true)}} sidebarOpen={sidebarOpen} setShowLogin={setShowLogin}/>      
             <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/project/:projectId' element={<ProtectedRoute><Home/></ProtectedRoute>} />
                <Route path='/presets' element={<Presets/>} />
                <Route path='/gallary' element={<ProtectedRoute><Gallary/></ProtectedRoute>} />
                <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                <Route path='/projects' element={<ProtectedRoute><Projects/></ProtectedRoute>}  />
              </Routes>
       </div>
    </div>

    </>
  )


  // return (
  //   <>
  //     <div>


  //     </div>


  //     <div>
  //       <Routes>
  //         <Route path='/' element={<Home/>} />
  //         <Route path='/presets' element={<Presets/>} />
  //         <Route path='/gallary' element={<Gallary/>} />
  //       </Routes>
  //     </div>
  //   </>
  // )
}

export default App