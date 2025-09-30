import axios from "axios";
import React from "react";
import { FaPen } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice";

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = async (itemId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirmed) {
      try {
        const result = await axios.delete(`/api/item/delete-item/${itemId}`, {
          withCredentials: true,
        });
        console.log(result);
        dispatch(setMyShopData(result?.data));
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };
  return (
    <div
      className={`flex bg-[#161616] rounded-lg shadow-md overflow-hidden w-full max-w-3xl hover:scale-103 transition-all duration-300 ease-in-out h-[170px] ${
        data?.foodType === "Veg"
          ? "hover:border-green-300 border-[1px]"
          : "hover:border-red-300 border-[1px]"
      }  `}
    >
      <div className="w-36 h-full flex-shrink-0 bg-gray-50">
        <img src={data?.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div className="">
          <h2 className="text-gray-200">{data?.name}</h2>
          <p className="text-gray-200">Category: {data?.category}</p>
          <p className="text-gray-200">Food Type: {data?.foodType}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl text-yellow-500">
            {" "}
            <span className="font-bold">Price: </span>
            {data?.price}{" "}
          </div>
          <div className="flex gap-4 items-center justify-center cursor-pointer">
            <div
              className="bg-yellow-500 p-2 rounded-full hover:bg-yellow-600 transition-all duration-300 hover:scale-95"
              onClick={() => navigate(`/edit-item/${data?._id}`)}
            >
              <FaPen size={24} />
            </div>
            <div
              onClick={() => handleDelete(data?._id)}
              className="bg-red-500 p-2 rounded-full text-white  hover:bg-red-600 transition-all duration-300 hover:scale-95"
            >
              <MdDeleteForever size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
