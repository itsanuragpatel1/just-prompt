import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext=createContext()


const AuthContextProvider=({children})=>{

  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const getUser=async()=>{
      setLoading(true);
      try {
      const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/user/getUser`;
      const {data}=await axios.get(endpoint,{withCredentials:true});

      if(data.user){
        setUser(data.user);
        setCredits(data.user.imageCredits);
        console.log(data.user);
      }
      } catch (error) {
        console.log("error in get user ",error);
      } finally{
        setLoading(false);
      }    
    }

    getUser();
  },[]);


    const [user,setUser]=useState(null);
    const [credits,setCredits]=useState(null);

    return(
      <AuthContext.Provider  value={{user,setUser,credits,setCredits,loading}} > 
        {children}
      </AuthContext.Provider>

    )
}

const useAuth=()=>useContext(AuthContext);

export {AuthContext,AuthContextProvider,useAuth};