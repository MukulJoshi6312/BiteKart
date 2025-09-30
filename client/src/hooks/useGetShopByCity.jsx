import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInMyCity } from '../redux/userSlice';

const useGetShopByCity = () => {

const dispatch = useDispatch();
const {city} = useSelector(state => state.user)

useEffect(()=>{
    const fetchShops = async()=>{
        try{
            const result = await axios.get(`api/shop/get-shop-by-city/${city}`,{withCredentials:true})
            dispatch(setShopInMyCity(result.data));
            console.log("Shop ",result.data)
        }catch(error){
            console.log(error)
        }
    }
    fetchShops();
},[city])

}

export default useGetShopByCity