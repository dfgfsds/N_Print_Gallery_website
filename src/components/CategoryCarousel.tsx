// "use client";
// import { useEffect, useState, useRef, useMemo, useCallback } from "react";
// import Image from "next/image";
// import { useCategories } from "@/context/CategoriesContext";
// import { useRouter } from "next/navigation";
// import { useSwipeable } from "react-swipeable";
// import EmptyImage from "../../public/images/emptyImage.png";

// export default function FeaturedCategoriesCarousel() {
//   const { categories } = useCategories();
//   const router = useRouter();

//   const [current, setCurrent] = useState(0);
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

//   // 🔥 Clone categories so slider always stays full
//   const loopedCategories = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     let repeated = [...data];

//     // repeat until we get 3 full screens of items
//     while (repeated.length < itemsPerSlide * 6) {
//       repeated = [...repeated, ...data];
//     }

//     return repeated;
//   }, [data, itemsPerSlide]);

//   // 🔥 Valid slides = only REAL full slides
//   const realSlides = Math.ceil(data.length / itemsPerSlide);
//   const maxSlideIndex = realSlides - 1;

//   // start from slide 0
//   useEffect(() => {
//     setCurrent(0);
//   }, [itemsPerSlide]);

//   const nextSlide = useCallback(() => {
//     setCurrent((prev) => {
//       const next = prev + 1;
//       if (next > maxSlideIndex) return 0; // loop only inside valid slides
//       return next;
//     });
//   }, [maxSlideIndex]);

//   const prevSlide = useCallback(() => {
//     setCurrent((prev) => {
//       const next = prev - 1;
//       if (next < 0) return maxSlideIndex;
//       return next;
//     });
//   }, [maxSlideIndex]);

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

//   if (data.length === 0) return null;

//   return (
//     <section className="w-full px-4 py-12">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl text-gray-700 font-bold">Shop by Category</h2>
//         <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
//       </div>

//       <div className="relative overflow-hidden" {...handlers}>
//         <div
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{
//             transform: `translateX(-${current * 100}%)`,
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

//         {/* Dots only for real slides */}
//         <div className="flex justify-center mt-6 gap-2">
//           {Array.from({ length: realSlides }).map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrent(idx)}
//               className={`w-3 h-3 rounded-full transition-all ${idx === current ? "bg-gray-800 w-4" : "bg-gray-300"
//                 }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import EmptyImage from "../../public/images/emptyImage.png";

export default function FeaturedCategoriesCarousel() {
  const { categories } = useCategories();
  const router = useRouter();

  const data = categories?.data || [];

  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<any>(null);

  const itemWidth = 180;
  const gap = 20;
  const step = itemWidth + gap;

  const total = data.length;

  // ⭐ FIX 1 → Remove triple duplicate (empty space issue gone)
  // We'll use a SMOOTH infinite loop trick instead.
  const looped = [...data, ...data]; // only 2 copies, not 3

  const nextSlide = useCallback(() => {
    setCurrent((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? 0 : prev - 1));
  }, []);

  // ⭐ FIX 2 → Auto-slide + RESET without visible jump
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 2500);

    // when reaching end → RESET instantly (no animation)
    if (current >= total) {
      setTimeout(() => {
        setCurrent(0); // smooth infinite
      }, 500);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [current, total, nextSlide]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  if (data.length === 0) return null;

  // ⭐ FIX 3 → Dots always correct & no empty space
  const activeDot = current % total;

  return (
    <section className="w-full px-4 py-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-gray-700 font-bold">Shop by Category</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>

      {/* CAROUSEL */}
      <div className="relative overflow-hidden" {...handlers}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${current * step}px)`,
          }}
        >
          {looped.map((cat: any, idx: number) => (
            <div
              key={idx}
              className="flex-shrink-0 cursor-pointer"
              style={{ width: itemWidth, marginRight: gap }}
              onClick={() => router.push(`/category/${cat?.slug_name}`)}
            >
              <div className="w-full h-[180px] rounded-lg overflow-hidden shadow">
                <Image
                  src={cat?.image || EmptyImage}
                  alt={cat?.name}
                  width={180}
                  height={180}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-gray-800 font-medium">
                {cat?.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ DOT INDICATORS */}
      <div className="flex justify-center mt-5 gap-2">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all 
                ${idx === activeDot ? "bg-gray-800 w-4" : "bg-gray-300"}
            `}
          />
        ))}
      </div>
    </section>
  );
}
