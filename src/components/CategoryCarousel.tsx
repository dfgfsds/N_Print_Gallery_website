// "use client";
// import { useEffect, useState, useRef, useMemo, useCallback } from "react";
// import Image from "next/image";
// import { useCategories } from "@/context/CategoriesContext";
// import { useRouter } from "next/navigation";
// import { useSwipeable } from "react-swipeable";
// import EmptyImage from "../../public/images/emptyImage.png";

// const CLONE_COUNT = 10;

// export default function FeaturedCategoriesCarousel() {
//   const { categories, isLoading } = useCategories();
//   const router = useRouter();

//   const [current, setCurrent] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(true);
//   const timeoutRef = useRef<any>(null);

//   const getItemsPerSlide = () => {
//     if (typeof window !== "undefined") {
//       if (window.innerWidth >= 1280) return 6;
//       if (window.innerWidth >= 1024) return 4;
//       if (window.innerWidth >= 768) return 3;
//     }
//     return 2;
//   };

//   const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

//   useEffect(() => {
//     const resize = () => setItemsPerSlide(getItemsPerSlide());
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   const data = categories?.data || [];

//   const loopedCategories = useMemo(() => {
//     if (!data || data.length === 0) return [];
//     const clones = data.slice(0, Math.min(CLONE_COUNT, data.length));
//     return [...data, ...clones];
//   }, [data]);

//   const totalSlides = Math.ceil(data.length / itemsPerSlide);
//   const totalEffectiveSlides = Math.ceil(loopedCategories.length / itemsPerSlide);

//   const nextSlide = useCallback(() => {
//     setCurrent((prev) => {
//       const next = prev + 1;
//       if (next >= totalEffectiveSlides) {
//         setIsTransitioning(false);
//         setTimeout(() => {
//           setCurrent(0);
//           setIsTransitioning(true);
//         }, 50);
//         return prev;
//       }
//       return next;
//     });
//   }, [totalEffectiveSlides]);

//   const prevSlide = useCallback(() => {
//     setCurrent((prev) => {
//       const next = prev - 1;
//       if (next < 0) {
//         const last = totalEffectiveSlides - 1;
//         setIsTransitioning(false);
//         setTimeout(() => {
//           const jumpBack = totalSlides - 1;
//           setCurrent(jumpBack);
//           setIsTransitioning(true);
//         }, 50);
//         return last;
//       }
//       return next;
//     });
//   }, [totalEffectiveSlides, totalSlides]);

//   useEffect(() => {
//     clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(nextSlide, 3000);
//     return () => clearTimeout(timeoutRef.current);
//   }, [current, nextSlide]);

//   const handlers = useSwipeable({
//     onSwipedLeft: nextSlide,
//     onSwipedRight: prevSlide,
//     trackMouse: true,
//   });

//   if (!data || data.length === 0) return null;

//   return (
//     <section className="w-full px-4 py-12">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl text-gray-700 font-bold">Shop by Category</h2>
//         <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
//       </div>

//       <div className="relative overflow-hidden" {...handlers}>
//         <div
//           className="flex"
//           style={{
//             transform: `translateX(-${current * 100}%)`,
//             transition: isTransitioning ? "transform 500ms ease-in-out" : "none",
//           }}
//         >
//           {loopedCategories.map((cat: any, idx: number) => (
//             <div
//               key={idx}
//               className="flex-shrink-0 flex flex-col items-center px-4 cursor-pointer"
//               style={{ width: `${100 / itemsPerSlide}%` }}
//               onClick={() => router.push(`/category/${cat?.slug_name}`)}
//             >
//               <div className="w-full max-w-[150px] h-[150px] rounded-lg overflow-hidden shadow-md">
//                 <Image
//                   src={cat?.image || EmptyImage}
//                   alt={cat?.name}
//                   width={200}
//                   height={200}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <p className="mt-3 text-lg font-semibold">{cat?.name}</p>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center mt-6 gap-2">
//           {Array.from({ length: totalSlides }).map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrent(idx)}
//               className={`w-3 h-3 rounded-full transition-all ${
//                 idx === current % totalSlides
//                   ? "bg-gray-800 w-4"
//                   : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import EmptyImage from "../../public/images/emptyImage.png";

export default function FeaturedCategoriesCarousel() {
  const { categories } = useCategories();
  const router = useRouter();

  const [current, setCurrent] = useState(0);
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

  // 🔥 Clone categories so slider always stays full
  const loopedCategories = useMemo(() => {
    if (!data || data.length === 0) return [];

    let repeated = [...data];

    // repeat until we get 3 full screens of items
    while (repeated.length < itemsPerSlide * 6) {
      repeated = [...repeated, ...data];
    }

    return repeated;
  }, [data, itemsPerSlide]);

  // 🔥 Valid slides = only REAL full slides
  const realSlides = Math.ceil(data.length / itemsPerSlide);
  const maxSlideIndex = realSlides - 1;

  // start from slide 0
  useEffect(() => {
    setCurrent(0);
  }, [itemsPerSlide]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = prev + 1;
      if (next > maxSlideIndex) return 0; // loop only inside valid slides
      return next;
    });
  }, [maxSlideIndex]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = prev - 1;
      if (next < 0) return maxSlideIndex;
      return next;
    });
  }, [maxSlideIndex]);

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

  if (data.length === 0) return null;

  return (
    <section className="w-full px-4 py-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-gray-700 font-bold">Shop by Category</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>

      <div className="relative overflow-hidden" {...handlers}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${current * 100}%)`,
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

        {/* Dots only for real slides */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: realSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === current ? "bg-gray-800 w-4" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

