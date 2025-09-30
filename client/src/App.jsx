import React, { useEffect } from 'react'
import {Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import axios from 'axios'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOutPage from './pages/CheckOutPage'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice'
import { ToastContainer, toast } from 'react-toastify';
import Profile from './pages/Profile'


axios.defaults.baseURL = "https://bitekart-backend.onrender.com"
const serverUrl = "https://bitekart-backend.onrender.com"

const App = () => {
  useGetCurrentUser();
  useUpdateLocation();
  useGetMyShop();
  useGetCity();
  useGetShopByCity();
  useGetItemsByCity();
  useGetMyOrders()
  const dispatch = useDispatch();


  const {userData} = useSelector(state=>state.user)
  console.log("user data ",userData)

  const {themeMode} = useSelector(state => state.theme)

  

    useEffect(() => {
      if (themeMode === "dark") {
        document.documentElement.classList.add("dark");   
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [themeMode]);

    useEffect(()=>{
      const socketInstance = io(serverUrl,{withCredentials:true});
     dispatch(setSocket(socketInstance));
     socketInstance.on('connect',()=>{
        if(userData){
          socketInstance.emit('identity',{userId:userData._id});
        }
     })
     return ()=>{
      socketInstance.disconnect()
     }
    },[userData?._id])
  
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path='/' element={userData ? <Home/>  : <Navigate to={'/signin'} /> } />
      <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/> } />
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/>} />
      <Route path='/profile' element={userData ? <Profile/> : <Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData ?  <ForgotPassword/> : <Navigate to={"/"}/>} />
      <Route path='/create-edit-shop' element={userData ?  <CreateEditShop/> : <Navigate to={"/"}/>} />
      <Route path='/add-item' element={userData ?  <AddItem/> : <Navigate to={"/"}/>} />
      <Route path='/edit-item/:itemId' element={userData ?  <EditItem/> : <Navigate to={"/"}/>} />
      <Route path='/cart-page' element={userData ?  <CartPage/> : <Navigate to={"/"}/>} />
      <Route path='/checkout-page' element={userData ?  <CheckOutPage/> : <Navigate to={"/"}/>} />
      <Route path='/order-placed-page' element={userData ?  <OrderPlaced/> : <Navigate to={"/"}/>} />
      <Route path='/my-orders' element={userData ?  <MyOrders/> : <Navigate to={"/"}/>} />
      <Route path='/track-order/:orderId' element={userData ?  <TrackOrderPage/> : <Navigate to={"/"}/>} />
      <Route path='/shop/:shopId' element={userData ?  <Shop/> : <Navigate to={"/"}/>} />
    </Routes>
  </>
  )
}
// checkout-page
export default App