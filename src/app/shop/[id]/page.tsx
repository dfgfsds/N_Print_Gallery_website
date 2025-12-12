"use client"
import ProductCard from "@/components/ProductCard";
import { useCartItem } from "@/context/CartItemContext";
import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useWishList } from "@/context/WishListContext";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import EmptyImage from '../../../../public/images/emptyImage.png'
export default function CategoryProduct() {
    const { products, isAuthenticated, isLoading }: any = useProducts();
    const { cartItem }: any = useCartItem();
    const { wishList, wishListLoading }: any = useWishList();
    const router = useRouter();
    const params = useParams<any>();
    const { categories } = useCategories();
    const emptyImage = EmptyImage;

    const data =
        categories?.data?.find((cat: any) => cat.slug_name === params?.id) || null;

    const findProducts = products?.data?.products?.filter((item: any) =>
        item?.category === data?.id
    );


    const findCategory = categories?.data?.find(
        (cat: any) => cat?.slug_name === params?.id
    );

    const filteredProducts = Array.isArray(findProducts) ? findProducts : [];
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

    function slugConvert(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
    }


    return (
        <>
            <div className="mx-auto px-4 py-6">
                <div className="flex flex-wrap items-center gap-2 py-3">
                    <div className="hover:text-gray-600 cursor-pointer text-gray-400 font-medium "
                        onClick={() => {
                            router.push('/');
                        }}
                    >
                        Home
                    </div>/
                    <div className="text-gray-400 font-medium hover:text-[#4db49c] cursor-pointer"
                        onClick={() => {
                            router.back();
                        }}
                    >
                        All Products
                    </div>/
                    <div className="text-[#13cea1] font-medium">
                        {findCategory?.name}
                    </div>
                </div>
                
                 <div className="text-center my-2">
                    <h2 className="text-2xl text-gray-700 font-bold"> {findCategory?.name}</h2>
                    <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                </div>
                {/* Product Grid */}
                {finalProductData?.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6" >
                        {finalProductData?.map((product, idx) => (
                            <div
                                key={idx}
                                className=""
                                onClick={() => router.push(`/products/${slugConvert(product?.name)}`)}
                            >
                                <ProductCard
                                    image={product?.image_urls[0] || emptyImage}
                                    hoverImage={product?.image_urls?.[1] ? product?.image_urls?.[1] : product?.image_urls?.[0] || emptyImage}
                                    title={product?.name}
                                    price={product?.price}
                                    onAddToCart={() => alert(`Add to cart: ${product?.name}`)}
                                    onView={() => router.push(`/products/${slugConvert(product?.slug_name)}`)}
                                    onWishlist={() => alert(`Wishlist: ${product?.name}`)}
                                    product={product}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mb-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 13h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v13a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold">No Products Found</h3>
                        <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                    </div>
                )}

                {/* <div className="w-full py-8">
                    <h4 className="text-lg text-center font-bold mb-2 text-gray-600">
                        Featured Products
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                        {products?.data
                            ?.filter((product: any) => product?.is_featured === true) // 🔹 Only featured products
                            ?.slice(0, 4) // show only 2
                            ?.map((product: any, idx: number) => (
                                <ProductCard
                                    key={idx}
                                    image={product?.image_urls?.[0] || ""}
                                    hoverImage={product?.image_urls?.[1] || ""}
                                    title={product?.name}
                                    price={product?.price}
                                    onAddToCart={() => alert(`Add to cart: ${product?.name}`)}
                                    onView={() => router.push(`/products/${slugConvert(product?.name)}`)}
                                    onWishlist={() => alert(`Wishlist: ${product?.name}`)}
                                    product={product}
                                />
                            ))}
                    </div>

                </div> */}


                <div className="w-full pt-12 mb-5">
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


            </div>
        </>
    )
}