
import { useState, useEffect } from "react";

// Import your slider images
import img3 from "../assets/slide3.jpg";
import img1 from "../assets/slide1.jpg";
import img2 from "../assets/slide2.jpg";
import img4 from "../assets/slide4.jpg";
import img5 from "../assets/slide5.jpg";

// Import your feature image
import featureImg from "../assets/summer-season.jpg";
import HomeCardGrid from "./HomeCards";

const images = [img1, img2, img3, img4, img5];

export const HomePage = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div>
      {/* Slide Bar */}
      <div className="px-4 sm:px-6 lg:px-2 max-w-screen-xl mx-auto">
        <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-r-3l">
          <div
            className="flex mt-4 w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-center flex-shrink-0"
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 text-black p-2  hover:bg-opacity-75"
          >
            &#8592;
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 text-black p-2  hover:bg-opacity-75"
          >
            &#8594;
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === current ? "bg-white" : "bg-white/50"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Image with Text Overlay */}
      <div className="relative w-full my-8 px-6 h-[400px] overflow-hidden rounded-lg">
  <img
    src={featureImg}
    alt="Features"
    className="w-full h-full object-cover rounded-lg opacity-70"
  />
  <div className="absolute inset-0 flex items-center justify-center  px-4 sm:px-8">
    <div className="text-black max-w-xl text-center sm:text-left space-y-2">
      <h3 className="text-lg font-semibold">Trade-in-fair</h3>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
        Super value deals <br />
        <span className="text-yellow-500">On all Products</span>
      </h1>
      <p className="text-sm sm:text-base">
        Save more with coupons and up to 70% off!
      </p>
      <button className="bg-orange-300 hover:bg-orange-400 text-black font-medium px-6 py-2 rounded-md shadow-md">
        Shop Now
      </button>
    </div>
  </div>
</div>
      {/* Cards Section */}
      <div>
        <HomeCardGrid/>
      </div>
    </div>
  );
};

