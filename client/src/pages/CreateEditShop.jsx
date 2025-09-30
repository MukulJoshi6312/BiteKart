import React, { useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { setCurrentAddress } from "../redux/userSlice";
import axios from "axios";
import { setMyShopData } from "../redux/ownerSlice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { city, state, currentAddress } = useSelector((state) => state.user);
  const [name, setName] = useState(myShopData?.shop?.name || "");
  const [address, setAddress] = useState(
    myShopData?.shop?.address || currentAddress
  );
  const [City, setCity] = useState(myShopData?.shop?.city || city);
  const [State, setState] = useState(myShopData?.shop?.state || state);
  const [frontendImage, setFrontendImage] = useState(
    myShopData?.shop?.image || null
  );
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", City);
      formData.append("state", State);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(`/api/shop/create-edit-shop`, formData, {
        withCredentials: true,
      });
      dispatch(setMyShopData(result.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    console.log("Frontend image ", frontendImage);
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-black to-gray-800 min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px] bg-yellow-500 p-2 rounded-full hover:scale-95"
        onClick={() => navigate("/")}
      >
        <IoArrowBack size={20} />
      </div>
      <div className="max-w-lg w-full bg-[#161616] shadow-xl rounded-2xl p-8 border">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-300 p-4 rounded-full mb-4">
            <FaUtensils className="text-black w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-200">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-1">
              Name *
            </label>
            <input
              type="text"
              placeholder="Enter shop name"
              className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-1">
              Image *
            </label>
            <input
              type="file"
              accept="image/*"
              placeholder="Choose you photo"
              className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
              required
              onChange={(e) => {
                handleImage(e);
              }}
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="image"
                  className="w-full h-48 object-cover rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>

          <div className="flex gap-5 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-yellow-500 mb-1">
                City *
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
                required
                onChange={(e) => setCity(e.target.value)}
                value={City}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-yellow-500 mb-1">
                State *
              </label>
              <input
                type="text"
                placeholder="State"
                className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
                required
                onChange={(e) => setState(e.target.value)}
                value={State}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-500 mb-1">
              Address *
            </label>
            <input
              type="text"
              placeholder="Enter shop address"
              className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
              required
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>
          <button
            disabled={loading}
            className={`bg-yellow-500 cursor-pointer w-full p-2 mt-8 text-black rounded-lg text-sm font-bold disabled:bg-white transition-all duration-300 ease-in-out active:scale-98`}
          >
            {loading ? "Please wait..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
