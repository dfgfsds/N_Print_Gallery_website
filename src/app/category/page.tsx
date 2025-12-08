"use client";

import ProductCard from "@/components/ProductCard";
import { useCartItem } from "@/context/CartItemContext";
import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useWishList } from "@/context/WishListContext";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugConvert } from "../../../lib/utils";
import EmptyImage from '../../../public/images/emptyImage.png'

export default function Category() {
    const { categories } = useCategories();
    const items = categories?.data || [];
    const router = useRouter();
    const { wishList, wishListLoading }: any = useWishList();
    const { cartItem }: any = useCartItem();
    const { products, isAuthenticated, isLoading }: any = useProducts();
    const emptyImage = EmptyImage;

    const filteredProducts = Array.isArray(products?.data) ? products?.data : [];
    const matchingProductsArray = filteredProducts?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.cart?.items?.find(
            (item: any) => item.product?.id === product?.id
        );

        if (matchingCartItem) {
            return {
                ...product,
                Aid: index,
                cartQty: matchingCartItem?.quantity,
                cartId: matchingCartItem.id,
            };
        }
        return product;
    });
    const finalProductData = matchingProductsArray?.map((item: any) => {
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
        <section className="w-full bg-white py-10">
            <div className="text-center my-2">
                <h2 className="text-2xl text-gray-700 font-bold">All Categories</h2>
                <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
            </div>
            <div className="mx-auto px-4">
                {/* Back + Heading */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-black"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-xl md:text-2xl font-bold text-gray-500">Back</span>
                    </button>
                    <span className="px-2">/</span>
                    <h2 className="text-[#13cea1] text-left text-xl md:text-2xl font-bold mb-0">
                        All Categories
                    </h2>
                </div>


                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items?.map((cat: any, idx: number) => (
                        // <div
                        //     key={idx}
                        //     onClick={() => router.push(`/category/${cat?.id}`)}
                        //     className="cursor-pointer group"
                        // >
                        //     <div className="w-full h-48 flex items-center justify-center overflow-hidden">
                        //         <img
                        //             src={cat?.image}
                        //             alt={cat?.name}
                        //             className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        //         />
                        //     </div>

                        //     <span className="block mt-3 text-center text-base md:text-lg font-semibold text-gray-800">
                        //         {cat?.name}
                        //     </span>
                        // </div>
                        <div
                            key={idx}
                            onClick={() => router.push(`/category/${cat?.slug_name}`)}
                            className="cursor-pointer group"
                        >
                            {/* Square image */}
                            <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg shadow-md">
                                <img
                                    src={cat?.image}
                                    alt={cat?.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>

                            {/* Name below */}
                            <span className="block mt-3 text-center text-base md:text-lg font-semibold text-gray-800">
                                {cat?.name}
                            </span>

                            {/* Starting Price */}
                            {cat?.starting_price && (
                                <span className="block text-center text-sm md:text-base font-medium text-gray-600">
                                    Starts from ₹{cat?.starting_price}
                                </span>
                            )}
                        </div>

                    ))}
                </div>
            </div>


            <div className="w-full pt-12 mb-5 mx-auto px-4">
                {/* Header style different ah */}
                <div className="text-center my-4">
                    <h2 className="text-2xl text-gray-700 font-bold">Featured Products</h2>
                    <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {finalProductData
                        ?.filter((product: any) => product?.is_featured === true)
                        ?.slice(0, 4)
                        ?.map((product: any, idx: number) => (
                            <ProductCard
                                key={idx}
                                image={product?.image_urls?.[0] || emptyImage}
                                hoverImage={product?.image_urls?.[1] ? product?.image_urls?.[1] : product?.image_urls?.[0] || emptyImage}
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
        </section>
    );
}
