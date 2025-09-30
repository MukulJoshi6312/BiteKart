import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setCurrentAddress, setState } from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // const updateLocation = async()=>{
  //      const updateLocaation = async(latitude, longitude )=>{
  //         const result = await axios.post(`api/user/update-location`,{latitude,longitude},{withCredentials:true})
  //      }
  //     navigator.geolocation.watchPosition((pos)=>{
  //         updateLocaation(pos?.coords?.latitude,pos?.coords?.longitude)
  //     })
  // }

  const updateLocation = () => {
    navigator.geolocation.watchPosition(async (pos) => {
      try {
        const result = await axios.post(
          "/api/user/update-location",
          {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          { withCredentials: true }
        );
        console.log("Location updated:", result.data);
      } catch (err) {
        console.error("Error updating location:", err);
      }
    });
  };

  useEffect(() => {
    updateLocation();
  }, [userData]);
};

export default useUpdateLocation;
