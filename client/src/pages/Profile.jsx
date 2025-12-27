import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { PiUserCircleThin } from "react-icons/pi";
import { IoCameraOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";  //image icon
import { IoSettingsOutline } from "react-icons/io5"; //plan icon
import { GoProject } from "react-icons/go"; //project
import { AiFillStar } from "react-icons/ai"; //star
import { IoMdArrowRoundUp } from "react-icons/io";
import { FaRegSave } from "react-icons/fa"; //save
import { CiLock } from "react-icons/ci"; //lock
import { LuShieldCheck } from "react-icons/lu"; //shield
import { CiCircleCheck } from "react-icons/ci"; //check
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import LoaderComp from '../components/LoaderComp.jsx';

const InputField = ({ label, type = "text", value, placeholder, onChange }) => {
    return <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                disabled={label === "Email Address" ? true:false}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium hover:bg-white hover:border-gray-200"
            />
            {label === "Email Address" && (
                <div className="absolute right-3 top-3 text-green-500 text-xs font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    <CiCircleCheck size={10} className="mr-1" />
                    Verified
                </div>
            )}
        </div>
    </div>
}

const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [userFull, setUserFull] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [oldPassword,setOldPassword]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isWorking,setIsWorking]=useState(false);
    const [refreshProfile, setRefreshProfile] = useState(false);

    const {setUser}=useAuth();


    useEffect(() => {
        const getProfile = async () => {
            const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`;
            try {
                const { data } = await axios.get(endpoint, { withCredentials: true });

                if (data.success) {
                    setUserFull(data.userObj);
                    setFirstName(data.userObj.fullName.split(' ').at(0))
                    setLastName(data.userObj.fullName.slice(data.userObj.fullName.indexOf(" ")+1,))
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                console.log('error fetching profile', err);
                toast.error('Could not fetch profile');
            }

            setLoading(false);
        };

        getProfile();

    }, [refreshProfile])

    const onCameraClick = async (image) => {
        if(!image){
            return;
        } 

        try {
            const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-avatar`;
       
            const form=new FormData();
            form.append("image",image);
            const {data}=await axios.post(endpoint,form,{withCredentials:true});

            if(data.success){
                toast.success(data.message);
                setUser(data.user);
                setRefreshProfile(prev => !prev);
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log("error in update avatar",error);      
        }

    };


    const updatePasswordHandler=async()=>{
        if(isWorking){
            return ;
        }

        if(newPassword!==confirmPassword){
            return toast.error("New and cofirm password should same");
        }
        
        setIsWorking(true);

        try {
            
            const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-password`;

            const {data}=await axios.post(endpoint,{oldPassword,newPassword},{withCredentials:true});

            if(data.success){
                toast.success(data.message);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log("error in changePasswordHandler",error);
            toast.error("Failed to update password");
        } finally{
            setIsWorking(false);
        }
    }

    const updateProfile=async()=>{
        if(isWorking){
            return ;
        }
        setIsWorking(true);

        try {
            const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`;
       
            const {data}=await axios.post(endpoint,{firstName,lastName},{withCredentials:true});

            if(data.success){
                toast.success(data.message);
                setUser(data.user);
                setRefreshProfile(prev => !prev);
            }else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log("error in update profile",error);
            
        } finally{
            setIsWorking(false)
        }
    }



    if (loading) return <LoaderComp/>;

    return (

        <div className='max-w-3xl m-auto flex flex-col gap-10 my-10 px-5 '>

            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    {/* Profile Image / Default Icon */}
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {userFull?.avatar ? (
                            <img
                                src={userFull.avatar}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <PiUserCircleThin className="text-gray-500 text-6xl" />
                        )}
                    </div>

                    {/* Camera Icon */}
                    <input type="file" hidden id='profile' onChange={(e)=>{onCameraClick(e.target.files[0])}}/>
                    <label
                        htmlFor='profile'
                        className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition cursor-pointer"
                    >
                        <IoCameraOutline className="text-lg" />
                    </label>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-semibold text-gray-900">{userFull?.fullName || ''}</h2>
                <p className="text-gray-600 text-sm">{userFull?.email || ''}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Projects"
                    value={userFull.projectsCount}
                    subtext=""
                    icon={GoProject}
                    color="yellow"
                />

                <StatCard
                    label="Images Generated"
                    value={userFull.imagesCount}
                    subtext=""
                    icon={CiImageOn}
                    color="purple"
                />

                <StatCard
                    label="Current Plan"
                    value={userFull.plan}
                    subtext=""
                    icon={IoSettingsOutline}
                    color="blue"
                />

            </div>


            {/* NEW: Upgrade to Pro Banner */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-gray-200/50 relative overflow-hidden group">
                {/* Decorative background blur */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors"></div>

                <div className="flex items-center gap-5 relative z-10 mb-6 md:mb-0">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                        <AiFillStar size={28} className="text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Upgrade to Pro</h3>
                        <p className="text-blue-100/80 text-sm mt-1 font-medium">Get 10,000 credits, priority support & 4K upscaling.</p>
                    </div>
                </div>

                <button className="relative z-10 px-8 py-3.5 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-lg active:scale-95 flex items-center gap-2 group/btn">
                    View Plans
                    <IoMdArrowRoundUp size={16} className="text-gray-400 group-hover/btn:text-gray-900 transition-colors" />
                </button>
            </div>


            {/* Minimal Modern Settings Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Horizontal Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-all border-b-2 
                      ${activeTab === 'profile'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-all border-b-2 
                      ${activeTab === 'security'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Security & Password
                    </button>
                </div>

                <div className="p-8">
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField key="first" label="First Name" value={firstName} onChange={(e)=>{setFirstName(e.target.value)}} />
                                <InputField key="last" label="Last Name" value={lastName} onChange={(e)=>{setLastName(e.target.value)}} />
                            </div>

                            <InputField key="email" label="Email Address" type="email" value={userFull.email} />

                            {/* <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-gray-700">Bio</label>
                          </div>
                          <textarea 
                            className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all h-32 resize-none placeholder:text-gray-400 font-medium hover:bg-white hover:border-gray-200
                              ${isGeneratingBio ? 'animate-pulse bg-purple-50' : ''}`}
                            value={bioText}
                            onChange={(e) => setBioText(e.target.value)}
                          />
                          <p className="text-xs text-gray-400 mt-2 text-right">{bioText.length}/500 characters</p>
                        </div> */}

                            <div className="pt-4 flex justify-end">
                                <button onClick={()=>{updateProfile()}} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95">
                                    <FaRegSave size={16} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">

                            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col gap-4 md:flex-row">
                                {/* <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm mt-1">
                                    <LuShieldCheck size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-blue-900">Two-Factor Authentication</h4>
                                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">Add an extra layer of security to your account by requiring a code when logging in.</p>
                                </div> */}
                                <div className='flex gap-2 flex-1'>
                                    <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm mt-1 h-fit">
                                        <LuShieldCheck size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-blue-900">Two-Factor Authentication</h4>
                                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">Add an extra layer of security to your account by requiring a code when logging in.</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200">
                                    Enable
                                </button>
                            </div>

                            <div className="space-y-5 border-t border-gray-100 pt-8">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <CiLock size={18} className="text-gray-400" />
                                    Change Password
                                </h3>

                                <InputField key="currPass" label="Current Password" type="password" placeholder="••••••••" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField key="newPass" label="New Password" type="password" placeholder="••••••••" value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}} />
                                    <InputField key="oldPass" label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button  onClick={updatePasswordHandler} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95">
                                        {isWorking?'Updating ...':'Update Password'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>



        </div>
    )
}

export default Profile