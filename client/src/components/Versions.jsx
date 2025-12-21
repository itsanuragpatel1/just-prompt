import React from 'react'
import { TbLibraryPhoto } from "react-icons/tb";
import { TbLivePhoto } from "react-icons/tb";
import farmer from '../assets/farmer.avif'
import placeholder from '../assets/placeholder.png'
import { RiTimerFlashLine } from "react-icons/ri";

const Versions = ({imagesArray,setSelectedImage,selectedImage}) => {


 const Waiting=()=>{
    return (
        <div className='h-28 w-50'>
            <div className='h-full w-full border-dashed bg-gray-50 border-gray-400 border-1 rounded-sm flex justify-center items-center'>
            <RiTimerFlashLine className='text-2xl text-gray-500'/>
            </div>
        </div>
    )
 }


  return (
    <div className='flex flex-col gap-2 rounded-3xl border border-gray-300 bg-white p-2 px-6 md:px-7'>
        {/*text */}
        <div className='flex justify-between' >
            <div className='flex items-center gap-2 text-gray-500'>
                <TbLibraryPhoto/>
                <p className='text-sm'>Previous Versions</p>
            </div>
            <div className='flex items-center gap-2 text-gray-500'>
                <TbLivePhoto/>
                <p className='text-sm'>Live Preview</p>
            </div>
        </div>

        {/*photos all */}
        <div className='flex overflow-x-scroll gap-4 scrollbarHide'>
            {
                imagesArray?
                    (imagesArray.map((imgObj,index)=>{
                        return <img src={imgObj.imageUrl} alt="" className={`h-30 rounded-xl cursor-pointer  ${selectedImage && 'border border-gray-600'}`} id={index} onClick={()=>{setSelectedImage(imgObj.imageUrl)}} key={index}/>}))
                    :
                    (<Waiting/>)
            }

        </div>
    </div>
  )
}

export default Versions