import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice';

const useGetMyOrders = () => {

const dispatch = useDispatch();
const {userData} = useSelector(state =>state.user)

useEffect(()=>{
    const fetchOrders = async()=>{
        try{
            const result = await axios.get(`/api/order/my-orders`,{withCredentials:true})
            dispatch(setMyOrders(result.data));
            console.log("Result of order api ",result.data)
        }catch(error){
            console.log(error)
        }
    }
    fetchOrders();
},[userData])

}

export default useGetMyOrders