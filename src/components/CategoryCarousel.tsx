// "use client";

// import Slider from "react-slick";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useCategories } from "@/context/CategoriesContext";
// import { useRouter } from "next/navigation";
// import EmptyImage from '../../public/images/emptyImage.png'
// import React, { useEffect, useRef } from "react";
// // Custom arrows
// const SampleNextArrow = ({ onClick }: { onClick?: () => void }) => (
//   <div
//     className="ml-2 p-2 rounded-full bg-white shadow cursor-pointer hover:bg-[#991b1b] hover:text-white"
//     onClick={onClick}
//   >
//     <ChevronRight size={20} />
//   </div>
// );

// const SamplePrevArrow = ({ onClick }: { onClick?: () => void }) => (
//   <div
//     className="p-2 rounded-full bg-white shadow cursor-pointer hover:bg-[#991b1b] hover:text-white"
//     onClick={onClick}
//   >
//     <ChevronLeft size={20} />
//   </div>
// );

// const FeaturedCategories = () => {
// const { categories, isLoading } = useCategories();
// const router = useRouter();
// const sliderRef = useRef<React.ElementRef<typeof Slider> | null>(null);

// // const settings = {
// //   dots: true,
// //   infinite: true,
// //   speed: 500,
// //   slidesToShow: 6, 
// //   slidesToScroll: 1,
// //   autoplay: true,
// //   autoplaySpeed: 2000,
// //   cssEase: "linear",
// //   pauseOnHover: true,
// //   arrows: true,

// //   draggable: true, 
// //   swipe: true,
// //   touchMove: true,

// //   responsive: [
// //     {
// //       breakpoint: 1280, 
// //       settings: { slidesToShow: 6 }
// //     },
// //     {
// //       breakpoint: 1024, 
// //       settings: { slidesToShow: 3 }
// //     },
// //     {
// //       breakpoint: 768, 
// //       settings: { slidesToShow: 2 }
// //     },
// //     {
// //       breakpoint: 480, 
// //       settings: { slidesToShow: 1 }
// //     },
// //   ],
// // };

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 6,
//   slidesToScroll: 1,
//   autoplay: true,
//   autoplaySpeed: 2000,
//   cssEase: "linear",
//   pauseOnHover: true,
//   arrows: true,
//   swipe: true,
//   touchMove: true,

//   responsive: [
//     { breakpoint: 1280, settings: { slidesToShow: 6 } },
//     { breakpoint: 1024, settings: { slidesToShow: 3 } },
//     { breakpoint: 768, settings: { slidesToShow: 2 } },
//     { breakpoint: 480, settings: { slidesToShow: 1 } },
//   ],
// };


// useEffect(() => {
//   if (!sliderRef.current) return;

//   (sliderRef.current as any)?.slickGoTo?.(0);
//   (sliderRef.current as any)?.innerSlider?.onWindowResized?.();
// }, []);

// useEffect(() => {
//   const handleResize = () => {
//     (sliderRef.current as any)?.innerSlider?.onWindowResized?.();
//   };

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);



//   const skeletonItems = new Array(6).fill(null);

//   return (
//     <section className="w-full bg-white py-10">
//       <div className="mx-auto px-4 relative">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div></div>
//           {/* <h2 className="text-xl md:text-2xl items-center font-bold">
//             Shop by Category
//           </h2> */}
//           <div className="text-center">
//             <h2 className="text-2xl text-gray-700  font-bold">Shop by Category</h2>
//             <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
//           </div>
//           <button
//             onClick={() => router.push("/category")}
//             className="text-sm md:text-base text-[#13cea1] font-medium hover:underline"
//           >
//             View All
//           </button>
//         </div>
//         <div className="relative grid grid-cols-1 md:grid-cols-3 items-center gap-4 mb-6">
//         </div>

