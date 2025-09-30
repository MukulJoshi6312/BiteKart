import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DeliveryBoy = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [availableAssignment, setAvailableAssignment] = useState([]);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getAssignmnet = async () => {
    try {
      const result = await axios.get(`api/order/get-assignment`, {
        withCredentials: true,
      });
      console.log("Assignment", result.data);
      setAvailableAssignment(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`api/order/get-current-order`, {
        withCredentials: true,
      });
      console.log("get current order", result.data);
      setCurrentOrder(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`api/order/accept-order/${assignmentId}`, {
        withCredentials: true,
      });
      console.log("Assignment order", result.data);
      getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );
      setShowOtpBox(true);

      console.log("Delivery otp ", result.data);
      toast.success("TOP Sent!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    try {
      const result = await axios.post(
        `api/order/verify-delivery-otp`,
        {
          orderId: currentOrder?._id,
          shopOrderId: currentOrder?.shopOrder?._id,
          otp,
        },
        { withCredentials: true }
      );

      console.log("verify Delivery otp ", result.data);
      // toast.success("OTP verify successfully !")
      setMessage(result.data.message);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  // get-today-deliveries
  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`api/order/get-today-deliveries`, {
        withCredentials: true,
      });
      console.log("today deliveries data ", result.data);
      setTodayDeliveries(result?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSendOtp = (e)=>{
  // }

  useEffect(() => {
    if (!socket || userData?.role !== "deliveryBoy") return;
    let watchId;
    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryBoyLocation({ lat: latitude, lng: longitude });
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData._id,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        };
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]);

  useEffect(() => {
    socket.on("newAssignment", (data) => {
      if (data.sentTo === userData._id) {
        setAvailableAssignment((prev) => [data, ...prev]);
      }
    });
    return () => {
      socket.off("newAssignment");
    };
  }, []);

  useEffect(() => {
    getAssignmnet();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries?.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center overflow-y-auto">
      <Navbar />
      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center ">
        <div className="bg-[#161616] rounded-2xl shadow-md p-5 flex justify-start flex-col items-center w-[90%] border border-gray-900 gap-2">
          <h1 className="capitalize text-xl font-bold text-yellow-500">
            Welcome, {userData?.fullName}
          </h1>
          <p className="text-yellow-500 text-xs">
            {" "}
            <span className="font-semibold">Latitude</span> :{" "}
            {deliveryBoyLocation?.lat} ,
            <span className="font-semibold">Longitude:</span>{" "}
            {deliveryBoyLocation?.lng}
          </p>
        </div>

        <div className="bg-[#161616] rounded-2xl shadow-md p-5 w-[90%] mb-6  text-gray-200">
          <h1>Today Deliveries</h1>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#efb000" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-2 max-w-sm  mt-6 items-center">
            <h1>Today's Earning </h1>
            <span className="text-yellow-500">₹{totalEarning}</span>
          </div>
        </div>

        {!currentOrder && (
          <div className="bg-[#161616] rounded-2xl p-5 shadow-md w-[90%] border border-gray-900">
            <h2 className="text-gray-200 text-lg text-start font-bold mb-2">
              Available Orders
            </h2>

            <div className="space-y-4">
              {availableAssignment.length > 0 ? (
                availableAssignment.map((a, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 border-gray-600 flex justify-between items-center "
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-gray-200 font-bold">{a?.shopName}</p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {a?.deliveryAddress?.text}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {a?.items?.length} Items | {a?.subTotal}
                      </p>
                    </div>

                    <button
                      className="bg-yellow-500 text-black px-4 py-1 rounded-md text-sm font-semibold hover:bg-yellow-600 transition-all duration-300 ease-in-out"
                      onClick={() => acceptOrder(a?.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Available orders</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-[#161616] rounded-2xl shadow-md p-5 w-[90%]  text-gray-200 ">
            <h2 className="text-xl font-semibold mb-3 text-start">
              📦 Current Order
            </h2>
            <div className=" border rounded-lg p-4 mb-3 text-start">
              <p className="font-semibold text-sm">
                Shop: {currentOrder?.shop?.name}
              </p>
              <p>Address: {currentOrder?.deliveryAddress?.text}</p>
              <p>
                {currentOrder?.shopOrder?.shopOrderItems?.length} items |{" "}
                {currentOrder?.shopOrder?.subTotal}
              </p>
            </div>

            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData?.location?.coordinates[1],
                  lng: userData?.location?.coordinates[0],
                },

                customerLocation: {
                  lat: currentOrder?.deliveryAddress?.latitude,
                  lng: currentOrder?.deliveryAddress?.longitude,
                },
              }}
            />
            {!showOtpBox ? (
              <button
                className="mt-4 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-all duration-200"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? "Loading..." : "Mark As Delivered"}
              </button>
            ) : (
              <div className="mt-4 p-4 border rounded-xl bg-gray-900">
                <p className="text-sm">
                  Enter OTP sent to{" "}
                  <span className="font-bold capitalize text-yellow-500">
                    {currentOrder?.user?.fullName}
                  </span>
                </p>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  type="number"
                  className="w-full border-yellow-500 px-3 py-2 rounded-lg mb-3 focus:outline-none border-[1px] my-2"
                  placeholder="Enter OTP"
                />
                {message && <p className="text-green-500 text-sm">{message}</p>}
                <button
                  className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoy;
