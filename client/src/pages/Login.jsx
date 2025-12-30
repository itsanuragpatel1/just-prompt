import React, { useState } from 'react'
import { FaGoogle } from "react-icons/fa";
import axios from 'axios'
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = ({setShowLogin}) => {

    const [state,setState]=useState("Login")
    const [fullName,setFullName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [loading,setLoading]=useState(false);
    const [otp,setOtp]=useState('');
    const [showOtpPage,setShowOtpPage]=useState(false);
    const {setUser,setCredits}=useAuth();

    const submitHandler=async(e)=>{
        e.preventDefault()
        if(loading){
            return ;
        }
        setLoading(true);
        try {    
            const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/auth/${state=='Login'?'login':'send-otp'}`;

            // const {data}=await axios.post(endpoint,{fullName,email,password},{withCredentials:true});
            if(state=='Login'){
                const {data}=await axios.post(endpoint,{email,password},{withCredentials:true});

                if(data.success){
                    setUser(data.user);
                    setCredits(data.user.imageCredits);
                    toast.success(data.message);
                    setShowLogin(false);
                }else{
                    toast.error(data.message);
                }

            }else{ 
                const {data}=await axios.post(endpoint,{email},{withCredentials:true});
                
                if(data.success){
                    setShowOtpPage(true);
                }else{
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log("error in submitHandler",error);
        }
        setLoading(false);

    }

    const verifyOtp=async(e)=>{
        e.preventDefault();
        if(loading){
            return ;
        }
        setLoading(true);
        try {
            console.log(email,fullName,password);
            const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`;

            const {data}=await axios.post(endpoint,{fullName,email,password,otp},{withCredentials:true});

            if(data.success){
                setUser(data.user);
                setCredits(data.user.imageCredits);
                toast.success(data.message);
                setShowLogin(false);

            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log("error in verifyOtp",error);
        }
        setLoading(false);
    }

    const handleGoogleLogin=async()=>{
        try {
            window.location.href=`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
        } catch (error) {
            console.log("error in handleGoogleLogin",error);
        }
    }


  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/40 z-60  flex justify-center items-center' onClick={()=>setShowLogin(false)}>
       
        {showOtpPage? 
        <form action="" className='flex flex-col gap-2 items-center bg-white w-sm max-w-xl rounded-xl py-6 px-5  mx-2 z-100 shadow-xl' onClick={(e)=>e.stopPropagation()} onSubmit={(e)=>{verifyOtp(e)}}>
            <h1 className='text-2xl mb-3'>Verify your E-mail</h1>
            <h4 className='text-center text-gray-700 mb-4'>Enter code we've sent to your email <br /> {email||"test@gmail.com"} </h4>
            <input type="text" minLength={6} maxLength={6}  value={otp} onChange={(e)=>setOtp(e.target.value)} name='otp' className='border  rounded-xl h-13  tracking-[45px] max-w-full text-4xl py-3 text-center pl-[20px]' autoFocus />
            <h4 className='text-gray-700 m-2'>Didn't get the code ? <button className='underline text-black cursor-pointer'> resend it </button> </h4>
            <button type='submit' className='bg-black text-white rounded-lg h-11 py-2 mt-4 cursor-pointer w-full'>{loading?'Verifying...':'Submit'} </button>
        </form>

        :
        <form action=""  className='flex-col bg-white w-sm max-w-xl rounded-xl py-3 px-5  mx-2 z-100 shadow-xl' onClick={(e)=>e.stopPropagation()} onSubmit={(e)=>submitHandler(e)}>
            <h2 className='mx-auto text-3xl text-center'>{state}</h2>
            {state=="Signup" && 
          
            <div className='mt-3'>
                <p>Full Name</p>
                <input type="text"  name='fullName' className='border border-gray-300 rounded-lg w-full px-2 py-2 outline-none' value={fullName} onChange={(e)=>(setFullName(e.target.value))} />
            </div>

            }
            
            <div className='mt-3'>
                <p>Email</p>
                <input type="email" required name='email' className='border border-gray-300 rounded-lg w-full px-2 py-2 outline-none' value={email} onChange={(e)=>(setEmail(e.target.value))}/>
            </div>
            <div className='mt-3'>
                <div className='flex justify-between'>
                    <p>Password</p>
                    {state=="Login" &&  <p className='underline cursor-pointer'>Forgot your password?</p> }
                </div>
                <input type="password" minLength={8} required className='border border-gray-300 rounded-lg w-full px-2 py-2 outline-none' value={password} onChange={(e)=>(setPassword(e.target.value))}/>
            </div>
            <button className='bg-black text-white rounded-lg py-2 mt-4 cursor-pointer w-full' type='submit' >
                {loading?'Loading...':state}
            </button>
            {/* <p className='mx-auto my-3'>or</p> */}
            <div className='flex items-center my-3'>
                <hr  className='flex-1'/>
                <p className='mx-3'>or</p>
                <hr className='flex-1' />
            </div>
            <button className='flex items-center justify-center gap-2 mx-auto  border rounded-lg py-2 w-full cursor-pointer' type='button' onClick={(e)=>{handleGoogleLogin(e)}}>
                <FaGoogle/>
                <p>{state} with Google</p> 
            </button>

            <div className='mx-auto mt-2'>
            {state=="Login"? <p>Don't have an account? <button onClick={()=>setState('Signup')} type='button' className='cursor-pointer text-gray-700'>Signup</button></p>: <p>Already have an account? <button onClick={()=>setState('Login')} type='button' className='cursor-pointer text-gray-700'>Login</button></p> }
            </div>
        </form>
         
        }

    </div>
  )
}

export default Login