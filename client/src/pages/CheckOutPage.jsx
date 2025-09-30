import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { addMyOrder, addToCart, setClearCart } from "../redux/userSlice";

const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

const CheckOutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { cartItems, totalAmount, userData } = useSelector(
    (state) => state.user
  );

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  function RecenterMap({ location }) {
    if (location.lat && location.lng) {
      const map = useMap();
      map.setView([location.lat, location.lng], 16, { animate: true });
    }
    return null;
  }

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lng }));
    getAddressByLatLng(lat, lng);
  };

  const getAddressByLatLng = async (latitude, longitude) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      );
      console.log(result?.data?.results[0]?.address_line2);
      dispatch(setAddress(result?.data?.results[0]?.address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lng: longitude }));
    getAddressByLatLng(latitude, longitude);
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );
      const { lat, lon } = result?.data?.features[0]?.properties;
      dispatch(setLocation({ lat, lng: lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: razorOrder.amount,
      currency: "INR",
      name: "BiteKart",
      description: "Food devlivery website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true }
          );
          dispatch(addMyOrder(result?.data));
          navigate("/order-placed-page");
          dispatch(setClearCart());
        } catch (error) {
          console.log(error);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(
        "/api/order/place-order",
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lng,
          },
          totalAmount: amountWithDeliveryFee,
          cartItems,
        },
        { withCredentials: true }
      );

      if (paymentMethod === "COD") {
        dispatch(addMyOrder(result?.data));
        navigate("/order-placed-page");
        dispatch(setClearCart());
      } else {
        const orderId = result?.data?.orderId;
        const razorOrder = result?.data?.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useState(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto py-12 relative px-6 flex items-center justify-center">
      <div
        className="absolute top-2 left-0 text-white flex items-center gap-3"
        onClick={() => navigate("/cart-page")}
      >
        <IoMdArrowBack size={24} /> Back to cart
      </div>

      <div className="w-full max-w-[900px] bg-[#161616] shadow-2xl rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-200">Checkout</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-400">
            {" "}
            <FaLocationDot className="text-yellow-500" /> Delivery Location
          </h2>
          <div className="flex  gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-[1px] focus:ring-yellow-500 placeholder:text-gray-600 text-gray-200"
              placeholder="Enter Your Delivery Address.."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              onClick={getLatLngByAddress}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <IoSearch size={24} />
            </button>
            <button
              onClick={getCurrentLocation}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <TbCurrentLocation size={24} />
            </button>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className="w-full h-full"
                center={[location.lat, location.lng]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location.lat, location.lng]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                ></Marker>
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-400">
            Pyament Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "COD"
                  ? "border-yellow-500 shadow-lg bg-yellow-500/10"
                  : "border-gray-600"
              }`}
              onClick={() => setPaymentMethod("COD")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 cursor-pointer">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="text-gray-200 font-medium">Cash On Delivery</p>
                <p className="text-gray-400 text-xs">
                  Pay when your food arrives
                </p>
              </div>
            </div>
            <div
              className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "ONLINE"
                  ? "border-yellow-500 shadow-lg bg-yellow-500/10"
                  : "border-gray-600"
              }`}
              onClick={() => setPaymentMethod("ONLINE")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-200">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-200">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="text-gray-200 font-medium">
                  UPI / Credit ? Debit Card
                </p>
                <p className="text-gray-400 text-xs">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-400">
            Order Summary
          </h2>
          <div className="rounded-xl border border-gray-800  p-4 space-y-2">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm text-gray-200"
              >
                <span className="text-gray-200">
                  {item?.name} X {item.quantity}
                </span>
                <span className="text-yellow-500 font-semibold flex items-center gap-[1px]">
                  {" "}
                  <FaIndianRupeeSign />
                  {item.price * item.quantity}
                </span>
              </div>
            ))}
            <hr className="border-gray-800 mb-2" />
            <div className="flex justify-between  text-gray-200 font-bold">
              <span>Sub Total</span>
              <span className="flex items-center gap-[1px] text-yellow-500 ">
                <FaIndianRupeeSign />
                {totalAmount}
              </span>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Delivery Fee</span>
              <span className="text-yellow-500 ">
                {deliveryFee === 0 ? (
                  "Free"
                ) : (
                  <div className=" flex items-center gap-[1px]">
                    <FaIndianRupeeSign />
                    {deliveryFee}
                  </div>
                )}
              </span>
            </div>
            <div className="flex justify-between text-gray-200 text-xl">
              <span>Total Amount</span>
              <span className=" flex items-center gap-[1px] text-yellow-500 ">
                {" "}
                <FaIndianRupeeSign />
                {amountWithDeliveryFee}
              </span>
            </div>
          </div>
        </section>

        <button
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold cursor-pointer"
          onClick={handlePlaceOrder}
        >
          {paymentMethod === "COD" ? "Place Order" : "Pay & Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckOutPage;
