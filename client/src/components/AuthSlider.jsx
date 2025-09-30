import React, { useEffect, useState } from 'react'
import image1 from "../assets/signup1.jpg";
import image2 from "../assets/signup2.jpg";
import image3 from "../assets/signup3.jpg";
import image4 from "../assets/signup4.jpg";


const AuthSlider = () => {
    const images = [image1, image2, image3, image4];
    const [currentIndex, setCurrentIndex] = useState(0);
      // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);
  return (
   <>
    <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>

            {/* Dots for navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full cursor-pointer object-cover ${
                    idx === currentIndex ? "bg-yellow-500" : "bg-gray-500"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                ></div>
              ))}
            </div>
   </>
  )
}

export default AuthSlider