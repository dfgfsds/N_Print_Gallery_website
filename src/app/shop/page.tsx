"use client";
import { useState, useEffect } from "react";
import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import { useWishList } from "@/context/WishListContext";
import EmptyImage from "../../../public/images/emptyImage.png";

export default function Shop() {
    const { categories } = useCategories();
    const { products } = useProducts();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { wishList, wishListLoading }: any = useWishList();
    const emptyImage = EmptyImage;


    // Filter products by selected category
    const filteredProducts = products?.data?.products?.filter(
        (p: any) => p.category === selectedCategory
    );

    function slugConvert(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
    }

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
        <div className="mx-auto px-4 py-6">
            <div>
                <div className="text-center my-2">
                    <h2 className="text-2xl text-gray-700 font-bold">All Products</h2>
                    <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                </div>
                <div className="flex items-center gap-2 py-3">
                    <div className="hover:text-[#4db49c] cursor-pointer text-gray-400 font-medium "
                        onClick={() => {
                            router.back();
                        }}
                    >
                        Home
                    </div>/
                    <div className="text-[#13cea1] font-medium">
                        All Products
                    </div>
                </div>


                {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories?.data?.map((cat: any) => (
                        <div
                            key={cat?.id}
                            onClick={() =>
                                router.push(`/shop/${cat?.id}`)
                            }
                            className="cursor-pointer bg-white shadow hover:shadow-lg rounded-lg p-4 flex flex-col items-center"
                        >
                            <Image
                                src={cat?.image ? cat?.image : emptyImage}
                                alt={cat.name}
                                width={150}
                                height={150}
                                className="rounded-md object-cover"
                            />
                            <h3 className="mt-3 text-lg font-semibold">{cat.name}</h3>
                        </div>
                    ))}
                </div> */}

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories?.data?.map((cat: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() =>
                                router.push(`/shop/${cat?.id}`)
                            }
                            className="cursor-pointer group"
                        >
                         
                            <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                                <img
                                    src={cat?.image}
                                    alt={cat?.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>

                           
                            <span className="block mt-3 text-center text-base md:text-lg font-semibold text-gray-800">
                                {cat?.name}
                            </span>
                        </div>
                    ))}
                </div> */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories?.data?.map((cat: any, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => {
                                if (cat?.subcategories?.length) {
                                    router.push(`/category/${cat?.slug_name}`)
                                } else {
                                    router.push(`/shop/${cat?.slug_name}`)
                                }
                            }}
                            className="cursor-pointer group"
                        >
                            {/* Square Image */}
                            <div className="w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center overflow-hidden rounded-md shadow">
                                <img
                                    src={cat?.image ? cat?.image : emptyImage}
                                    alt={cat?.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>

                            {/* Name below */}
                            <span className="block mt-3 text-center text-base md:text-lg font-semibold text-gray-800">
                                {cat?.name}
                            </span>
                            {cat?.starting_price && (
                                <span className="block text-center text-sm md:text-base font-medium text-gray-600">
                                    Starts from ₹{cat?.starting_price}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

            </div>


            <div className="w-full pt-12 mb-5">
                {/* Header style different ah */}
                {/* <h4 className="relative text-2xl font-bold text-center text-black mb-10">
                    Featured Products
                    <span className="block w-16 h-[3px] bg-[#13cea1] mx-auto mt-2 rounded-full"></span>
                </h4> */}

                <div className="text-center my-8">
                    <h2 className="text-2xl text-gray-700 font-bold">Featured Products</h2>
                    <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {finalProductData
                        ?.filter((product: any) => product?.is_featured === true)
                        ?.slice(0, 8)
                        ?.map((product: any, idx: number) => (
                            <ProductCard
                                key={idx}
                                image={product?.image_urls?.[0] || emptyImage}
                                hoverImage={product?.image_urls?.[1] ? product?.image_urls?.[1] : product?.image_urls?.[0] || emptyImage}
                                title={product?.name}
                                price={product?.price}
                                onAddToCart={() => alert(`Add to cart: ${product?.name}`)}
                                onView={() => router.push(`/products/${(product?.slug_name)}`)}
                                onWishlist={() => alert(`Wishlist: ${product?.name}`)}
                                product={product}
                            />
                        ))}
                </div>
            </div>

        </div >
    );
}
