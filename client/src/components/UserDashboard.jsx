import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowForward } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import Footer from "./Footer";



const UserDashboard = () => {
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const { city, shopInMyCity, itemsInMyCity, searchItems, searchQuery } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsLits, setUpdatedItemsList] = useState([]);
  const [category, setCategory] = useState("All");
  const [page,setPage] = useState(1);

  const handleFilterByCategory = (category) => {
  setCategory(category);
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category === category
      );
      setUpdatedItemsList(filteredList);
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behaviour: "smooth",
      });
    }
  };


  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

const handlePageChange = (selectedPage) => {
    const lastPage = Math.ceil(updatedItemsLits.length / 12);
    if (selectedPage >= 1 && selectedPage <= lastPage && selectedPage !== page) {
        setPage(selectedPage);
    }
}

  useEffect(() => {
    if (cateScrollRef?.current) {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );

      cateScrollRef?.current?.addEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });

      shopScrollRef?.current?.addEventListener("scroll", () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    }
    return () => {
      cateScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCateButton,
          setShowRightCateButton
        );
      });
      shopScrollRef?.current?.removeEventListener("scroll", () => {
        updateButton(
          shopScrollRef,
          setShowLeftShopButton,
          setShowRightShopButton
        );
      });
    };
  }, [categories, shopInMyCity]);

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  return (
    <div className="w-screen bg-black min-h-screen flex flex-col gap-5 items-center  overflow-y-auto">
      <Navbar />

      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 shadow-md rounded-2xl mt-4">
          <h1 className="text-gray-200 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
            Search Result
          </h1>
          <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {searchItems.map((item) => (
              <>
              {console.log("item in user page ",item)}
              <FoodCard data={item} key={item._id} />
              </>
            ))}
          </div>
        </div>
      )}

      <div className="w-full h-fit bg-[#161616]">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 items-start p-[10px] bg-[#161616]">
          <h1 className="text-gray-200 text-2xl sm:text-3xl">
            Inspiration for your first order
          </h1>
          <div className="w-full relative">
            {showLeftCateButton && (
              <button
                className="hidden sm:block absolute top-1/2 text-yellow-500 -translate-y-1/2 -left-6 border-2 rounded-full hover:border-yellow-700"
                onClick={() => scrollHandler(cateScrollRef, "left")}
              >
                <FaCircleChevronLeft size={30} />
              </button>
            )}
            <div
              className="w-full flex overflow-x-auto gap-5 pb-2  scroll-smooth py-6 mb-6 "
              ref={cateScrollRef}
            >
              {categories.map((category) => (
                <div key={category.id} className="flex-shrink-0">
                  <CategoryCard
                    image={category?.image}
                    name={category?.category}
                    onClick={() => handleFilterByCategory(category?.category)}
                  />
                </div>
              ))}
            </div>
            {showRightCateButton && (
              <button
                className=" hidden sm:block absolute top-1/2 text-yellow-500 -translate-y-1/2 -right-6 border-2 rounded-full hover:border-yellow-700"
                onClick={() => scrollHandler(cateScrollRef, "right")}
              >
                <FaCircleChevronRight size={30} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* {shops} */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-200 text-2xl sm:text-3xl">
          Best shop in <b>{city}</b>
        </h1>

        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="hidden sm:block absolute top-1/2 text-yellow-500 -translate-y-1/2 -left-6 border-2 rounded-full hover:border-yellow-700"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={30} />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-5 pb-2  scroll-smooth py-6 mb-6 "
            ref={shopScrollRef}
          >
            {shopInMyCity?.shops?.map((shop) => (
              <div key={shop._id} className="flex-shrink-0">
                <CategoryCard
                  image={shop.image}
                  name={shop.name}
                  onClick={() => navigate(`/shop/${shop._id}`)}
                />
              </div>
            ))}
          </div>
          {showRightShopButton && (
            <button
              className=" hidden sm:block absolute top-1/2 text-yellow-500 -translate-y-1/2 -right-6 border-2 rounded-full hover:border-yellow-700"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={30} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] mb-12">
        <h1 className="text-gray-200 text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>

        <div className="w-full h-auto grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-[20px] justify-center">
          {updatedItemsLits?.slice((page - 1) * 12, page * 12)?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
        <div className="mx-auto flex justify-center items-center ">
          {
            category === "All" && <div className="text-white   flex gap-3 ">
            <button className="cursor-pointer flex items-center text-gray-400 gap-1 hover:text-white transition-all duration-200"
            onClick={()=>handlePageChange(page-1)}
            ><IoArrowBack/> Prev</button>
            <span className="text-yellow-500 font-bold">{page} / { Math.ceil(updatedItemsLits?.length/12)} </span>
            <button 
              onClick={()=>handlePageChange(page+1)}
            className="cursor-pointer flex items-center text-gray-400 gap-1 hover:text-white transition-all duration-200">Next <IoArrowForward/></button>
            </div>
          }
        </div>
        {updatedItemsLits?.length === 0 && (
          <p className="text-gray-400 text-xl text-center w-full">
            No Food Found in{" "}
            <span className="underline text-gray-200">{category}</span> category
          </p>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default UserDashboard;
