"use client";
import React, { useEffect, useRef, useState } from "react";
import ProductVideoModal from "./ProductVideoModal";
import axios from "axios";
import baseUrl from "@/api-endpoints/ApiUrls";
import ApiUrls from "@/api-endpoints/ApiUrls";
import { useVendor } from "@/context/VendorContext";

export default function VideoSection() {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { vendorId } = useVendor();

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${ApiUrls.videos}vendor/${vendorId}/`);
      setVideoList(res.data.videos || []);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [vendorId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    setIsDragging(true);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  // ✅ Convert YouTube / Shorts to embeddable link
  const getVideoEmbed = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("youtube.com/shorts/")) return url.replace("shorts/", "embed/");
    return null;
  };

  // ✅ Don't render if there are no videos
  if (!videoList.length) return null;

  // const getEmbedUrl = (url: string) => {
  //   if (!url) return null;

  //   // YouTube normal
  //   if (url.includes("youtube.com/watch?v=")) {
  //     return url.replace("watch?v=", "embed/") + "?autoplay=1&mute=1&playsinline=1";
  //   }

  //   // youtu.be
  //   if (url.includes("youtu.be/")) {
  //     return url.replace("youtu.be/", "www.youtube.com/embed/") + "?autoplay=1&mute=1&playsinline=1";
  //   }

  //   // YouTube Shorts
  //   if (url.includes("youtube.com/shorts/")) {
  //     return url.replace("shorts/", "embed/") + "?autoplay=1&mute=1&playsinline=1";
  //   }

  //   // Instagram reels/posts
  //   if (url.includes("instagram.com/")) {
  //     return url.split("?")[0] + "embed/";
  //   }

  //   // Facebook Watch
  //   if (url.includes("facebook.com/watch/")) {
  //     return url.replace("watch/", "video/embed/");
  //   }

  //   // Facebook video link
  //   if (url.includes("facebook.com/")) {
  //     return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1`;
  //   }

  //   return null;
  // };


  const getEmbedUrl = (url: string, autoplay: boolean = false) => {
    if (!url) return null;
    const autoParam = autoplay ? 1 : 0;

    // YouTube normal / shorts / youtu.be
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/") + `?autoplay=${autoParam}&modestbranding=1&rel=0&controls=1`;
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/") + `?autoplay=${autoParam}&modestbranding=1&rel=0&controls=1`;
    }
    if (url.includes("youtube.com/shorts/")) {
      return url.replace("shorts/", "embed/") + `?autoplay=${autoParam}&modestbranding=1&rel=0&controls=1`;
    }

    // Instagram reels/posts
    if (url.includes("instagram.com/")) {
      const cleanUrl = url.split("?")[0];
      return `https://www.instagram.com/p/${cleanUrl.split("/p/")[1]}/embed/captioned/?cr=1&autoplay=${autoParam}`;
    }

    // Facebook Watch / video
    if (url.includes("facebook.com/watch/")) {
      return url.replace("watch/", "video/embed/") + `?autoplay=${autoParam}&show_text=0`;
    }
    if (url.includes("facebook.com/")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=${autoParam}`;
    }

    return null;
  };



  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4 py-5">Shop By Videos</h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 cursor-grab active:cursor-grabbing scrollbar-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {videoList.map((video: any, index) => (
          // inside the map function, replacing the existing <div> and <iframe>
          <div
            key={index}
            // The outer div hides the overflow
            className="relative min-w-[220px] rounded-lg shadow-md overflow-hidden"
            style={{ height: '350px' }} // Define the visible height
            onClick={() => setSelectedIndex(index)}
          >
            <iframe
              src={getEmbedUrl(video?.thumbnail_url) || ""}
              // The iframe is taller than the container (e.g., 400px), and shifts up (e.g., -50px)
              className="w-full object-cover"
              style={{ height: '400px', marginTop: '-50px' }} // Adjust these values to perfectly hide the top bar
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        ))}
      </div>
      {/* 
      {selectedIndex !== null && (
        <ProductVideoModal
          videoList={videoList}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )} */}
      {selectedIndex !== null && (
        <ProductVideoModal
          videoList={videoList}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          autoplay={true} // ✅ pass autoplay flag
        />
      )}


    </div>
  );
}
