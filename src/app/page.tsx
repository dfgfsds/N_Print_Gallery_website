"use client";

import AboutHeroSection from "@/components/aboutHeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import LatestProducts from "@/components/LatestProducts";
import ProductGrid from "@/components/ProductGrid";
import StandupPouchSection from "@/components/StandupPouchSection";
import { useProducts } from "@/context/ProductsContext";
import { useState, useEffect, useRef } from "react";
import image1 from "../../public/images/carImg1.jpg"
import image2 from "../../public/images/carImg2.jpg"
import image3 from "../../public/images/carImg3.jpg"
import image4 from "../../public/images/carImg4.jpg"
import WhyChooseUs from "@/components/WhyChooseUs";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import Testimonials from "@/components/Testimonials";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import Image from "next/image";
import ClientsCarousel from "@/components/ClientsCarousel";
import { useRouter } from "next/navigation";
import EmptyImage from '../../public/images/emptyImage.png';
import VideoSection from "@/components/VideoSection/VideoSection";

const images = [
  image1, image2, image3, image4
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter banners based on type
  const filteredBanners = banners?.filter(banner =>
    isMobile ? banner.type === 'Mobile View' : banner.type === 'Web View'
  );

  const visibleBanners = filteredBanners?.filter(
    (img: any) => img?.is_offer === false
  ) || [];

  const length = visibleBanners.length;

  useEffect(() => {
    if (length > 0) {
      setCurrent(0); // 🔥 ALWAYS START FROM FIRST
    }
  }, [length]);

  useEffect(() => {
    if (length <= 1) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = prev + 1;
        return next >= length ? 0 : next;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [length]);

  useEffect(() => {
    if (length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);

    return () => clearInterval(timer);
  }, [length]);

  const prevSlide = () => {
    if (!length) return;
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (!length) return;
    setCurrent((prev) => (prev + 1) % length);
  };

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearInterval(timer);
  }, [length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Fetch banners
  const bannerGetApi = async () => {
    try {
      const res = await axios.get(`${baseUrl}/banners/?vendorId=134`);
      if (res.data?.banners) {
        setBanners(res.data.banners);
      } else {
        // console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      // console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    bannerGetApi();
  }, []);


  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) return null;



  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: false,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="dot w-2 h-2 bg-gray-300 rounded-full transition-all duration-300" />
    ),
  };

  const handleBannerClick = (banner: any) => {
    if (banner?.target_url) {
      router.push(banner.target_url); // Always open in same tab
    }
  };

  return (
    <div>
      {/* <div className="relative w-full">
        <div className="relative h-80 overflow-hidden  md:h-96">
          {visibleBanners.map((img, index) => (
            // <div
            //   key={index}
            //   className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
            //     }`}
            //   onClick={() => handleBannerClick(img)}
            // >
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700
    ${index === current
                  ? "opacity-100 z-20 pointer-events-auto"
                  : "opacity-0 z-10 pointer-events-none"
                }
  `}
            >
              <img
                src={img.image_url}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {visibleBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"
                }`}
            />
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/30 hover:bg-white/50">
            <svg
              className=" w-3 md:w-4  h-3 md:h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 6 10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </span>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/30 hover:bg-white/50">
            <svg
              className="w-3 md:w-4  h-3 md:h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 6 10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 9l4-4-4-4"
              />
            </svg>
          </span>
        </button>
      </div> */}

      <div className="relative w-full">
        {/* Banner container */}
        <div className="relative w-full aspect-[16/6] overflow-hidden bg-white">
          {visibleBanners.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700
          ${index === current
                  ? "opacity-100 z-20 pointer-events-auto"
                  : "opacity-0 z-10 pointer-events-none"
                }
        `}
              onClick={() => handleBannerClick(img)}
            >
              <img
                src={img.image_url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full "
              />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {visibleBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"
                }`}
            />
          ))}
        </div>

        {/* Prev */}
        <button
          onClick={prevSlide}
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/30 hover:bg-white/50">
            <svg
              className=" w-3 md:w-4  h-3 md:h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 6 10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </span>
        </button>

        {/* Next */}
        <button
          onClick={nextSlide}
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-6 md:w-10 h-6 md:h-10 rounded-full bg-white/30 hover:bg-white/50">
            <svg
              className="w-3 md:w-4  h-3 md:h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 6 10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 9l4-4-4-4"
              />
            </svg>
          </span>
        </button>
      </div>


      <CategoryCarousel />
      {/* <ProductGrid /> */}
      <LatestProducts />
      {/* <VideoSection /> */}
      <WhyChooseUs />
      {/* <PortfolioShowcase/> */}

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 px-5">

        {filteredBanners
          ?.filter((img: any) => img?.is_offer === true)
          ?.slice(0, 2) // take only 2
          ?.map((img: any, index: number) => (
            <div key={index}>
              <div
                onClick={() => handleBannerClick(img)}
                className="relative w-full h-[250px] md:h-[300px] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={img?.image_url ? img.image_url : EmptyImage}
                  alt="Offer Banner 2"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ))}
      </div>


      <ClientsCarousel />
      <Testimonials />
      {/* <StandupPouchSection /> */}
      {/* <AboutHeroSection /> */}

    </div>
  );
}
