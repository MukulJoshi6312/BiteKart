import axios from "axios";
import React from "react";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});
  const formateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      const result = await axios.post(
        `/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );
      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#161616] rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="text-gray-400 font-semibold">
            order #{data?._id?.slice(-8)}
          </p>
          <p className="text-sm text-gray-400">
            Date: {formateDate(data?.createdAt)}
          </p>
        </div>
        <div className="text-right text-gray-400">
          {data?.paymentMethod === "COD" ? (
            <p className="text-sm text-gray-400">
              {data?.paymentMethod?.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Payment: {data?.payment ? "True" : "False"}
            </p>
          )}

          <p className="font-medium text-green-600">
            {data?.shopOrders && data.shopOrders.length > 0
              ? data.shopOrders[0].status
              : "PENDING..."}
          </p>
        </div>
      </div>

      {data?.shopOrders?.map((shopOrder, index) => (
        <div
          key={index}
          className="border rounded-lg p-3 bg-[#161616] space-y-3"
        >
          <p className="text-gray-400">{shopOrder?.shop?.name}</p>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder?.shopOrderItems?.map((item, index) => (
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

                {shopOrder?.status === "DELIVERED" && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                      <button
                        onClick={() => handleRating(item?.item?._id, star)}
                        className={`${
                          selectedRating[item.item._id] >= star
                            ? "text-yellow-500"
                            : "text-gray-400"
                        } text-lg cursor-pointer`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold text-gray-400">
              SubTotal: ₹{shopOrder.subTotal}
            </p>
            <span className="text-green-500 text-sm">
              Status: {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold text-gray-200">
          Total: ₹{data?.totalAmount}
        </p>
        <button
          onClick={() => navigate(`/track-order/${data?._id}`)}
          className="text-black bg-yellow-500 px-4 py-2 rounded-lg text-sm hover:bg-yellow-600"
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
