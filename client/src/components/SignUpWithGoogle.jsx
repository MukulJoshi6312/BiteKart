import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import { auth } from '../../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


const SignUpWithGoogle = ({mobile,role,setMobileNumber}) => {

  const dispatch = useDispatch();

  const handleGoogleAuth = async()=>{
    if(!mobile){
      return setMobileNumber(true);
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    try{
      const {data} = await axios.post(`/api/auth/google-auth`,{
        fullName:result?.user?.displayName,
        email:result?.user?.email,
        mobile,
        role
      },{withCredentials:true})
      dispatch(setUserData(data))
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div
    onClick={handleGoogleAuth}
    className='flex  justify-center items-center gap-4 w-full py-1 cursor-pointer rounded-2xl border-[1px] border-yellow-600 bg-transparent text-white'>
        <FcGoogle/>
        <span className='font-semibold text-sm'>Sign up with Google</span>
    </div>
  )
}

export default SignUpWithGoogle