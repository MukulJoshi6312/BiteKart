import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import AuthSlider from "../components/AuthSlider";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import SignInWithGoogle from "../components/SignInWithGoogle";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // yaha add karo
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/signin", formData,{ withCredentials: true });
      console.log("login successfully", response.data);
      localStorage.setItem("token", response?.data?.token);
      dispatch(setUserData(response?.data.user));
    } catch (error) {
      console.error("Error while saving data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black w-full h-screen flex justify-center items-center px-4 lg:px-0">
      <div className="w-7xl bg-[#161616] h-[700px] rounded-2xl overflow-hidden ">
        {/* <h1>GbruGo</h1> */}
        <div className="flex flex-row-reverse rounded-2xl h-full">
          {/* Left Side */}
          <div className="px-6 lg:px-0 w-full md:w-full lg:w-1/2 h-full flex   text-2xl text-white/70">
            <form
              action=""
              onSubmit={handleSubmit(onSubmit)}
              className="w-full lg:w-3/4  mx-auto flex flex-col gap-4 justify-center "
            >
              <h2 className="text-yellow-500 text-3xl font-semibold text-center underline underline-offset-8">
                Sign In
              </h2>

              <div className="flex flex-col w-full">
                <label htmlFor="name" className="text-xs text-yellow-500">
                  Email *
                </label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full relative">
                <label htmlFor="name" className="text-xs text-yellow-500">
                  Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
                <div
                  className="absolute top-1/2 right-3 text-yellow-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaRegEye size={20} />
                  ) : (
                    <FaRegEyeSlash size={20} />
                  )}
                </div>
              </div>
              <div 
              onClick={()=>navigate('/forgot-password')}
              className="text-right text-xs text-yellow-500 cursor-pointer">
                <span>Forgot Password?</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-yellow-500 cursor-pointer w-full p-2 mt-8 text-black rounded-2xl text-sm font-bold disabled:bg-white transition-all duration-300 ease-in-out active:scale-98`}
              >
                {loading ? "Please wait" : "Login"}
              </button>
              <SignInWithGoogle />
              <div
                className=" text-sm text-center cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <p>
                  Don't have an account?{" "}
                  <span className="text underline text-yellow-500">
                    Sign up{" "}
                  </span>
                </p>
              </div>
            </form>
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

export default SignIn;
