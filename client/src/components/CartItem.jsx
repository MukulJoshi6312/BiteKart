import React, { useState } from "react";
import { FaLeaf, FaMinus, FaPlus, FaRupeeSign } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/userSlice";


const CartItem = ({ data }) => {
//   const [quantity, setQuantity] = useState(data?.quantity);
const dispatch = useDispatch();

  const handleIncrement = (id,currentQty) => {
        if(currentQty === 5) {
            alert("Sorry! you can't add more fo this item")
            return;
        }
        dispatch(updateQuantity({id,quantity:currentQty+1}))

  };

  const handleDecrement = (id,currentQty) => {
    if(currentQty === 1) return;
    dispatch(updateQuantity({id,quantity:currentQty-1}))
  };

  return (
    <div className="w-full flex items-center justify-between mt-2">
      <div className="bg-[#161616] w-full rounded-xl p-3 flex justify-between items-center">
        <div className=" flex gap-3">
        <div>
          <img src={data?.image} alt="" className="min-w-32 max-w-32 h-32 rounded-2xl" />
        </div>
        <div className="text-gray-200 ">
          <p className="text-lg">{data?.name}</p>
          <p className="flex items-center ">
            <FaRupeeSign />{" "}
            <strong>
              {" "}
              {data?.price} X {data?.quantity}{" "}
            </strong>
          </p>
          <p className="text-lg flex items-center text-yellow-500">
            <FaRupeeSign />
            {data?.price * data?.quantity}
          </p>
          <div className=" top-4 right-3 text-white mt-2 flex">
            {data?.foodType === "Veg" ? (
              <div className="flex items-center gap-1  px-3 rounded-full bg-green-700 text-xs sm:text-sm py-1">
                Veg <FaLeaf />
              </div>
            ) : (
              <div className="flex items-center gap-1  px-3 rounded-full bg-red-700 text-xs sm:text-sm py-1">
                Non Veg <GiChickenLeg />
              </div>
            )}
          </div>
        </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex text-white text-md gap-2 border-[1px] border-yellow-500 rounded-full px-3 ">
            <button
              onClick={() => handleDecrement(data?.id,data?.quantity)}
              className="cursor-pointer"
            >
              <FaMinus />
            </button>
            <span>{data?.quantity}</span>
            <button onClick={()=>handleIncrement(data?.id,data?.quantity)} className="cursor-pointer">
              <FaPlus />
            </button>
          </div>
          <button className="bg-red-700 rounded-full p-2 text-white cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out hover:bg-red-400"
          onClick={()=>dispatch(removeFromCart(data.id))}
          >
            <MdDeleteForever size={24}/>
          </button>
        </div>
      </div>
     
    </div>
  );
};

export default CartItem;
