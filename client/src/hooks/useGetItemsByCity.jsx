import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity, setShopInMyCity } from '../redux/userSlice';

const useGetItemsByCity = () => {

const dispatch = useDispatch();
const {city} = useSelector(state => state.user)

useEffect(()=>{
    const fetchShops = async()=>{
        try{
            const result = await axios.get(`api/item/get-items-by-city/${city}`,{withCredentials:true})
            dispatch(setItemsInMyCity(result.data));
            console.log("items ",result.data)
        }catch(error){
            console.log(error)
        }finally{
        }
    }
    fetchShops();
},[city])
}
export default useGetItemsByCity