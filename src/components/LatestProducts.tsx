// "use client";
// import { useProducts } from "@/context/ProductsContext";
// import Image from "next/image";
// import { slugConvert } from "../../lib/utils";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// export default function LatestProducts() {
//   const { products } = useProducts();
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [itemsPerSlide, setItemsPerSlide] = useState(4);

//   // Responsive items per slide
//   useEffect(() => {
//     const updateItemsPerSlide = () => {
//       if (window.innerWidth < 640) {
//         setItemsPerSlide(1);
//       } else if (window.innerWidth < 1024) {
//         setItemsPerSlide(2);
//       } else {
//         setItemsPerSlide(4);
//       }
//     };

//     updateItemsPerSlide();
//     window.addEventListener("resize", updateItemsPerSlide);
//     return () => window.removeEventListener("resize", updateItemsPerSlide);
//   }, []);

//   const totalSlides = Math.ceil((products?.data?.length || 0) / itemsPerSlide);

//   const nextSlide = () => {
//     setCurrentIndex((prev) =>
//       prev === totalSlides - 1 ? 0 : prev + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) =>
//       prev === 0 ? totalSlides - 1 : prev - 1
//     );
//   };

//   return (
//     <div className="w-full">
//       {/* Section Title */}
//       <div className="text-center my-8">
//         <h2 className="text-2xl text-gray-700 font-bold">Featured Products</h2>
//         <div className="w-20 h-1 bg-red-600 mx-auto mt-2 rounded"></div>
//       </div>

//       {/* Carousel Container */}
//       <div className="relative max-w-7xl mx-auto px-4">
//         <div className="overflow-hidden">
//           <div
//             className="flex transition-transform duration-500"
//             style={{
//               transform: `translateX(-${currentIndex * 100}%)`,
//               width: `${totalSlides * 100}%`,
//             }}
//           >
//             {Array.from({ length: totalSlides }).map((_, slideIndex) => (
//               <div
//                 key={slideIndex}
//                 className="w-full flex-shrink-0 px-2"
//               >
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
//                   {products?.data
//                     ?.slice(
//                       slideIndex * itemsPerSlide,
//                       slideIndex * itemsPerSlide + itemsPerSlide
//                     )
//                     .map((product: any, i: number) => (
//                       <div
//                         key={i}
//                         className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
//                       >
//                         <div className="relative w-full h-36 sm:h-40 md:h-48">
//                           <Image
//                             src={product.image_urls[0]}
//                             alt={product.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="p-4 text-center">
//                           <h3
//                             onClick={() =>
//                               router.push(
//                                 `/products/${slugConvert(product.name)}`
//                               )
//                             }
//                             className="font-semibold text-lg cursor-pointer hover:text-red-600"
//                           >
//                             {product.name}
//                           </h3>
//                           <div className="flex justify-center gap-2">
//                             <p className="text-sm mt-2">₹{product.price}</p>
//                             <p className="text-sm text-gray-500 mt-2 line-through">
//                               ₹{product.discount}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Controls */}
//         <button
//           onClick={prevSlide}
//           className="absolute top-1/2 -left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
//         >
//           ‹
//         </button>
//         <button
//           onClick={nextSlide}
//           className="absolute top-1/2 -right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
//         >
//           ›
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";
import { useProducts } from "@/context/ProductsContext";
import Image from "next/image";
import { slugConvert } from "../../lib/utils";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import EmptyImage from "../../public/images/emptyImage.png";
import { useWishList } from "@/context/WishListContext";
export default function LatestProducts() {
  const { products } = useProducts();
  const router = useRouter();
  const emptyImage = EmptyImage;
    const { wishList, wishListLoading }: any = useWishList();


      const finalProductData = products?.data?.products?.map((item: any) => {
        const wishLists = wishList?.data?.find(
            (wish: any) => wish?.product === item?.id
        );
        return {
            ...item,
            isLike: wishLists ? true : false,
            wishListId: wishLists?.id
        };
    });

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="text-center my-8">
        <h2 className="text-2xl text-gray-700 font-bold">Featured Products</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>

      {/* Products Grid */}
      <div className="mx-auto px-4">
        {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4  xl:grid-cols-5 gap-6">
          {products?.data?.slice(0,8)?.map((product: any, i: number) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-36 sm:h-40 md:h-48">
                <Image
                  src={product.image_urls[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3
                  onClick={() =>
                    router.push(`/products/${slugConvert(product.name)}`)
                  }
                  className="font-semibold text-lg cursor-pointer hover:text-[#13cea1]"
                >
                  {product.name}
                </h3>
                <div className="flex justify-center gap-2">
                  <p className="text-sm mt-2">₹{product.price}</p>
                  <p className="text-sm text-gray-500 mt-2 line-through">
                    ₹{product.discount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  {finalProductData
                     ?.filter((product: any) => product?.is_featured === true)
                    ?.slice(0, 8)
                    ?.map((product: any, idx: number) => (
                      <ProductCard
                        key={idx}
                        image={product?.image_urls?.[0]  ? product?.image_urls?.[0] : emptyImage || emptyImage}
                        hoverImage={product?.image_urls?.[1] ? product?.image_urls?.[1] :product?.image_urls?.[0] || emptyImage}
                        title={product?.name}
                        price={product?.price}
                        onAddToCart={() => alert(`Add to cart: ${product?.name}`)}
                        onView={() => router.push(`/products/${slugConvert(product?.slug_name)}`)}
                        onWishlist={() => alert(`Wishlist: ${product?.name}`)}
                        product={product}
                      />
                    ))}
                </div>
      </div>
    </div>
  );
}
