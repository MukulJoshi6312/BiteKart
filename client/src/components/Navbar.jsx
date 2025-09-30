import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  setSerachItems,
  setUserData,
} from "../redux/userSlice";
import { FaPlus } from "react-icons/fa6";
import { TbReceiptFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toggleThemeMode } from "../redux/themeSlice";

const Navbar = () => {
  const { userData, city, cartItems,myOrders } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const { themeMode } = useSelector((state) => state.theme);
  const [showPopup, setShowPopup] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [myOrderCount,setMyOrderCount] = useState(0);
  const [query, setQuery] = useState("");
  const popupRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get("/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(
        `/api/item/search-items?query=${query.trim()}&city=${city}`,
        { withCredentials: true }
      );
      dispatch(setSerachItems(result?.data));
      dispatch(setSearchQuery(query?.trim()));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (!popupRef?.current?.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutSideClick);
    return () => document.removeEventListener("mousedown", handleOutSideClick);
  }, [showPopup]);

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark"); // <html> pe lagao
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => {
        handleSearchItems();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      dispatch(setSerachItems([]));
    }
  }, [query]);

  useEffect(()=>{
  const count = myOrders.filter(order => order?.shopOrders?.status !== "DELIVERED").length;
  setMyOrderCount(count);
  },[myOrders])



  return (
    <div className="w-full h-[80px] bg-black   flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999]">
      {showSearch && userData.role === "user" && (
        <div className="md:hidden w-[90%] h-[70px] bg-[#161616] shadow-xl rounded-lg items-center gap-[20px]  flex fixed top-[80px] left-[5%]">
          <div className="text-white flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className=" text-yellow-500" />
            <div className="w-[80%] truncate text-gray-200">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-yellow-500" />
            <input
              type="text"
              placeholder="search food..."
              className="px-[10px] text-gray-200 outline-0 w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      <h1 className="text-xl sm:text-3xl font-bold mb-2 text-yellow-500">
        BiteKart
      </h1>
      {userData.role === "user" && (
        <div className="md:w-[60%] lg:w-[40%] h-[60px] bg-[#161616] shadow-xl rounded-lg items-center gap-[20px] hidden md:flex">
          <div className="text-white flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot size={25} className=" text-yellow-500" />
            <div className="w-[80%] truncate text-gray-200">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-yellow-500" />
            <input
              type="text"
              placeholder="search food..."
              className="px-[10px] text-gray-200 outline-0 w-full"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {userData.role === "user" && (
          <IoIosSearch
            size={25}
            className="text-yellow-500 md:hidden"
            onClick={() => setShowSearch((prev) => !prev)}
          />
        )}
        {userData.role === "user" && <></>}
        {userData.role === "owner" ? (
          <>
            {myShopData && (
              <button
                className="bg-yellow-500 flex items-center gap-1 p-2 cursor-pointer rounded-full hover:scale-95"
                onClick={() => navigate("/add-item")}
              >
                <FaPlus size={20} />
                <span className="hidden md:block">Add Food Item</span>
              </button>
            )}

         
            <div
            onClick={() => navigate("/my-orders")}
            className="bg-yellow-500 flex  items-center gap-2 cursor-pointer hover:scale-95 relative p-2 rounded-full text-black font-medium">
              <TbReceiptFilled size={20} />
              <span
                className="hidden md:block"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-black bg-yellow-600 rounded-full px-[6px] py-[1px]">
               {myOrderCount}
              </span>
              {console.log("My Shop data in owner page ",myOrders)}
            </div>
            
          </>
        ) : (
          <>
            {userData?.role === "user" && (
              <div
                className="relative cursor-pointer text-yellow-500"
                onClick={() => navigate("/cart-page")}
              >
                <IoCartOutline size={25} className=" font-bold" />
                <span
                  className={`absolute -top-[12px] -right-[9px] bg-yellow-500 rounded-full w-4 h-4 text-black flex items-center justify-center p-3 text-sm font-bold ${
                    cartItems?.length > 0 && "animate-bounce"
                  }`}
                >
                  {cartItems?.length}
                </span>
              </div>
            )}
            {userData?.role !== "deliveryBoy" &&
            <button
              onClick={() => navigate("/my-orders")}
              className="hidden md:block px-3 py-1 rounded-lg bg-yellow-500 text-black text-sm font-medium hover:scale-95 cursor-pointer"
            >
              My Order
            </button>}
          </>
        )}

        <div
          className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center font-bold cursor-pointer shadow-2xl capitalize"
          onClick={() => setShowPopup((prev) => !prev)}
        >
          {userData?.fullName.slice(0, 1)}
        </div>

        {showPopup && (
          <div
            ref={popupRef}
            className={`fixed top-[80px] right-[10px] md:right-[10%] lg:right-[21%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999] ${
              userData?.role === "deliveryBoy"
                ? "md:right-[35%] lg:right-[40%]"
                : ""
            }`}
          >
            <div className="text-[17px] font-semibold cursor-pointer capitalize"
            onClick={()=>navigate('/profile')}
            >
              {userData?.fullName}
            </div>
            <div
              className="text-[17px] font-semibold cursor-pointer md:hidden"
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </div>
            {/* <button 
  className="text-yellow-500"
  onClick={() => dispatch(toggleThemeMode())}
>
  {themeMode === "dark" ? "🌙 Dark" : "☀️ Light"}
</button> */}
            <div
              className="border-t-[1px] border-gray-600 text-[17px] font-semibold text-red-500 cursor-pointer "
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
