import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { useState } from 'react';




const Profile = () => {
    const {userData} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);

const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin")
    } catch (error) {
      console.log(error);
    }finally{
        setLoading(false);
    }
  };
   
  return (
    <div className='bg-black w-full h-screen flex justify-center items-center'>

        <div className='max-w-xl h-auto p-5 rounded-2xl mx-auto bg-[#161616] flex flex-col gap-2'>

            <div onClick={()=>navigate('/')}
                className='bg-yellow-500 px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-12 cursor-pointer text-xs'>
                <IoArrowBack/>
            <span>Back</span>    
            </div>    

            <div className='flex items-center gap-2'>
                <FaUser className='text-xl text-yellow-500'/>
                <p className='text-md text-gray-200 font-semibold'> Name : <span className='font-normal'> {userData?.fullName}</span></p>
            </div>
            <div className='flex items-center gap-2'>
                <MdEmail className='text-xl text-yellow-500'/>
                <p className='text-md text-gray-200 font-semibold'> Email : <span className='font-normal'> {userData?.email}</span></p>
            </div>
            <div className='flex items-center gap-2'>
                <FaMobileScreenButton className='text-xl text-yellow-500'/>
                <p className='text-md text-gray-200 font-semibold'> Mobile : <span className='font-normal'> {userData?.mobile}</span></p>
            </div>
            <div className='flex items-center gap-2'>
                <FaUserGroup className='text-xl text-yellow-500'/>
                <p className='text-md text-gray-200 font-semibold'> Role : <span className='font-normal'> {userData?.role}</span></p>
            </div>

            <button onClick={handleLogout} className='bg-yellow-500 rounded-full mt-4'
            disabled={loading}>
               {loading? "Please wait..." : "Logout" }
            </button>
        </div>

    </div>
  )
}

export default Profile