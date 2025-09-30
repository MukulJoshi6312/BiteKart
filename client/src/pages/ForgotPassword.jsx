import { useState } from "react";
import AuthSlider from "../components/AuthSlider";
import EmailComp from "../components/EmailComp";
import VerifyOTP from "../components/VerifyOTP";
import ResetPassword from "../components/ResetPassword";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [1, 2, 3];
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "/api/auth/send-otp",
        { email },
        { withCredentials: true }
      );
      console.log(result);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return console.log("password not match");
    }
    try {
      const result = await axios.post(
        "/api/auth/reset-password",
        { email, newPassword },
        { withCredentials: true }
      );
      console.log(result);
      navigate("/signin");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-black w-full h-screen flex justify-center items-center px-4 lg:px-0">
      <div className="w-7xl bg-[#161616] h-[700px] rounded-2xl overflow-hidden ">
        {/* <h1>GbruGo</h1> */}
        <div className="flex rounded-2xl h-full relative">
          <span
            className=" text-white absolute top-5 left-5"
            onClick={() => navigate("/signin")}
          >
            <IoArrowBackCircle
              size={32}
              className="text-yellow-500 hover:scale-110 transition-all duration-300 ease-in-out"
            />
          </span>

          {/* Left Side */}
          <div className="px-6 justify-center lg:px-0 mx-auto md:w-full lg:w-1/2 h-full flex flex-col items-center text-2xl text-white/70">
            {/* ✅ full width diya */}
            <div className="flex mt-12 ml-16 md:ml-45  pl-0 w-full ">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-start w-full"
                >
                  {/* Step Circle */}
                  <span
                    className={`${
                      currentStep >= step
                        ? "bg-yellow-500 text-black border-amber-600"
                        : "bg-gray-800 text-white border-gray-400"
                    } w-9 h-9 rounded-full border-2 flex justify-center items-center text-base`}
                  >
                    {step}
                  </span>

                  {/* Line between steps */}
                  {index !== steps.length - 1 && (
                    <div
                      className={`${
                        currentStep > step
                          ? "border-yellow-500"
                          : "border-gray-400"
                      } flex-1 h-0.5 border-t-2 border-dotted`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            {currentStep === 1 && (
              <div className="w-full  md:max-w-[500px] mt-12">
                {/* <EmailComp setCurrentStep={setCurrentStep}/> */}
                <form className="w-full bg-black/20 rounded-2xl p-6">
                  <label htmlFor="" className="text-xs text-yellow-500">
                    Email*
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
                    placeholder="Enter your registred email"
                    required
                  />
                  <button
                    type="submit"
                    className="text-center bg-yellow-500 text-black font-semibold text-base py-2 px-3 rounded-md w-full mt-6
        active:scale-98 transform duration-300 ease-in-out"
                    onClick={handleSendOtp}
                  >
                    Send OTP
                  </button>
                </form>
              </div>
            )}
            {currentStep === 2 && (
              <div className="w-full md:max-w-[500px] mt-12">
                {/* <VerifyOTP setCurrentStep={setCurrentStep}/> */}
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
        active:scale-98 transform duration-300 ease-in-out"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </form>
              </div>
            )}
            {currentStep === 3 && (
              <div className="w-full md:max-w-[500px] mt-12">
                {/* <ResetPassword/> */}
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
                            active:scale-98 transform duration-300 ease-in-out"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Side - Slider */}
          <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden rounded-2xl">
            <AuthSlider />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
