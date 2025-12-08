// ProductVideoModal.tsx
import { postCartitemApi } from "@/api-endpoints/CartsApi";
import LoginModal from "@/app/LoginModal/page";
import { useVendor } from "@/context/VendorContext";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProductVideoModal({ videoList, initialIndex, onClose }: any) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentVideo = videoList[currentIndex];
  const router = useRouter();
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [getUserName, setUserName] = useState<string | null>(null);
  const [signInmodal, setSignInModal] = useState(false);
  const { vendorId } = useVendor();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');
    const storedUserName = localStorage.getItem('userName');

    setUserId(storedUserId);
    setCartId(storedCartId);
    setUserName(storedUserName);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev: number) => (prev + 1) % videoList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev: number) =>
      prev === 0 ? videoList.length - 1 : prev - 1
    );
  };

  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      cart: getCartId,
      product: id,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user'
    }
    try {
      const response = await postCartitemApi(``, payload)
      if (response) {
        onClose();
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }
    const getVideoEmbed = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("youtube.com/shorts/")) return url.replace("shorts/", "embed/");
    return null;
  };


  return (
    <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-8 overflow-auto">
      <div className="bg-white rounded-sm shadow-lg w-full max-w-2xl flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          ×
        </button>

        <div className="w-full md:w-1/2 bg-black relative">
          {/* <video
            className="w-full h-full object-cover"
            src={currentVideo?.thumbnail_url}
            autoPlay
            loop
            muted
            controls
          /> */}
          {currentVideo?.thumbnail_url && (
            <div className="relative w-full h-full">
              {(() => {
                const embedUrl = getVideoEmbed(currentVideo.thumbnail_url);

                return embedUrl ? (
                  <iframe
                    className="w-full h-[350px] object-cover"
                    src={embedUrl}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={currentVideo.thumbnail_url}
                    className="w-full h-[350px] object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                );
              })()}
            </div>
          )}

          <button
            onClick={handlePrev}
            className="fixed top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full z-50"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 p-3 rounded-full z-50"
          >
            <ArrowRight size={24} />
          </button>
          <button
            onClick={onClose}
            className="fixed top-10  right-6 transform -translate-y-1/2 text-white bg-black bg-opacity-60 hover:bg-opacity-80 p-1 rounded-full z-50"
          >
            X
          </button>
        </div>
        <div className="w-full md:w-1/2 flex flex-col max-h-[90vh]">
          {/* Top Content */}
          <div className="mb-3 p-6">
            <img
              src={currentVideo?.product_details?.image_urls?.[0] ? currentVideo?.product_details?.image_urls?.[0] : ''}
              alt="Product"
              className="w-28 h-28 object-cover rounded-lg mb-3 mx-auto"
            />
            <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-green-600">
                ₹{currentVideo?.product_details?.price}
              </span>
              {currentVideo?.product_details?.price === currentVideo?.product_details?.discount || currentVideo?.product_details?.discount === 0 || currentVideo?.product_details?.discount === '' ?
                ('') : (
                  <>
                    <span className="line-through text-gray-400 text-lg">
                      ₹{currentVideo?.product_details?.discount}
                    </span>
                  </>
                )}
            </div>
          </div>

          {/* Separator */}
          <div className="h-2 bg-gray-200"></div>

          {/* Scrollable Middle Description */}
          <div className="text-sm text-gray-600 p-6 overflow-y-auto max-h-[200px]">
            <p>
              <strong>Description:</strong>{" "}
              {/* {currentVideo?.product_details?.description?.slice(0, 150)} */}
              <div dangerouslySetInnerHTML={{ __html: currentVideo?.product_details?.description?.slice(0, 150) }} className="quill-content" />

            </p>
          </div>

          {/* Bottom Buttons */}
          <div className="flex gap-3 p-6 mt-auto">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                router.push(`/products/${currentVideo?.product_details?.slug_name}`);
              }}
            >
              More info
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                if (getUserId) {
                  handleAddCart(currentVideo?.product_details?.id, 1);
                } else {
                  onClose();
                  setSignInModal(true);
                }
              }}
            >
              Add to cart
              <ShoppingCart />
            </button>
          </div>
        </div>

      </div>

      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
      )}
    </div>
  );
}


// import Image from "next/image";

// interface CardItem {
//   img: string;
//   title: string;
//   subtitle: string;
// }

// const cardData: CardItem[] = [
//   { img: "/images/pouch.jpg", title: "Stand Up Pouch", subtitle: "(Starts from 10 Qty)" },
//   { img: "/images/cards.jpg", title: "Business Cards", subtitle: "(Starts from 100 Qty)" },
//   { img: "/images/marketing.jpg", title: "Marketing Materials", subtitle: "(Starts from 1 Qty)" },
//   { img: "/images/signage.jpg", title: "Signage", subtitle: "(Starts from 1 Qty)" },
// ];

// export default function ProductCards() {
//   return (
//     <div className="w-full py-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {cardData.map((item, idx) => (
//           <div
//             key={idx}
//             className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
//           >
//             {/* Image Section */}
//             <div className="relative w-full h-64">
//               <Image
//                 src={item.img}
//                 alt={item.title}
//                 fill
//                 className="object-cover"
//               />
//             </div>

//             {/* Content Section */}
//             <div className="text-center py-4">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {item.title}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>

//               {/* Button */}
//               <button className="mt-3 bg-red-500 text-white text-sm font-medium px-6 py-1.5 rounded-full hover:bg-red-600 transition">
//                 View This
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
