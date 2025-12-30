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
import { autoPrompt } from '../assets/autoPrompt.js'
import LoaderComp from '../components/LoaderComp.jsx'
import { useAuth } from '../context/AuthContext'
import { BsChevronDoubleRight } from 'react-icons/bs'

const Home = () => {

  const { projectId } = useParams();
  const [isWorking, setIsWorking] = useState(false)
  const [loading, setLoading] = useState(false);
  const [projectObject, setProjectObject] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const location = useLocation();
  const isPresetFlowRef = useRef(false);
  const {user,setCredits}=useAuth();


  const navigate = useNavigate();

  useEffect(() => {
    const presetPrompt = location.state?.presetPrompt;
    const presetImage = location.state?.presetImageFile;

    if (presetPrompt && presetImage) {
      isPresetFlowRef.current = true;
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


  useEffect(() => {
    const getProject = async () => {
      setLoading(true);
      try {
        const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/project/${projectId}`;

        const { data } = await axios.get(endpoint, { withCredentials: true });

        if (data.success) {
          setSelectedImage(data.project.lastImageId.imageUrl)
          setProjectObject(data.project);
          // toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
          console.log("error in getProject ",error);
          toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      getProject();
    }

  }, []);


  const applyHandler = async (option) => {
    //cases
    //project not present or present
    //editing or generating
    //project handle (creation) should be in backend 
    if(!user){
      toast.error("Please Login to Continue");
      return ;
    }

    if (isWorking) {
      return;
    }

    setIsWorking(true);

    setPrompt('');

    try {
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/image/generate`;

      const form = new FormData();
      // form.append("image",selectedImage);
      if (projectId) {
        form.append("projectId", projectId);
      }

      if (option=="auto") {
        if(!selectedImage){
          toast.error("No image selected. Please choose one.");
          return ;
        }
        form.append("prompt", autoPrompt)
      } else {
        form.append("prompt", prompt)
      }
      
      if(option=="upscale"){
        if(!selectedImage){
          toast.error("No image selected. Please choose one.");
          return ;
        }
        form.append("upscale",true);
      }

      if (selectedImage instanceof File) {
        form.append("image", selectedImage);
      } else {
        form.append("imageUrl", selectedImage);
      }

      console.log(form);
      const { data } = await axios.post(endpoint, form, { withCredentials: true });
      console.log(data)
      if (!data.success) {
        toast.error(data.message);
        setIsWorking(false);
        return;
      }

      setProjectObject(data.project);
      setSelectedImage(data.project.lastImageId.imageUrl);
      setCredits(data.remainingCredits);
      setIsWorking(false);


      if (data.isNewProject) {
        navigate(`/project/${data.project._id}`);
        return;
      }

    } catch (error) {
      console.log("error in applyHandler", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsWorking(false);
    }
    
  }

  const reRunHandler = async () => {
    if(!user){
      toast.error("Please Login to Continue");
      return ;
    }

    if (isWorking) {
      toast.error("Already processing. Please wait.");
      return;
    }

    if (!projectId || selectedImage instanceof File) {
      toast.error("Re-Run works only on generated images.");
      return;
    }

    setIsWorking(true);

    try {
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/image/re-run`;
      const response = await axios.post(endpoint, { imageUrl:selectedImage }, { withCredentials: true })
      const interData = response.data;

      if (!interData.success) {
        toast.error(interData.message);
        setIsWorking(false);
      }

      const form = new FormData();

      form.append("prompt", interData.prompt);
      form.append("imageUrl", interData.imageUrl);
      form.append("projectId",projectId);

      const endpoint1 = `${import.meta.env.VITE_BACKEND_URL}/api/image/generate`;

      const { data } = await axios.post(endpoint1, form, { withCredentials: true });

      if (data.success) {
        setProjectObject(data.project);
        setSelectedImage(data.project.lastImageId.imageUrl);
      } else {
        toast.error(data.message);
      }
      setIsWorking(false);
    } catch (error) {
      console.log("error in reRunHandler", error);
      toast.error("Something went wrong. Please try again.");
    }
    setIsWorking(false);
  };

  const fixFaceHandler=async()=>{

    if(!user){
      toast.error("Please Login to Continue");
      return ;
    }
    
    if(isWorking){
      toast.error("Already processing. Please wait.");
      return ;
    }

    if (!projectId || selectedImage instanceof File) {
      toast.error("Fix Face works only on Edited images.")
      return;
    }

    setIsWorking(true);

    try {
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/image/fix-face`;
      const {data} = await axios.post(endpoint, { imageUrl:selectedImage , projectId }, { withCredentials: true })

      if (data.success) {
        setProjectObject(data.project);
        setSelectedImage(data.project.lastImageId.imageUrl);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error in fix face handler", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
       setIsWorking(false);
    }
  };

  if (loading) return <LoaderComp/>
  
  return (
    <div className='bg-[#fcfcfd] min-h-[calc(100vh-4rem)] p-3 flex flex-col gap-3'>
      <Editor selectedImage={selectedImage} setSelectedImage={setSelectedImage} isWorking={isWorking} prompt={prompt} setPrompt={setPrompt} applyHandler={applyHandler} reRunHandler={reRunHandler} fixFaceHandler={fixFaceHandler} />
      <Versions imagesArray={projectObject.editHistory} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </div>
  )
}

export default Home