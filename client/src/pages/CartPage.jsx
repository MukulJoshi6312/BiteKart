import React from "react";
import { useSelector } from "react-redux";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { FaRupeeSign } from "react-icons/fa";
import emptyCart from "../assets/empty_cart.svg";

const CartPage = () => {
  const { cartItems, totalAmount } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto py-12 relative px-6">
      <div
        className="sticky top-2  cursor-pointer left-0 text-white flex items-center gap-3"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={24} /> Your cart
      </div>

      <div className="flex gap-5 flex-col md:flex-row">
        <div className="w-full md:w-1/2 mx-auto">
          {cartItems?.length === 0 ? (
            <div className="flex justify-center items-center text-white flex-col gap-4 h-[500px] ">
              <img
                src={emptyCart}
                alt="empty cart"
                className="w-44 animate-pulse"
              />
              <p className="text-3xl font-semibold">Your cart empty</p>
              <button
                className="bg-yellow-500 px-5 py-2 rounded-full text-black font-bold hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => navigate("/")}
              >
                Order Now
              </button>
            </div>
          ) : (
            <div className="w-full">
              {cartItems.map((item, index) => (
                <CartItem data={item} key={index} />
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="sticky top-10 w-full md:w-1/2 bg-[#161616] h-[300px] mt-2 rounded-2xl flex flex-col justify-center items-center gap-3 ">
            <h2 className="text-3xl text-yellow-500 font-bold text-center pt-4 flex items-center justify-center">
              Total Amount : <FaRupeeSign />
              {totalAmount}
            </h2>

            <button
              className="text-black bg-yellow-500 w-fit px-6 py-1 rounded-full font-semibold  hover:bg-yellow-600 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => navigate("/checkout-page")}
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
