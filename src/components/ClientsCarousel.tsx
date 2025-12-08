// "use client";
// import { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import axios from "axios";
// import { baseUrl } from "@/api-endpoints/ApiUrls";
// import { useVendor } from "@/context/VendorContext";
// import { useSwipeable } from "react-swipeable";
// import EmptyImage from '../../public/images/emptyImage.png';

// export default function ClientsCarousel() {
//   const [clients, setClients] = useState<any[]>([]);
//   const { vendorId } = useVendor();

//   const ourClientGetApi = async () => {
//     try {
//       const res = await axios.get(`${baseUrl}/our-client/?vendorId=${vendorId}`);
//       if (res.data?.clients) {
//         setClients(res?.data?.clients);
//       } else {
//         console.warn("Unexpected API response:", res.data);
//       }
//     } catch (error) {
//       // console.log("Error fetching banners:", error);
//     }
//   };

//   useEffect(() => {
//     ourClientGetApi();
//   }, []);

//   const [current, setCurrent] = useState(0);
//   const timeoutRef = useRef<any>(null);

//   // Responsive items per slide
//   const getItemsPerSlide = () => {
//     if (typeof window !== "undefined") {
//       if (window.innerWidth >= 1280) return 6; // xl & lg
//       if (window.innerWidth >= 1024) return 4; // md
//       if (window.innerWidth >= 640) return 3;  // sm
//     }
//     return 2; // mobile
//   };

//   const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

//   // Handle resize
//   useEffect(() => {
//     const handleResize = () => setItemsPerSlide(getItemsPerSlide());
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Calculate total slides correctly
//   const totalSlides = Math.ceil(clients.length / itemsPerSlide);

//   // Auto-scroll
//   useEffect(() => {
//     timeoutRef.current = setTimeout(() => {
//       setCurrent((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearTimeout(timeoutRef.current);
//   }, [current, totalSlides]);

//   // Swipe Handlers
//   const handlers = useSwipeable({
//     onSwipedLeft: () => setCurrent((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1)),
//     onSwipedRight: () => setCurrent((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1)),
//     trackMouse: true,
//   });

//   return (
//     <section className="mx-auto px-2 py-16">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl text-gray-700 font-bold">Our Clients</h2>
//         <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
//       </div>

//       <div className="relative overflow-hidden" {...handlers}>
//         {/* Slides wrapper */}
//         <div
//           className="flex transition-transform duration-500"
//           style={{ transform: `translateX(-${current * 100}%)` }}
//         >
//           {clients.map((client, idx) => (
//             <div
//               key={idx}
//               className="flex-shrink-0 flex justify-center items-center px-4"
//               style={{ width: `${100 / itemsPerSlide}%` }}
//             >
//               <div className="p-4 flex items-center justify-center h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44">
//                 <Image
//                   src={client?.image_url || EmptyImage}
//                   alt={client?.name || "Client Logo"}
//                   width={200}
//                   height={200}
//                   className="object-contain"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Dots */}
//         <div className="flex justify-center mt-6 gap-2">
//           {Array.from({ length: totalSlides }).map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrent(idx)}
//               className={`w-3 h-3 rounded-full transition-all ${
//                 idx === current ? "bg-gray-800 w-4" : "bg-gray-300"
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
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import { useVendor } from "@/context/VendorContext";
import { useSwipeable } from "react-swipeable";
import EmptyImage from '../../public/images/emptyImage.png';

const CLONE_COUNT = 10; 

export default function ClientsCarousel() {
  const [clients, setClients] = useState<any[]>([]);
  const { vendorId } = useVendor();

  const ourClientGetApi = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/our-client/?vendorId=${vendorId}`);
      if (res.data?.clients) {
        setClients(res?.data?.clients);
      } else {
        console.warn("Unexpected API response:", res.data);
      }
    } catch (error) {

    }
  }, [vendorId]);

  useEffect(() => {
    ourClientGetApi();
  }, [ourClientGetApi]);

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
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loopedClients = useMemo(() => {
    if (clients.length === 0) return [];
    const clones = clients.slice(0, Math.min(CLONE_COUNT, clients.length));
    return [...clients, ...clones];
  }, [clients]);

  const totalSlides = Math.ceil(clients.length / itemsPerSlide); 

  const totalEffectiveSlides = Math.ceil(loopedClients.length / itemsPerSlide);

  const nextSlide = useCallback(() => {
    setCurrent(prev => {
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
    setCurrent(prev => {
      const next = prev - 1;
      if (next < 0) {
        const lastEffectiveSlideIndex = totalEffectiveSlides - 1;
      
        setIsTransitioning(false);
        
        setTimeout(() => {
            const jumpBackIndex = totalSlides - 1; 
            setCurrent(jumpBackIndex);
            setIsTransitioning(true);
        }, 50);

        return lastEffectiveSlideIndex;
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

  if (clients.length === 0) {
    return null; 
  }

  return (
    <section className="mx-auto px-2 py-16">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-gray-700 font-bold">Our Clients</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>

      <div className="relative overflow-hidden" {...handlers}>
        <div
          className="flex"
          style={{ 
            transform: `translateX(-${current * 100}%)`,
            transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
          }}
        >
          {loopedClients.map((client, idx) => (
            <div
              key={idx} 
              className="flex-shrink-0 flex justify-center items-center px-4"
              style={{ width: `${100 / itemsPerSlide}%` }}
            >
              <div className="p-4 flex items-center justify-center h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44">
                <Image
                  src={client?.image_url || EmptyImage}
                  alt={client?.name || "Client Logo"}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === (current % totalSlides) ? "bg-gray-800 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}