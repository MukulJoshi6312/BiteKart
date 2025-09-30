import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [currentOrder, setCurrentOrder] = useState();
  const {socket} = useSelector(state=>state.user);
  const [liveLocation,setLiveLocation] = useState({});

  const handleGetOrder = async () => {
    // get-order-by-id
    try {
      const result = await axios.get(`api/order/get-order-by-id/${orderId}`, {
        withCredentials: true,
      });
      console.log("data by id ", result.data);
      setCurrentOrder(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    socket.on("updateDeliveryLocation",({deliveryBoyId,latitude,longitude,})=>{
        setLiveLocation(prev=>({
          ...prev,
          [deliveryBoyId]:{lat:latitude,lng:longitude}
        }))
    })
  },[socket])

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px] bg-yellow-500 p-2 rounded-full hover:scale-95"
        onClick={() => navigate("/my-orders")}
      >
        <IoArrowBack size={20} />
      </div>

      <div className="mt-20 md:mt-4">

      {
        currentOrder?.shopOrders?.map((shopOrder,index)=>(
            <div className="bg-[#161616]  p-4 rounded-2xl shadow-md border space-y-4" key={index}>
                <div className="text-gray-200">
                    <p className="text-yellow-400">{shopOrder?.shop?.name}</p>
                    <p className="font-semibold"><span>Items: </span>{shopOrder?.shopOrderItems?.map(i=>i.name).join(",")}</p>
                    <p className="font-semibold"><span>Sub Total: </span>₹{shopOrder?.subTotal}</p>
                    <p><span>Delivery Address: </span>{currentOrder?.deliveryAddress?.text}</p>
                </div>
                {
                    shopOrder.status !== 'DELIVERED' ? <>
                    {
                        shopOrder?.assignedDeliveryBoy ? <div className="text-sm text-gray-400">
                            <p className="capitalize font-semibold"><span>Delivery Boy Name: </span> {shopOrder?.assignedDeliveryBoy?.fullName}</p>
                            <p className="font-semibold"><span>Delivery Boy Phone No: </span> {shopOrder?.assignedDeliveryBoy?.mobile}</p>

                        </div>
                        : <p className="text-gray-400 text-xs">Delivery boy is not assigned yet!</p>
                    }
                    </>
                    : <p className="text-green-600 font-semibold text-lg">Delivered</p>
                }

                {
                   ( shopOrder?.assignedDeliveryBoy && shopOrder.status !== "DELIVERED") &&
                    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                    <DeliveryBoyTracking
                    data={{
                        deliveryBoyLocation: liveLocation[shopOrder?.assignedDeliveryBoy._id] || {
                        lat:shopOrder?.assignedDeliveryBoy?.location?.coordinates[1],
                        lng:shopOrder?.assignedDeliveryBoy?.location?.coordinates[0]},

                        customerLocation:{
                        lat:currentOrder?.deliveryAddress?.latitude,
                        lng:currentOrder?.deliveryAddress?.longitude}

                }}
                    />
                    </div>
                }

            </div>
        ))
      }
      </div>
    </div>
  );
};

export default TrackOrderPage;
