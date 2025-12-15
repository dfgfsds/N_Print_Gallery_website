"use client";

import { useCategories } from "@/context/CategoriesContext";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useWishList } from "@/context/WishListContext";
import { useCartItem } from "@/context/CartItemContext";
import { useProducts } from "@/context/ProductsContext";
import EmptyImage from '../../../../public/images/emptyImage.png';
import ProductCard from "@/components/ProductCard";
import { slugConvert } from "../../../../lib/utils";

export default function SubCategory() {
    const { categories } = useCategories();
    const { id } = useParams() ?? {};
    const router = useRouter();
    const { wishList, wishListLoading }: any = useWishList();
    const { cartItem }: any = useCartItem();
    const { products, isAuthenticated, isLoading }: any = useProducts();
    const emptyImage = EmptyImage;

    const data =
        categories?.data?.find((cat: any) => cat.slug_name === id) || null;

    const filteredProducts = Array.isArray(products?.data?.products) ? products?.data?.products : [];
    const matchingProductsArray = filteredProducts?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.cart?.items?.find(
            (item: any) => item?.product?.id === product?.id
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

    console.log(products, filteredProducts)

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

    const categoryProducts = Array.isArray(finalProductData)
        ? finalProductData.filter((item: any) =>
            item?.category === data?.id) : [];

    if (!data) {
        return (
            <div className="w-full py-20 flex justify-center items-center">
                <p className="text-gray-600 text-lg">Category not found</p>
            </div>
        );
    }

    console.log(categoryProducts)
    return (
        <section className="w-full bg-white py-10">
             <div className="flex items-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-black"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-xl md:text-2xl font-bold text-gray-500">
                            Back
                        </span>
                    </button>
                    <span className="px-2">/</span>
                    <h2 className="text-xl md:text-2xl font-bold text-[#13cea1]">{data?.name}</h2>
                </div>
                
            {/* <div className="text-center my-2">
                <h2 className="text-2xl text-gray-700 font-bold">{data?.name}</h2>
                <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
            </div> */}
            <div className=" mx-auto px-4">
                {/* Header */}
               


                {/* {data?.subcategories?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.subcategories.map((sub: any) => (
                            <div
                                key={sub.id}
                                onClick={() => router.push(`/category/${id}/${sub.slug_name}`)}
                                className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition"
                            >
                           
                                <img
                                    src={sub?.image}
                                    alt={sub?.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                              
                                <div className="absolute bottom-0 w-full bg-black/50 py-2 text-center">
                                    <span className="block text-white text-sm md:text-base font-semibold">
                                        {sub?.name}
                                    </span>
                                    {sub?.starting_price && (
                                        <span className="block text-white text-xs md:text-sm font-medium">
                                            Starts from ₹{sub?.starting_price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No subcategories found.</p>
                )} */}

                <div className="mx-auto px-4">


                    {/* 💙 Subcategories Below (If Available) */}
                    {data?.subcategories?.length > 0 && (
                        <div>
                            <div className="text-center my-6">
                                <h2 className="text-2xl text-gray-700 font-bold">{data?.name}</h2>
                                <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {data.subcategories.map((sub: any) => (
                                    <div
                                        key={sub.id}
                                        onClick={() => router.push(`/category/${id}/${sub.slug_name}`)}
                                        className="relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition"
                                    >

                                        <img
                                            src={sub?.image}
                                            alt={sub?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />


                                        <div className="absolute bottom-0 w-full bg-black/50 py-2 text-center">
                                            <span className="block text-white text-sm md:text-base font-semibold">
                                                {sub?.name}
                                            </span>
                                            {sub?.starting_price && (
                                                <span className="block text-white text-xs md:text-sm font-medium">
                                                    Starts from ₹{sub?.starting_price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* 💚 Category Products First (If Available) */}
                    {categoryProducts?.length > 0 && (
                        <div className="mt-12">
                            <div className="text-center my-4">
                                <h2 className="text-2xl text-gray-700 font-bold">Products in {data?.name}</h2>
                                <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* {categoryProducts.map((product: any, idx: number) => ( */}
                                {categoryProducts
                                    .filter((product: any) => !product?.subcategory || product?.subcategory === "") // ⛔ subcategory iruntha skip
                                    .map((product: any, idx: number) => (
                                        <ProductCard
                                            key={idx}
                                            image={product?.image_urls?.[0] || emptyImage}
                                            hoverImage={product?.image_urls?.[1] || product?.image_urls?.[0] || emptyImage}
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
                    )}

                    {/* 🔴 No Products & No Subcategories */}
                    {categoryProducts?.length === 0 && !data?.subcategories?.length && (
                        <p className="text-gray-600 text-center py-16 text-lg">No products found in this category.</p>
                    )}

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
                        ?.slice(0, 8)
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
