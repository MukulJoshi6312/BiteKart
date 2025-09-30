import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Navbar />
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-gray-300 shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils
                size={25}
                className="text-yellow-500 w-16 h-16 sm:w-20 sm:h-20 mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add your restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Joi our food delivery platform and reach thousands of hungry
                customers every day.
              </p>
              <button
                className="bg-yellow-500 text-black font-bold px-5 sm:px-6 py-2 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-200"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      
      {myShopData && (
        <div className=" w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl flex items-center gap-3 mt-8 text-white">
            <FaUtensils size={25} className="text-yellow-500 w-14 h-14" />
            Welcome to {myShopData?.shop?.name}
          </h1>
          <div className="bg-[#161616] shadow-lg rounded-xl overflow-hidden border  hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
            <img
              src={myShopData?.shop?.image}
              alt={myShopData?.shop?.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div
              className="absolute top-4 right-4 bg-yellow-500 p-2 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300 cursor-pointer"
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={20} />
            </div>

            <div className="text-gray-400 p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2">
                {myShopData?.shop?.name}
              </h1>
              <p className="">
                {myShopData?.shop?.city},{myShopData?.shop?.state}
              </p>
              <p>{myShopData?.shop?.address}</p>
              <p className="mb-2">{myShopData?.shop?.owner?.mobile}</p>
            </div>
          </div>
        </div>
      )}

      {myShopData?.shop?.items?.length === 0 && (

        <div className="flex justify-center items-center p-4 sm:p-6 bg-re">
          <div className="w-full max-w-md bg-gray-300 shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils
                size={25}
                className="text-yellow-500 w-16 h-16 sm:w-20 sm:h-20 mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add your Food Items
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>
              <button
                className="bg-yellow-500 text-black font-bold px-5 sm:px-6 py-2 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-200"
                onClick={() => navigate("/add-item")}
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData?.shop?.items.length > 0 && (
        <div className="flex flex-col items-center gap-4 w-full max-w-3xl py-12 px-6 md:px-0">
          <h2 className="text-white text-xl text-start w-full">Available Foods</h2>

          {myShopData?.shop?.items?.map((item, index) => (
            <OwnerItemCard data={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
