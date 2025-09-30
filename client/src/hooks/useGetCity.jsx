import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCity, setCurrentAddress, setState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

const useGetCity = () => {
    const dispatch = useDispatch();
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const {userData} = useSelector(state=>state.user)

    const getCity = async()=>{
        navigator.geolocation.getCurrentPosition(async(position)=>{
            console.log(position)
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            dispatch(setLocation({lat:latitude,lng:longitude}))
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
            // console.log(result.data.results[0].city)
            // console.log("Api response ",result)
            if(result){
            dispatch(setCity(result?.data?.results[0]?.city))
            dispatch(setState(result?.data?.results[0]?.state))
            dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2))
            dispatch(setAddress(result?.data?.results[0]?.address_line2));
            }

        })
    }

    useEffect(()=>{
        getCity();
    },[userData]);
    
}

export default useGetCity