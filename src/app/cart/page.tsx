"use client";

import { ShoppingBag, ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
// import CartItem from '@/components/cart/CartItem';
// import CartSummary from '@/components/cart/CartSummary';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useQuery } from '@tanstack/react-query';
import { getSizesApi, getVariantsProductApi } from '@/api-endpoints/products';

export default function CartPage() {

    const { cartItem }: any = useCartItem();
    const { products }: any = useProducts();


    const VariantData: any = useQuery({
        queryKey: ['VariantData'],
        queryFn: () => getVariantsProductApi(``),
    });

    const sizesData: any = useQuery({
        queryKey: ['getSizesData'],
        queryFn: () => getSizesApi(``),
    });

    const matchingProductsArray = cartItem?.data?.cart?.items?.map((item: any, index: number) => {
        const matchingProduct = products?.data?.products?.find((product: any) => product.id === item.product?.id);
        const matchingVariant = VariantData?.data?.data?.message?.find((variant: any) => variant.id === item.product_variant);
        const matchingSize = sizesData?.data?.data?.message?.find((size: any) => size.id === item.product_size);

        return {
            Aid: index,
            cartId: item?.id,
            optionPrice:item?.item_total,
            cartQty: item?.quantity,
            uploadImages: item?.cart_item_images.find(
                (img: any) => img.cart_item === item?.id),
            ...matchingProduct,
            ...matchingVariant,
            ...matchingSize,
        };
    });

    const totalAmount = matchingProductsArray?.reduce((acc: number, item: any) => {
        const price =
            item.price ??
            item?.product_variant_price ??
            item?.product_size_price ??
            0;
        return acc + price * (item.cartQty || 1);
    }, 0);

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
                {matchingProductsArray?.length === 0 ? (
                    // <div className="flex flex-col items-center justify-center h-64">
                    //   <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
                    //   <p className="text-gray-600">Your cart is empty</p>
                    //   <Link href="/products" className="mt-4 text-[#4D8B31] hover:underline flex">
                    //     Start Shopping 
                    //     <ArrowRight className="ml-2 h-4 w-4 my-auto" />

                    //   </Link>
                    // </div>

                    <div className="flex flex-col items-center justify-center h-max  text-gray-800 animate-fadeIn">
                        <div className="text-6xl text-gray-400 animate-float">
                            <ShoppingBag className="h-16 w-16 text-[#4db49c] mb-4" />
                        </div>
                        <h1 className="text-3xl font-bold mt-0 animate-slideInUp">
                            Your cart is empty.
                        </h1>
                        <p className="mt-2 text-gray-600 font-bold animate-fadeIn delay-200">

                            Start Shopping
                        </p>
                        <Link href="/shop">
                            <button
                                className="mt-8 px-6 py-3 font-bold bg-[#4db49c] text-white rounded-full shadow-md hover:bg-[#75c6b3] transform transition hover:scale-105 animate-bounce"
                            >
                                Return To Shop
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className=" rounded-xl overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold">Cart Items {cartItem?.length}</h2>
                                        <Link href="/shop" className="text-[#13cea1] font-bold hover:underline text-sm flex items-center">
                                            Continue Shopping
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>

                                    <div className="space-y-6">
                                        {[...matchingProductsArray || []]
                                            ?.map((item: any) => ({
                                                ...item,
                                                sortName: (item?.name || "").toLowerCase(),
                                            }))
                                            ?.sort((a: any, b: any) => a?.sortName?.localeCompare(b?.sortName))
                                            ?.map((product: any, index: any) => (
                                                <CartItem key={index} product={product} quantity={index + 1} />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <CartSummary totalAmount={cartItem?.data?.cart?.total_cart_price} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}