import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import Navbar from '../components/Navbar'

const Home = () => {
    const {userData} = useSelector(state=>state.user)
  return (<>
    <div className='w-full min-h-screen pt-[100px] flex flex-col items-center bg-black/95'>
        {
            userData?.role === 'user' && <UserDashboard/>
        }
        {
            userData?.role === "owner" && <OwnerDashboard/>
        }
        {
            userData?.role === 'deliveryBoy' && <DeliveryBoy/>
        }
    </div>
      </>
  )
}

export default Home