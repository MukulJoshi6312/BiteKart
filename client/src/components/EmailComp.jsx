import React, { useState } from 'react'
import axios from 'axios'
const EmailComp = ({setCurrentStep}) => {

    const[email,setEmail] = useState("");

    const handleSendOtp = async(e)=>{
        e.preventDefault();
        try{
        const result = await axios.post('/api/auth/send-otp',{email},{withCredentials:true});
        console.log(result)
        setCurrentStep(prev => prev+1);
        }
        catch(error){
          console.log(error.message)
        }
    }

  return (
    <form className='w-full bg-black/20 rounded-2xl p-6'>
        <label htmlFor="" className='text-xs text-yellow-500'>Email*</label>
        <input type="email"
        onChange={(e)=>setEmail(e.target.value)}
        value={email}
        className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
        placeholder='Enter you email'
        required
        />
        <button 
        type='submit'
        className='text-center bg-yellow-500 text-black font-semibold text-base py-2 px-3 rounded-md w-full mt-6
        active:scale-90 transform duration-300 ease-in-out'
        onClick={handleSendOtp}
        >Send OTP</button>
    </form>
  )
}

export default EmailComp