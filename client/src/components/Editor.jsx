import React from 'react'
import { BsArrowRepeat } from "react-icons/bs";
import { LuImageUpscale } from "react-icons/lu";
import { MdLabel, MdOutlineAutoFixHigh } from "react-icons/md";
import { PiDownloadLight } from "react-icons/pi";
import { TbFaceId } from "react-icons/tb";
import { MdAutoAwesome } from "react-icons/md";
import { CiPaperplane } from "react-icons/ci";
import Placeholder from './Placeholder';
import { downloadImage } from '../utils/downloadImage.js';
import ImageLoadingOverlay from './ImageLoadingOverlay.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Editor = ({selectedImage,setSelectedImage,prompt, setPrompt,applyHandler,isWorking,reRunHandler,fixFaceHandler}) => {

    const {user}=useAuth();

  return (
    <div className='flex flex-col gap-5 border border-gray-300 rounded-3xl bg-white p-2 px-5 md:px-7 shadow-sm'>
      
        {/* editor nav functionalites */}
        <div className='flex justify-between gap-3 flex-col sm:flex-row'>
            <div className='flex gap-3'>
                <button className='featuresbtn' onClick={()=>{reRunHandler()}}>
                    <BsArrowRepeat className='text-lg text-gray-600'/>
                    <p className='text-md font-[350] text-gray-600'>Re-Run</p>
                </button>
                <button className='featuresbtn' onClick={()=>{applyHandler("auto")}}>
                    <MdOutlineAutoFixHigh className='text-lg text-gray-600'/>
                    <p className='text-md font-[350] text-gray-600'>Auto</p>
                </button>
                <button className='featuresbtn' onClick={()=>{applyHandler("upscale")}}>
                    <LuImageUpscale className='text-lg text-gray-600'/>
                    <p className='text-md font-[350] text-gray-600'>Upscale</p>
                </button>                
                
            </div>
            <div className='flex gap-3'>
                <button className='featuresbtn' onClick={()=>{fixFaceHandler()}}>
                    <TbFaceId className='text-lg text-gray-600'/>
                    <p className='text-md font-[350] text-gray-600'>Fix Face</p>
                </button> 
                <button className='featuresbtn' onClick={()=>{downloadImage(selectedImage)}}>
                    <PiDownloadLight className='text-lg text-gray-600'/>
                    <p className='text-md font-[350] text-gray-600'>Download</p>
                </button> 
            </div>
        </div>

        {/* editor image main photo*/}
        <div className='relative rounded-3xl overflow-hidden flex justify-center h-[70vh]'>
            <input type="file"  id='mainphoto' hidden onChange={(e)=>{setSelectedImage(e.target.files[0])}}/>
            {
                selectedImage?<img src={selectedImage instanceof File ?URL.createObjectURL(selectedImage):selectedImage} alt=""  className='max-w-full
    max-h-full
    object-contain'/>:<label htmlFor="mainphoto" className='w-full h-full'><Placeholder/></label>
            }
            {isWorking && <ImageLoadingOverlay />}

            
            {/* <label htmlFor="mainphoto"><img className='w-full max-h-85 object-contain' src={placeholder} alt="" /></label> */}
        </div>

        {/*prompt area*/}
        <div className='rounded-3xl border border-gray-300 flex items-center py-2 px-3 sm:px-5'>
            <MdAutoAwesome className='text-lg text-gray-600 hidden sm:block'/>
            <input type="text" className='flex-1 sm:px-3 text-lg text-gray-700 outline-0'  placeholder="Generate or edit — eg. 'create mountain view' or 'make it aesthetic" value={prompt} onChange={(e)=>{setPrompt(e.target.value)}} />
            <button onClick={()=>{user?applyHandler():toast.error("Please Login to Continue")}} className='flex items-center gap-2 rounded-3xl px-4 py-2 bg-blue-700 hover:bg-blue-800' >
                <p className='text-md font-[350] text-white hidden sm:block'>Apply</p>
                <CiPaperplane className='text-lg text-white'/>
            </button>
        </div>

    </div>
  )
}

export default Editor