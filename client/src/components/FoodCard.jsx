import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ data }) => {
  const renderStart = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar className="text-yellow-500" key={i} />
        ) : (
          <FaRegStar className="" key={i} />
        )
      );
    }
    return stars;
  };

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleIncrement = () => {
    if (quantity === 5) {
      alert("Sorry! you can't add more fo this item");
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity === 1) {
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  return (
    <div
      className={`relative  hover:bg-[#1f1f1f] hover:scale-103 transition-all duration-300 ease-in-out p-3 rounded-xl  border-[1px] ${
        data.foodType === "Veg"
          ? "hover:border-green-000 "
          : "hover:border-red-000"
      }`}
    >
      <div className="w-full ">
        <img
          src={data.image}
          alt=""
          className="w-full h-[200px] object-cover rounded-2xl"
        />
      </div>
      <div className="mt-2 flex px-3 items-center justify-between">
        <div>
          <div className="text-gray-200 text-xl">{data?.name}</div>
          {/* <div>{data?.rating}</div> */}
          <div className="flex  text-yellow-500 items-center">
            {renderStart(data?.rating?.average)}{" "}
            <span className="text-white"> / {data?.rating?.count}</span>
          </div>
          <p className="text-gray-400 text-xs">Shop : {data?.shop?.name}</p>
        </div>
        <div>
          <h2 className="text-xl text-gray-200 font-bold flex items-center gap-[1px]">
            <FaRupeeSign size={17} />
            {data?.price} /-
          </h2>
        </div>
      </div>
      {/* countity and add to cart */}
      <div className="flex items-center justify-between mt-3 px-3">
        <div className="flex text-white text-md gap-2 border-[1px] border-yellow-500 rounded-full px-3 ">
          <button onClick={() => handleDecrement()} className="cursor-pointer">
            <FaMinus />
          </button>
          <span>{quantity}</span>
          <button onClick={handleIncrement} className="cursor-pointer">
            <FaPlus />
          </button>
        </div>
        <div>
          {cartItems.some((i) => i.id === data?._id) ? (
            <button
              className="text-white bg-gray-800 px-3 py-1 rounded-full hover:scale-95 transition-all duration-300 ease-in-out flex items-center gap-1 cursor-pointer font-bold"
              onClick={() => navigate("/cart-page")}
            >
              Go To Cart
            </button>
          ) : (
            <button
              className="text-black bg-yellow-500 px-3 py-1 rounded-full hover:scale-95 transition-all duration-300 ease-in-out flex items-center gap-1 cursor-pointer font-bold"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: data?._id,
                    name: data?.name,
                    price: data?.price,
                    image: data?.image,
                    shop: data?.shop,
                    quantity,
                    foodType: data?.foodType,
                  })
                )
              }
            >
              Cart <FaCartArrowDown />
            </button>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-3 text-white px-3 mt-2 flex">
        {data?.foodType === "Veg" ? (
          <div className="flex items-center gap-1  px-3 rounded-full bg-green-700 text-sm py-1">
            Veg <FaLeaf />
          </div>
        ) : (
          <div className="flex items-center gap-1  px-3 rounded-full bg-red-700 text-sm py-1">
            Non Veg <GiChickenLeg />
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
