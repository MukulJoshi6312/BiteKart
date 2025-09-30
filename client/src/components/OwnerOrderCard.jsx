import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";
import { useState } from "react";

const OwnerOrderCard = ({ data }) => {
  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    if (!status) return;
    try {
      const result = await axios.post(
        `/api/order/update-order-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result?.data?.availableBoys);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#161616] rounded-lg shadow-lg p-4 space-y-4">
      <div>
        <h2 className="capitalize text-gray-200 font-semibold flex items-center gap-1">
          {" "}
          <FaUser /> {data?.user?.fullName}
        </h2>
        <p className="text-gray-400 text-sm  flex items-center gap-1">
          <MdEmail /> {data?.user?.email}
        </p>
        <p className="text-gray-400 text-sm  flex items-center gap-1">
          <FaPhone /> {data?.user?.mobile}
        </p>
        {data.paymentMethod === "ONLINE" ? (
          <p className="text-gray-400 text-sm  flex items-center gap-1">
            Payment: {data?.payment ? "True" : "False"}
          </p>
        ) : (
          <p className="text-gray-400 text-sm  flex items-center gap-1">
            Payment Method: {data?.paymentMethod}
          </p>
        )}
      </div>
      <div className="flex items-start gap-2 text-gray-400 text-sm flex-col">
        <p className="font-semibold">{data?.deliveryAddress?.text}</p>
        <p className="text-xs">
          Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
          {data?.deliveryAddress?.longitude}
        </p>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {data?.shopOrders?.shopOrderItems?.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40  rounded-lg border p-2 border-gray-600 "
          >
            <img
              src={item?.item?.image}
              alt=""
              className="w-full h-24 object-cover rounded shadow-2xl"
            />
            <p className="text-gray-200 text-sm font-semibold mt-1">
              {item?.name}
            </p>
            <p className="text-gray-200 text-xs font-semibold mt-1">
              ₹{item?.price} X Qyt:{item?.quantity}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800">
        <span className="text-gray-200 ">
          Status:{" "}
          <span className="font-semibold text-green-500">
            {data?.shopOrders?.status}
          </span>
        </span>
        <select
          className="rounded-md border px-3 py-1 text-sm text-green-500 focus:outline-none"
          onChange={(e) =>
            handleUpdateStatus(
              data?._id,
              data?.shopOrders?.shop?._id,
              e.target.value
            )
          }
        >
          <option value="">Status</option>
          <option value="PENDING">PENDING</option>
          <option value="PREPARING">PREPARING</option>
          <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
        </select>
      </div>

      {data.shopOrders.status === "OUT FOR DELIVERY" && (
        <div className="mt-3 p-2 border rounded-lg text-sm border-yellow-100 text-gray-200">
          {data.shopOrders.assignedDeliveryBoy ? (
            <p className=" border-b-2 border-gray-800">Assigned Delivery Boy</p>
          ) : (
            <p>Available Delivery Boys</p>
          )}
          {/* {console.log("Boys ",availableBoys)} */}
          {availableBoys?.length > 0 ? (
            <div>
              {availableBoys.map((b, index) => (
                <div className="text-sm text-white" key={index}>
                  {b?.fullName} - {b.mobile}
                </div>
              ))}
            </div>
          ) : data.shopOrders.assignedDeliveryBoy ? (
            <div>
              <p className="capitalize font-semibold">
                Name: {data?.shopOrders?.assignedDeliveryBoy?.fullName}
              </p>
              <p>Phone No: {data?.shopOrders?.assignedDeliveryBoy?.mobile}</p>
              <p>Email: {data?.shopOrders?.assignedDeliveryBoy?.email}</p>
            </div>
          ) : (
            <div className="text-xs">Waiting for delivery boy to accept</div>
          )}
        </div>
      )}

      <div className="text-right font-bold text-gray-400 text-sm">
        Total : ₹{data?.shopOrders?.subTotal}
      </div>
    </div>
  );
};

export default OwnerOrderCard;
