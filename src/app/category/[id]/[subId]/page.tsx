"use client";
import { useProducts } from "@/context/ProductsContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { slugConvert } from "../../../../../lib/utils";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import EmptyImage from "../../../../../public/images/emptyImage.png";
import { useCartItem } from "@/context/CartItemContext";
import { useWishList } from "@/context/WishListContext";

export default function SubCategoryProducts() {
    const { subId } = useParams() as { subId: string };
    const router = useRouter();
    const { products } = useProducts();
    const emptyImage = EmptyImage;
    const { wishList, wishListLoading }: any = useWishList();
    const { cartItem }: any = useCartItem();

const findSubCategoryProduct = products?.data?.products?.filter(
  (item: any) => item?.subcategory_name?.toLowerCase() === subId?.toLowerCase()
);


    const filteredProducts = Array.isArray(findSubCategoryProduct) ? findSubCategoryProduct : [];
    const matchingProductsArray = filteredProducts?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.cart?.items?.find(
            (item: any) => item?.product === product?.id
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

    const data =
        products?.data?.products?.filter(
            (prod: any) => prod?.subcategory === Number(subId)
        ) || [];
    return (
        <section className="w-full bg-white py-10">
            <div className="text-center my-2">
                <h2 className="text-2xl text-gray-700 font-bold">{data[0]?.subcategory_name || 'Products'}</h2>
                <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
            </div>
            <div className=" mx-auto px-4">
                <div className="flex items-center mb-6">

                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-black"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-xl md:text-2xl font-bold text-gray-500">Back</span>
                    </button>

                    <span className="px-2">/</span>

                    <h2 className="text-xl md:text-2xl font-bold text-[#13cea1]">{data[0]?.subcategory_name || 'Products'}</h2>
                </div>



                {finalProductData?.length > 0 ? (
                    <div className=" mx-auto px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {finalProductData?.map((product: any, i: number) => (
                                <ProductCard
                                    key={i}
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
                ) : (
                    <p className="text-gray-600 text-center font-bold">No products found in this subcategory.</p>
                )}
            </div>

               <div className="w-full pt-12 mb-5 mx-auto px-4">
                {/* Header style different ah */}
                <div className="text-center my-4">
                    <h2 className="text-2xl text-gray-700 font-bold">Featured Products</h2>
                    <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products?.data?.products
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
