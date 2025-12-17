"use client";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import { useVendor } from "@/context/VendorContext";
import axios from "axios";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSwipeable } from "react-swipeable";

const CLONE_COUNT = 5; 

export default function Testimonials() {
  const { vendorId } = useVendor();
  const [reviews, setReviews] = useState<any[]>([]);

  const staticImages = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/55.jpg",
    "https://randomuser.me/api/portraits/women/12.jpg",
    "https://randomuser.me/api/portraits/men/41.jpg",
    "https://randomuser.me/api/portraits/women/70.jpg",
    "https://randomuser.me/api/portraits/men/85.jpg",
  ];

  const reviewsGetApi = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/testimonial/?vendor_id=${vendorId}`);
      if (res.data?.testimonials) {
        const verifiedReviews = res.data.testimonials.filter((review: any) => review?.verified_status === true);
        const reviewsWithImages = verifiedReviews.map((review: any, index: any) => ({
          ...review,
          img: staticImages[index % staticImages.length], 
        }));
        setReviews(reviewsWithImages);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
    }
  }, [vendorId]);

  useEffect(() => {
    reviewsGetApi();
  }, [reviewsGetApi]);

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true); 
  const timeoutRef = useRef<any>(null);

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 5;
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 2;
      if (window.innerWidth >= 300) return 1;
    }
    return 1;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loopedReviews = useMemo(() => {
    if (reviews.length === 0) return [];
    const clones = reviews.slice(0, Math.min(CLONE_COUNT, reviews.length));
    return [...reviews, ...clones];
  }, [reviews]);

  const totalItems = loopedReviews.length;

  const originalItemsCount = reviews.length;

  const nextSlide = useCallback(() => {
    setCurrent(prev => {
      const nextIndex = prev + 1;

      if (nextIndex >= originalItemsCount) {
        setIsTransitioning(false);

        setTimeout(() => {
          setCurrent(0);
          setIsTransitioning(true);
        }, 50);

        return nextIndex; 
      }
      return nextIndex;
    });
  }, [originalItemsCount]);

  const prevSlide = useCallback(() => {
    setCurrent(prev => {
      const prevIndex = prev - 1;
      
      if (prevIndex < 0) {
        setIsTransitioning(false);

        setTimeout(() => {
            setCurrent(originalItemsCount - 1);
            setIsTransitioning(true);
        }, 50);

        return 0; 
      }
      return prevIndex;
    });
  }, [originalItemsCount]);

  useEffect(() => {
    if (reviews.length > 0) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(nextSlide, 4000); 
      return () => clearTimeout(timeoutRef.current);
    }
  }, [current, reviews.length, nextSlide]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  if (reviews.length === 0) {
    return null; 
  }

  const itemWidth = 100 / itemsPerSlide;

  return (
    <section className="mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl text-gray-700 font-bold">What Our Customers Say</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>
      
      <div className="relative overflow-hidden" {...handlers}>
        <div
          className="flex gap-6" 
          style={{
            transform: `translateX(-${itemWidth * current}%)`,
            transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
          }}
        >
          {loopedReviews.map((review, idx) => (
            <div
              key={idx} 
              className="flex-shrink-0 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center"

              style={{ width: `${itemWidth}%` }}
            >
              <img
                src={review.img}
                alt={review.title}
                className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-gray-100 shadow-sm"
              />
              <p className="text-gray-600 text-sm mb-4 italic line-clamp-4">
                "{review.description}"
              </p>
              <h3 className="font-semibold text-gray-800">{review.title}</h3>
            </div>
          ))}
        </div>

        {reviews.length > 0 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: originalItemsCount }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsTransitioning(true); 
                  setCurrent(idx);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  (current % originalItemsCount) === idx ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

