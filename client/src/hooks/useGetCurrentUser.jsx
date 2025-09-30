import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'

const useGetCurrentUser = () => {

    useEffect(()=>{
        const fetchUser = async()=>{
        try{
            const result = await axios.get('/api/user/current',{
                withCredentials:true
            })
            console.log(" Result ",result?.data?.user?.fullName);
        }
        catch(error){
            console.log(error)
        }
    }
    fetchUser();
    }
    ,[])
}

export default useGetCurrentUser