import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { data, useNavigate } from 'react-router-dom'
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders } from '../redux/userSlice';

const MyOrders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {userData,myOrders,socket} = useSelector(state => state.user);

    useEffect(()=>{
        socket?.on('newOrder',(data)=>{
            if(data?.shopOrders?.owner?._id === userData?._id){
                dispatch(setMyOrders([data,...myOrders]));
            }
        })

        socket?.on('updateStatus',({orderId,shopId,status,userId})=>{
            if(userId === userData?._id){
                dispatch(updateRealtimeOrderStatus({orderId,shopId,status}));
            }
        })

        return ()=>{
            socket?.off('newOrder')
            socket?.off("updateStatus")
        }
    },[socket])

    if(!myOrders) return;
  return (
    <div className='w-full min-h-screen flex justify-center px-4'>
        <div className='w-full max-w-[800px] px-4'>

            <div className='flex items-center gap-[2px] my-6 cursor-pointer' onClick={()=>navigate("/")}>
                <div className='z-[10]' >
                    <IoIosArrowRoundBack size={35} className='text-yellow-500'/>
                </div>
                <h1 className='text-xl font-bold text-start text-gray-200'>My Orders</h1>
            </div>

            <div className='space-y-6 mb-12'>
            {myOrders?.map((order,index)=>(

                userData.role === "user" ? 
                (
                    <UserOrderCard data={order} key={index}/>
                ) 
                : 
                userData.role === "owner" ? (
                    <OwnerOrderCard data={order} key={index}/>
                ):null

            ))}
            </div>

        </div>

    </div>
  )
}

export default MyOrders