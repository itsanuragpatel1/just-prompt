import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext=createContext()


const AuthContextProvider=({children})=>{

  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const getUser=async()=>{
      setLoading(true);
      const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/user/getUser`;
      const {data}=await axios.get(endpoint,{withCredentials:true});

      if(data.user){
        setUser(data.user);
        console.log(data.user);
      }
      setLoading(false);
    }

    getUser();
  },[]);


    const [user,setUser]=useState(null);

    return(
      <AuthContext.Provider  value={{user,setUser}} > 
        {children}
      </AuthContext.Provider>

    )
}

const useAuth=()=>useContext(AuthContext);

export {AuthContext,AuthContextProvider,useAuth};