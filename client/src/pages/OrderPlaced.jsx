import React from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const OrderPlaced = () => {
    const navigate = useNavigate();
  return (
    <div className='min-h-screen bg-[#161616] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
            <div className='text-green-500'><FaCheckCircle size={64}/></div>
            <h2 className='text-3xl text-gray-200 py-2'>Order Placed</h2>
            <p className='text-gray-400 max-w-xl text-xl'>Thank you for your purchase. Your order is being prepared. You
                can track your order status in the "My Orders" section.
            </p>

            <button 
            onClick={()=>navigate('/my-orders')}
            className='bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 ease-in-out  rounded-md px-4 py-2 mt-4 font-semibold hover:scale-103'>Back to my orders</button>
    </div>
  )
}

export default OrderPlaced