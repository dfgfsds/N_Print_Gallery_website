import { postCartitemApi } from '@/api-endpoints/CartsApi';
import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
import LoginModal from '@/app/LoginModal/page';
import { useCurrency } from '@/context/CurrencyContext';
import { useVendor } from '@/context/VendorContext';
// import LoginModal from '@/pages/LoginModal/page';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingCart, Eye, Check, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyImage from '../../public/images/emptyImage.png';
interface ProductCardProps {
    image: string;
    title: string;
    price: string;
    onAddToCart?: () => void;
    onView?: any;
    onWishlist?: () => void;
    hoverImage?: string;
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
    image,
    title,
    price,
    onAddToCart,
    onView,
    onWishlist,
    hoverImage,
    product
}) => {
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [signInmodal, setSignInModal] = useState<boolean>(false);
    const { vendorId } = useVendor();
    const queryClient = useQueryClient();
    const { convertPrice } = useCurrency();
    // const router = useRouter();


    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedCartId = localStorage.getItem('cartId');
        const storedUserName = localStorage.getItem('userName');

        setUserId(storedUserId);
        setCartId(storedCartId);
        setUserName(storedUserName);
    }, []);

    const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: getCartId,
            product: id,
            user: getUserId,
            vendor: vendorId,
            // quantity: qty,
            quantity: product?.min_purchase_quantity ? product?.min_purchase_quantity : 0,
            created_by: getUserName ? getUserName : 'user'
        }
        try {
            const response = await postCartitemApi(``, payload)
            if (response) {
                toast.success('Product added in cart!')
                queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
            }
        } catch (error) {

        }
    }
    // postWishListApi
    const handleWishList = async () => {
        try {
            const updateAPi = await postWishListApi('',
                {
                    user: getUserId,
                    product: product?.id,
                    vendor: vendorId,
                    created_by: vendorId ? `user${vendorId}` : 'user'
                }
            )
            if (updateAPi) {
                toast.success('Product added in whishlist!')
                queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
            }
        } catch (error) {
            // console.log(error)
        }
    }
    // deleteWishListApi
    const handleDeleteWishList = async () => {
        try {
            const updateAPi = await deleteWishListApi(`${product?.wishListId}`,
                {
                    deleted_by: vendorId ? `user${vendorId}` : 'user'
                }
            )
            if (updateAPi) {
                toast.success('Product removed in whishlist!')
                queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
            }
        } catch (error) {

        }
    }

    // Calculate discount percentage where discount = MRP and price = selling price
    const getDiscountPercentage = () => {
        if (!product?.discount || !product?.price) return null;

        const mrp = Number(product.discount); // MRP (higher price)
        const sellingPrice = Number(product.price); // Selling price (lower price)

        if (mrp <= sellingPrice) return null; // No badge if no discount

        const percentage = Math.round(((mrp - sellingPrice) / mrp) * 100);
        return percentage > 0 ? `${percentage}% OFF` : null;
    };


    const discountBadge = getDiscountPercentage();
    const randomRating = (4.5 + Math.random() * 0.5).toFixed(1);

    return (
        <>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg relative group transition duration-300 ease-in-out hover:shadow-lg"
                onClick={() => onView()}
            >
                {/* Image Container */}
                <div className="relative w-full aspect-[5/5] flex items-center justify-center bg-white">
                    {discountBadge && (
                        <span className="absolute z-10 top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                            {discountBadge}
                        </span>
                    )}

                    <div className="relative w-full h-full overflow-hidden">
                    {/* <div className="relative w-[800px] h-[800px] max-w-full overflow-hidden rounded-md"> */}

                        {/* Base Image */}
                        {image && (
                            <Image
                                src={image ? image : EmptyImage}
                                alt={title}
                                width={300}
                                height={300}
                                className="object-cover w-full h-full transition-opacity duration-500 md:group-hover:opacity-0 rounded-md"
                            />
                        )}

                        {/* {image && (
                            <Image
                                src={image ? image : EmptyImage}
                                alt={title}
                                width={800}
                                height={800}
                                className="object-cover w-full h-full transition-opacity duration-500 md:group-hover:opacity-0"
                            />
                        )} */}


                        {/* Hover Image */}
                        {hoverImage && (
                            <Image
                                src={hoverImage ? hoverImage : EmptyImage}
                                alt={`${title} - hover`}
                                width={300}
                                height={400}
                                className="object-cover w-full h-full absolute top-0 left-0 transform translate-x-full md:group-hover:translate-x-0 transition-transform duration-500 ease-in-out rounded-md"
                            />
                        )}

                        {/* {hoverImage && (
                            <Image
                                src={hoverImage ? hoverImage : EmptyImage}
                                alt={`${title} - hover`}
                                width={800}
                                height={800}
                                className="object-cover w-full h-full absolute top-0 left-0 transform translate-x-full md:group-hover:translate-x-0 transition-transform duration-500 ease-in-out"
                            />
                        )} */}

                    </div>


                    {/* <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">

                        {product?.cartId ? (
                            <button className="w-10 h-10 md:w-12 md:h-12 bg-green-400 text-white rounded-full flex items-center justify-center shadow hover:bg-green-600 transition">
                                <Check size={20} />
                            </button>
                        ) : (
                            <button className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-[#4db49c] hover:text-white transition">
                                <ShoppingCart size={20} />
                            </button>
                        )}

      
                        <button
                            onClick={onView}
                            className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-[#4db49c] hover:text-white transition"
                        >
                            <Eye size={20} />
                        </button>

                  
                    {product?.isLike === true ? (
                        <button
                            onClick={handleDeleteWishList}
                            className="absolute bottom-1.5 right-4 md:right-1/2 md:opacity-0 md:group-hover:opacity-100 opacity-100 md:group-hover:translate-x-20 md:translate-x-0 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-[#991b1b] hover:text-white transition-all duration-500 z-10"
                        >
                            <Heart size={20} />
                        </button>
                    ) : (
                        <button
                     
                            onClick={handleWishList}
                            className="absolute bottom-1.5 right-4 md:right-1/2 md:opacity-0 md:group-hover:opacity-100 opacity-100 md:group-hover:translate-x-20 md:translate-x-0 w-10 h-10 md:w-12 md:h-12 bg-gray-200  border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-[#991b1b] hover:text-white transition-all duration-500 z-10"
                        >
                            <Heart size={20} />
                        </button>
                    )}
                    
                    </div> */}
                    {product?.cartId ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (getUserId) {
                                    handleAddCart(product.id, 1);
                                } else {
                                    setSignInModal(true);
                                }
                            }}
                            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-green-400  text-white rounded-full flex items-center justify-center shadow hover:bg-[#4db49c] hover:text-white transition z-10 "
                        >
                            <Check size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (getUserId) {
                                    handleAddCart(product.id, 1);
                                } else {
                                    setSignInModal(true);
                                }
                            }}
                            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-[#4db49c] hover:text-white transition z-10 "
                        >
                            <ShoppingCart size={20} />
                        </button>
                    )}


                    {/* Eye Icon - Hover from Center to Left */}

                    <button
                        onClick={onView}
                        className="absolute bottom-1.5 left-1/2 md:opacity-0 md:group-hover:opacity-100 opacity-100 -translate-x-16 md:group-hover:-translate-x-20 md:translate-x-0 w-10 md:w-12 h-10 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-[#4db49c] hover:text-white transition-all duration-500 z-10"
                    >
                        <Eye size={20} />
                    </button>

                    {/* Heart Icon - Hover from Center to Right */}
                    {product?.isLike === true ? (
                        <button
                            onClick={handleDeleteWishList}
                            className="absolute bottom-1.5 right-4 md:right-1/2 md:opacity-0 md:group-hover:opacity-100 opacity-100 md:group-hover:translate-x-20 md:translate-x-0 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-10"
                        >
                            <Heart size={20} />
                        </button>
                    ) : (
                        <button
                            // onClick={onWishlist}
                            onClick={handleWishList}
                            className="absolute bottom-1.5 right-4 md:right-1/2 md:opacity-0 md:group-hover:opacity-100 opacity-100 md:group-hover:translate-x-20 md:translate-x-0 w-10 h-10 md:w-12 md:h-12 bg-gray-200  border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-10"
                        >
                            <Heart size={20} />
                        </button>
                    )}
                </div>

                {/* Product Info */}
                <div className="text-center px-6 py-6">
                    <h3 className="text-gray-800 font-bold text-sm line-clamp-1 text-left capitalize">{title}</h3>
                    <div className='flex justify-between'>
                        <p className="text-[#13cea1] font-bold mt-1">{convertPrice(Number(price))}</p>
                        {/* <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-semibold text-gray-700">{randomRating}</span>
                        </div> */}
                    </div>
                </div>


            </div>
            {signInmodal && (
                <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
            )}
        </>
    );
};

export default ProductCard;