//         {/* Carousel */}
//         <Slider  ref={sliderRef} {...settings}>
//           {isLoading
//             ? skeletonItems.map((_, index) => (
//               <div key={index} className="px-4">
//                 <div className="flex flex-col items-center text-center animate-pulse">
//                   <div className="w-40 h-40 bg-gray-200 rounded-full" />
//                   <div className="mt-4 w-24 h-4 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             ))
//             : categories?.data?.map((category: any, index: number) => (
//               // <div key={index} className="px-4"
//               // >
//               //   <div className="flex flex-col items-center text-center">
//               //     <div className="w-40 h-40 overflow-hidden rounded-md shadow-md"
//               //       onClick={() => router.push(`/category/${category?.id}`)}
//               //     >
//               //       <img
//               //         src={category?.image ? category?.image : EmptyImage}
//               //         alt={category?.name}
//               //         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//               //       />
//               //     </div>
//               //     <div className="mt-4 flex items-center justify-center w-full px-2">
//               //       <h3
//               //         onClick={() => router.push(`/category/${category?.id}`)}
//               //         className="text-lg font-semibold cursor-pointer"
//               //       >
//               //         {category?.name}
//               //       </h3>
//               //     </div>
//               //   </div>
//               // </div>
//               <div key={index} className="px-2 flex justify-center">
//                 <div className="flex flex-col items-center text-center">
//                   <div
//                     className="w-full max-w-[160px] h-[160px] sm:w-[140px] sm:h-[140px] overflow-hidden rounded-md shadow-md"
//                     onClick={() => router.push(`/category/${category?.slug_name}`)}
//                   >
//                     <img
//                       src={category?.image ? category?.image : EmptyImage}
//                       alt={category?.name}
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                     />
//                   </div>
//                   <h3
//                     onClick={() => router.push(`/category/${category?.slug_name}`)}
//                     className="text-base sm:text-lg font-semibold cursor-pointer mt-3"
//                   >
//                     {category?.name}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//         </Slider>
//       </div>
//     </section>
//   );
// };

// export default FeaturedCategories;


"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import EmptyImage from "../../public/images/emptyImage.png";

const CLONE_COUNT = 10;

export default function FeaturedCategoriesCarousel() {
  const { categories, isLoading } = useCategories();
  const router = useRouter();

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef<any>(null);

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 6;
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
    }
    return 2;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const resize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const data = categories?.data || [];

  const loopedCategories = useMemo(() => {
    if (!data || data.length === 0) return [];
    const clones = data.slice(0, Math.min(CLONE_COUNT, data.length));
    return [...data, ...clones];
  }, [data]);

  const totalSlides = Math.ceil(data.length / itemsPerSlide);
  const totalEffectiveSlides = Math.ceil(loopedCategories.length / itemsPerSlide);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = prev + 1;
      if (next >= totalEffectiveSlides) {
        setIsTransitioning(false);
        setTimeout(() => {
          setCurrent(0);
          setIsTransitioning(true);
        }, 50);
        return prev;
      }
      return next;
    });
  }, [totalEffectiveSlides]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = prev - 1;
      if (next < 0) {
        const last = totalEffectiveSlides - 1;
        setIsTransitioning(false);
        setTimeout(() => {
          const jumpBack = totalSlides - 1;
          setCurrent(jumpBack);
          setIsTransitioning(true);
        }, 50);
        return last;
      }
      return next;
    });
  }, [totalEffectiveSlides, totalSlides]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [current, nextSlide]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="w-full px-4 py-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-gray-700 font-bold">Shop by Category</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>

      <div className="relative overflow-hidden" {...handlers}>
        <div
          className="flex"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
          }}
        >
          {loopedCategories.map((cat: any, idx: number) => (
            <div
              key={idx}
              className="flex-shrink-0 flex flex-col items-center px-4 cursor-pointer"
              style={{ width: `${100 / itemsPerSlide}%` }}
              onClick={() => router.push(`/category/${cat?.slug_name}`)}
            >
              <div className="w-full max-w-[150px] h-[150px] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={cat?.image || EmptyImage}
                  alt={cat?.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-3 text-lg font-semibold">{cat?.name}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === current % totalSlides
                  ? "bg-gray-800 w-4"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
