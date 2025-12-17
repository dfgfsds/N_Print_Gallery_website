"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import EmptyImage from "../../public/images/emptyImage.png";
import axios from "axios";

export default function FeaturedCategoriesCarousel() {
  const { categories } = useCategories();
  const router = useRouter();

  const data = categories?.data || [];
  const total = data.length;

  if (total === 0) return null;

  // 💡 make a HUGE loop list (NEVER ends)
  const looped = Array(50).fill(data).flat(); // 50 loops → 50× longer → no reset ever

  const [current, setCurrent] = useState(total * 25); 
  // start from MIDDLE to avoid reaching edges

  const timeoutRef = useRef<any>(null);

  const itemWidth = 180;
  const gap = 20;
  const step = itemWidth + gap;

  const nextSlide = () => setCurrent((prev) => prev + 1);
  const prevSlide = () => setCurrent((prev) => prev - 1);

  // AUTOPLAY
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 2500);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  // dot indicator → based ONLY on real categories
  const activeDot = current % total;

  //   const getTestAPi = async () => {
  //   try {
  //     const response = await axios.get("http://192.168.0.176");
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("API error", error);
  //   }
  // };

  // useEffect(() => {
  //   getTestAPi();
  // }, []);

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

      {/* DOTS */}
      <div className="flex justify-center mt-5 gap-2">
        {Array.from({ length: total }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(total * 25 + idx)} 
            className={`w-3 h-3 rounded-full transition-all 
              ${idx === activeDot ? "bg-gray-800 w-4" : "bg-gray-300"}
            `}
          />
        ))}
      </div>
    </section>
  );
}
