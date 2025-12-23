import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Editor from '../components/Editor'
import Versions from '../components/Versions'
import { Await, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

const Home = () => {

  const {projectId}=useParams();
  const [isWorking,setIsWorking]=useState(false)
  const [loading,setLoading]=useState(false);
  const [projectObject,setProjectObject]=useState([]);
  const [selectedImage,setSelectedImage]=useState('');
  const [prompt,setPrompt]=useState('');
  const location = useLocation();
  const isPresetFlowRef = useRef(false);


  const navigate=useNavigate();

 useEffect(() => {
  const presetPrompt = location.state?.presetPrompt;
  const presetImage = location.state?.presetImageFile;

  if (presetPrompt && presetImage) {
    console.log("✅ Preset flow detected");

    isPresetFlowRef.current = true;   // 🔑 KEY LINE

    setPrompt(presetPrompt);
    setSelectedImage(presetImage);
  }
}, [location.state]);

useEffect(() => {


  if (
    isPresetFlowRef.current &&
    prompt &&
    selectedImage
  ) {


    applyHandler();

   
    isPresetFlowRef.current = false;
  }
}, [prompt, selectedImage]);


  
  useEffect(()=>{
    const getProject=async()=>{
      setLoading(true);
      const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/project/${projectId}`;

      const {data}=await axios.get(endpoint,{withCredentials:true});

      if(data.success){
        setSelectedImage(data.project.lastImageId.imageUrl)
        setProjectObject(data.project);
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
      setLoading(false);

    };

    if(projectId){
      getProject();
    }

  },[]);


  const applyHandler=async()=>{
    //cases
    //project not present or present
    //editing or generating

    //project handle (creation) should be in backend 
    setIsWorking(true);
    
    setPrompt('');
    
    try {
      const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/image/generate`;

      const form=new FormData();
      // form.append("image",selectedImage);
      if(projectId){
        form.append("projectId",projectId);
      }
      
      form.append("prompt",prompt)
      if(selectedImage instanceof File){
        form.append("image",selectedImage);
      }else{
        form.append("imageUrl",selectedImage);
      }

      console.log(form);
      const {data}=await axios.post(endpoint,form,{withCredentials:true});
      console.log(data)
      if(!data.success){
        toast.error(data.message);
        setIsWorking(false);
        return ;
      }  

      setProjectObject(data.project);
      setSelectedImage(data.project.lastImageId.imageUrl);
      setIsWorking(false);

      
      if(data.isNewProject){
        navigate(`/project/${data.project._id}`);
        return ;
      }
      
    } catch (error) {
      console.log("error in applyHandler",error);

    }
    setIsWorking(false);
  }

    if(loading) return <div className='p-5 text-2xl'>Loading ....</div>
  return (
    <div className='bg-[#fcfcfd] min-h-[calc(100vh-4rem)] p-3 flex flex-col gap-3'>
      <Editor selectedImage={selectedImage} setSelectedImage={setSelectedImage} isWorking={isWorking} prompt={prompt} setPrompt={setPrompt} applyHandler={applyHandler} />
      <Versions imagesArray={projectObject.editHistory} selectedImage={selectedImage} setSelectedImage={setSelectedImage}/>
    </div>
  )
}

export default Home