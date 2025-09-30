import axios from "axios";
import React, { useState } from "react";

const VerifyOTP = ({ setCurrentStep }) => {
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <form className="w-full bg-black/20 rounded-2xl p-6">
        <label htmlFor="" className="text-xs text-yellow-500">
          OTP*
        </label>
        <input
          type="number"
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
          className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
          placeholder="Enter you otp"
          maxLength={6}
          minLength={6}
          required
        />
        <button
          type="submit"
          className="text-center bg-yellow-500 text-black font-semibold text-base py-2 px-3 rounded-md w-full mt-6
        active:scale-90 transform duration-300 ease-in-out"
          onClick={handleVerifyOtp}
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
