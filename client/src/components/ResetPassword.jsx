import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResetPassword = ({ setCurrentStep }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async(e) => {
    e.preventDefault();
    if(newPassword !== confirmPassword) {
      return console.log("password not match")
    }
     try{
        const result = await axios.post('/api/auth/reset-password',{email,newPassword},{withCredentials:true});
        console.log(result)
        navigate("/signin")
        
        }
        catch(error){
          console.log(error.message)
        }
  };

  return (
    <form className="w-full bg-black/20 rounded-2xl p-6">
      <div className="flex flex-col w-full relative">
        <label htmlFor="" className="text-xs text-yellow-500">
          New password*
        </label>
        <input
          type={showNewPassword ? "text" : "password"}
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
          placeholder="Enter you new email"
          required
        />
        <div
          className="absolute top-1/2 right-3 text-yellow-500 cursor-pointer"
          onClick={() => setShowNewPassword((prev) => !prev)}
        >
          {showNewPassword ? (
            <FaRegEye size={20} />
          ) : (
            <FaRegEyeSlash size={20} />
          )}
        </div>
      </div>

      <div className="flex flex-col w-full relative mt-4">
        <label htmlFor="" className="text-xs text-yellow-500">
          Confirm password*
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          className="w-full  outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
          placeholder="Enter you confirm email"
          required
        />

        <div
          className="absolute top-1/2 right-3 text-yellow-500 cursor-pointer"
          onClick={() => setShowConfirmPassword((prev) => !prev)}
        >
          {showConfirmPassword ? (
            <FaRegEye size={20} />
          ) : (
            <FaRegEyeSlash size={20} />
          )}
        </div>
      </div>
      <button
        type="submit"
        className="text-center bg-yellow-500 text-black font-semibold text-base py-2 px-3 rounded-md w-full mt-6
        active:scale-90 transform duration-300 ease-in-out"
        onClick={handleResetPassword}
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
