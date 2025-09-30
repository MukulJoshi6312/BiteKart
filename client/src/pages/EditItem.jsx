import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { setCurrentAddress } from '../redux/userSlice';
import axios from 'axios';
import { setMyShopData } from '../redux/ownerSlice';


const EditItem = () => {
  
  const navigate = useNavigate();
  const {myShopData} = useSelector(state => state.owner)
  const {itemId} = useParams();
  console.log(itemId)
  
const [currentItem,setCurrentItem] = useState(null);

  const [name,setName] = useState("");
  const [price,setPrice] = useState(0);
  const categories = ["Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others",];
  const [category,setCategory] = useState("")
  const [foodType,setFoodType] = useState("Veg")
  const [frontendImage,setFrontendImage] = useState(null);
  const [backendImage,setBackendImage] = useState(null);
  const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{

      const formData = new FormData();
      formData.append("name",name);
      formData.append("category",category);
      formData.append("foodType",foodType);
      formData.append("price",price);
      if(backendImage){
        formData.append('image',backendImage);
      }

      const result = await axios.post(`/api/item/edit-item/${itemId}`,formData,{withCredentials:true});
      dispatch(setMyShopData(result.data));
      console.log(result.data)
      navigate('/')

    }catch(error){
      console.log(error)
    }finally{
        setLoading(false);
    }
  }
  


  const handleImage = (e)=>{
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    console.log("Frontend image ",frontendImage)
  }

  useEffect(()=>{
    const handleGetItemById = async()=>{
        try{
            const result = await axios.get(`/api/item/get-item/${itemId}`,{withCredentials:true});
            setCurrentItem(result?.data?.item);
            // console.log(result?.data?.item)

        }catch(error){
            console.log(error)
        }
    }
    handleGetItemById();
  },[itemId])

  useEffect(()=>{
    setName(currentItem?.name || "")
    setPrice(currentItem?.price || 0)
    setCategory(currentItem?.category || "")
    setFoodType(currentItem?.foodType || "")
    setFrontendImage(currentItem?.image || "")
    setBackendImage(currentItem?.image)
  },[currentItem])



  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-black to-gray-800 min-h-screen'>
      <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px] bg-yellow-500 p-2 rounded-full hover:scale-95'
      onClick={()=>navigate("/")}>
        <IoArrowBack size={20}/>
      </div>
      <div className='max-w-lg w-full bg-[#161616] shadow-xl rounded-2xl p-8 border'>
        <div className='flex flex-col items-center mb-6'>
          <div className='bg-yellow-300 p-4 rounded-full mb-4'>
            <FaUtensils className='text-black w-16 h-16'/>
          </div>
          <div className='text-3xl font-extrabold text-gray-200'>
            Edit Food
          </div>
        </div>
        <form className='space-y-5' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-yellow-500 mb-1'>Name *</label>
            <input type="text" placeholder='Enter food name'
            className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white"
            required
            onChange={(e)=>setName(e.target.value)}
            value={name}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-yellow-500 mb-1'>Image *</label>
            <input type="file" accept='image/*' placeholder='Choose you photo'
            className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white"
            required
            onChange={(e)=>{handleImage(e)}}
            />
            { frontendImage && <div className='mt-4'>
              <img src={frontendImage} alt="image"  className='w-full h-48 object-cover rounded-lg shadow-2xl'/>
            </div>
            }
          </div>

          <div>
            <label className='block text-sm font-medium text-yellow-500 mb-1'>Price *</label>
            <input type="number" placeholder='Enter food price'
            className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
            required
            onChange={(e)=>setPrice(e.target.value)}
            value={price}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-yellow-500 mb-1'>Select Category *</label>
            <select
            className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
            required
            onChange={(e)=>setCategory(e.target.value)}
            value={category}
            >
                <option value="">Select category</option>
                {
                    categories.map((ct,index)=>(
                        <option value={ct} key={index}>{ct}</option>
                    ))
                }
            </select>
          </div>

           <div>
            <label className='block text-sm font-medium text-yellow-500 mb-1'>Select Food Type *</label>
            <select
            className="w-full outline-none bg-[#222124] px-4 py-2 text-base rounded-lg mt-1 text-white required"
            required
            onChange={(e)=>setFoodType(e.target.value)}
            value={foodType}
            >
               <option value="Veg">Veg</option>
               <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>


        
          <button
          disabled={loading}
           className={`bg-yellow-500 cursor-pointer w-full p-2 mt-8 text-black rounded-lg text-sm font-bold disabled:bg-white transition-all duration-300 ease-in-out active:scale-98`}
          >{loading  ? "Please wait..." : "Save"}</button>
        </form>
      </div>
    </div>
  )
}

export default EditItem