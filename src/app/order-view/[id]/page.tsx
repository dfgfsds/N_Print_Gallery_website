'use client';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, X } from "lucide-react";
import { useParams } from 'next/navigation';
import { getOrderItemApi } from "@/api-endpoints/CartsApi";
// import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import { useEffect, useRef, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";
import Link from "next/link";
import { set } from "react-hook-form";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import { useUserReviews } from "@/context/ReviewsUserContext";
import { formatDate } from "../../../../lib/utils";

function OrderSingleView() {
    const params = useParams();
    const id = params?.id;
    const { convertPrice } = useCurrency();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { vendorId } = useVendor();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

    const handleClick = (index: number, isHalf: boolean) => {
        setRating(isHalf ? index - 0.5 : index);
    };

    const handleHover = (index: number, isHalf: boolean) => {
        setHover(isHalf ? index - 0.5 : index);
    };

    const handleLeave = () => {
        setHover(0);
    };

    const { ReviewItem } = useUserReviews();



    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId);
    }, []);

    const { data }: any = useQuery({
        queryKey: ['getOrderSingle', vendorId],
        queryFn: () => getOrderItemApi(`?user_id=${Number(localStorage.getItem('userId') || userId)}&vendor_id=${vendorId}&order_id=${id}`)
    });

    // Image Upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(files);

            // create previews
            const previews = files.map((file) => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    };

    // Video Upload
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setVideos(files);

            // create previews
            const previews = files.map((file) => URL.createObjectURL(file));
            setVideoPreviews(previews);
        }
    };
    // const getReviewByProductId = async (productId: number) => {
    //     try {
    //         const res = await axios.get(`${baseUrl}/reviews/?product_id=${productId}&user=${userId}`);
    //         return res.data;
    //     } catch (error) {
    //         console.log("Error fetching review by product ID:", error);
    //     }
    // }

    // useEffect(() => {
    //     getReviewByProductId();
    // }, [])

    const handleSubmitReview = async () => {
        if (!selectedProductId) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("product_id", String(selectedProductId));
        formData.append("user", String(userId));
        formData.append("vendor", String(vendorId));
        formData.append("created_by", String(userId));
        formData.append("rating", String(rating));
        formData.append("comment", comment);

        // Append images
        images.forEach((file) => {
            formData.append("image_files", file);
        });

        // Append videos
        videos.forEach((file) => {
            formData.append("video_files", file);
        });

        try {
            const res = await axios.post(`${baseUrl}/reviews/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // ✅ Invalidate query so GET runs again automatically
            queryClient.invalidateQueries({ queryKey: ["getReviewData", userId] });
            // Reset
            setSelectedProductId(null);
            setRating(0);
            setComment("");
            setImages([]);
            setVideos([]);
            setIsModalOpen(false);

            if (imageInputRef.current) imageInputRef.current.value = "";
            if (videoInputRef.current) videoInputRef.current.value = "";
        } catch (error) {
            console.error("Review submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    function slugConvert(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');     // Remove non-word characters except hyphens
    }

    return (
        <>

            <div className="container mx-auto px-4 max-w-7xl mt-10">
                <button
                    onClick={() => {
                        router.back();
                    }}
                    className="cursor-pointer pl-5 flex items-center text-lg font-bold gap-2 text-gray-600 hover:text-gray-900 "
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                </button>


                <div className="bg-white rounded-xl shadow-lg p-5 space-y-10">
                    {/* Header */}
                    {/* <div className="border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                </div> */}

                    {/* Two Column Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 text-sm text-gray-700">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold mb-1 text-gray-800">Order Details</h3>

                            <p><span className="font-semibold">Order ID:</span> #{data?.data?.id}</p>
                            <p><span className="font-semibold">Order Date:</span> {formatDate(data?.data?.created_at)}</p>
                            <p className="flex items-center gap-2">
                                <span className="font-semibold">Status:</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold ${data?.data?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    data?.data?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        data?.data?.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                                            data?.data?.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                                                data?.data?.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                                                    data?.data?.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-[#a5291b]'
                                    }`}>
                                    {data?.data?.status}
                                </span>
                            </p>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold mb-1 text-gray-800">Order Amount</h3>

                            {parseFloat(data?.data?.total_amount) > 0 && (
                                <p><span className="font-semibold">Total Amount:</span> {convertPrice(Number(data?.data?.total_amount))}</p>
                            )}

                            {parseFloat(data?.data?.discount) > 0 && (
                                <p><span className="font-semibold">Discount:</span> {convertPrice(Number(data?.data?.discount))}</p>
                            )}

                            {parseFloat(data?.data?.delivery_charge) > 0 && (
                                <p><span className="font-semibold">Delivery Charge:</span> {convertPrice(Number(data?.data?.delivery_charge))}</p>
                            )}

                            {parseFloat(data?.data?.cod_charges) > 0 && (
                                <p><span className="font-semibold">COD Charges:</span> {convertPrice(Number(data?.data?.cod_charges))}</p>
                            )}

                            {parseFloat(data?.data?.delivery_discount) > 0 && (
                                <p><span className="font-semibold">Delivery Discount:</span> {convertPrice(Number(data?.data?.delivery_discount))}</p>
                            )}
                            <p className="flex items-center gap-2">
                                <span className="font-semibold">Payment Status:</span>
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm uppercase">
                                    {data?.data?.payment_status}
                                </span>
                            </p>

                        </div>
                        {/* Shipping Address */}
                        <div className="text-sm">
                            <h3 className="text-lg font-bold mb-1 text-gray-800">Shipping Address</h3>
                            <p className="text-gray-600 leading-6">
                                {data?.data?.consumer_address?.address_type?.toUpperCase()}, {data?.data?.consumer_address?.address_line1}, {data?.data?.consumer_address?.address_line2},<br />
                                {data?.data?.consumer_address?.city}, {data?.data?.consumer_address?.state} - {data?.data?.consumer_address?.postal_code},<br />
                                {data?.data?.consumer_address?.country}<br />
                                <span className="text-gray-500">Landmark: {data?.data?.consumer_address?.landmark}</span>
                            </p>
                        </div>

                    </div>


                    {/* Order Items */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Items in Order</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {data?.data?.order_items?.map((item: any) => {
                                // filter reviews for this product
                                const matchedReviews = ReviewItem?.data?.reviews?.filter(
                                    (review: any) => review.product_id === item?.product?.id
                                );

                                return (
                                    <div key={item.id} className="mb-6">
                                        {/* Product Card */}
                                        <div className="flex gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                            <Image
                                                src={item?.product?.image_urls?.[0]}
                                                className="h-24 w-24 object-cover rounded-lg border"
                                                alt="product"
                                                width={100}
                                                height={100}
                                            />
                                            <div className="flex flex-col justify-between w-full">
                                                <div>
                                                    <h4
                                                        onClick={() =>
                                                            router.push(`/shop/${slugConvert(item?.product?.name)}`)
                                                        }
                                                        className="text-lg font-semibold text-gray-900 mb-1"
                                                    >
                                                        {item?.product?.name}
                                                    </h4>

                                                    {/* 🔹 Show Options if available */}
                                                    {item?.options && Object.keys(item?.options)?.length > 0 && (
                                                        <div className="text-sm text-gray-700 mb-2">
                                                            {Object?.entries(item?.options).map(([key, value]: any, idx) => (
                                                                <p key={idx} className="font-medium capitalize">
                                                                    {key}: <span className="text-gray-900 font-semibold">{value}</span>
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p className="font-bold">
                                                            Qty:{" "}
                                                            <span className="text-gray-800 font-medium">
                                                                {item?.quantity}
                                                            </span>
                                                        </p>
                                                        <p className="font-bold">
                                                            Price:{" "}
                                                            <span className="text-gray-800 font-medium">
                                                                {convertPrice(Number(item?.price))}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Show Review Actions only if delivered */}
                                        {data?.data?.status === "Delivered" && (
                                            matchedReviews?.length > 0 ? (
                                                <div className="mt-4 space-y-3">
                                                    <h5 className="font-semibold text-gray-800">Your Review:</h5>
                                                    {matchedReviews?.map((review: any) => (
                                                        <div
                                                            key={review.id}
                                                            className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                                                        >
                                                            <p className="text-yellow-500 font-bold">
                                                                ⭐ {review.rating}/5
                                                            </p>
                                                            <p className="text-gray-700">{review.comment}</p>
                                                            <div className="flex gap-3">
                                                                {review?.image_urls?.length > 0 && (
                                                                    <div className="flex gap-2 mt-2">
                                                                        {review.image_urls.map((img: string, idx: number) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={img}
                                                                                alt="review"
                                                                                className="w-16 h-16 object-cover rounded border"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {review?.video_urls?.length > 0 && (
                                                                    <div className="flex gap-2 mt-2">
                                                                        {review.video_urls.map((video: string, idx: number) => (
                                                                            <video
                                                                                key={idx}
                                                                                src={video}
                                                                                controls
                                                                                className="w-16 h-16 rounded border object-cover"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="mt-3 flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProductId(item?.product?.id);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                                                    >
                                                        Rate & Review
                                                    </button>
                                                </div>
                                            )

                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[80vh]">
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-4">Rate Your Review</h2>

                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="relative w-8 h-8 cursor-pointer">
                                    {/* Left Half */}
                                    <div
                                        className="absolute left-0 top-0 w-1/2 h-full z-10"
                                        onMouseEnter={() => handleHover(star, true)}
                                        onMouseLeave={handleLeave}
                                        onClick={() => handleClick(star, true)}
                                    />
                                    {/* Right Half */}
                                    <div
                                        className="absolute right-0 top-0 w-1/2 h-full z-10"
                                        onMouseEnter={() => handleHover(star, false)}
                                        onMouseLeave={handleLeave}
                                        onClick={() => handleClick(star, false)}
                                    />
                                    {/* Star Display */}
                                    <svg
                                        className="w-8 h-8 text-yellow-400"
                                        fill={
                                            (hover || rating) >= star
                                                ? "currentColor"
                                                : (hover || rating) >= star - 0.5
                                                    ? "url(#half)"
                                                    : "none"
                                        }
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <defs>
                                            <linearGradient id="half">
                                                <stop offset="50%" stopColor="currentColor" />
                                                <stop offset="50%" stopColor="transparent" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1
                1 0 00.95.69h4.915c.969 0 1.371
                1.24.588 1.81l-3.977 2.89a1 1
                0 00-.364 1.118l1.518
                4.674c.3.921-.755 1.688-1.54
                1.118l-3.977-2.89a1 1
                0 00-1.175 0l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1
                1 0 00-.364-1.118l-3.977-2.89c-.783-.57-.38-1.81.588-1.81h4.915a1
                1 0 00.95-.69l1.518-4.674z"
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* Comment Box */}
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            className="w-full border rounded-lg p-3 mb-4 focus:ring focus:ring-blue-300 mt-4"
                        />
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Upload Images</label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg shadow flex items-center gap-2"
                                >
                                    📷 Choose Images
                                </button>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Image Previews */}
                            <div className="flex gap-2 flex-wrap mt-3">
                                {imagePreviews.map((url, idx) => (
                                    <img
                                        key={idx}
                                        src={url}
                                        alt={`preview-${idx}`}
                                        className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Video Upload */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Upload Videos</label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow flex items-center gap-2"
                                >
                                    🎥 Choose Videos
                                </button>
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Video Previews */}
                            <div className="flex gap-2 flex-wrap mt-3">
                                {videoPreviews.map((url, idx) => (
                                    <video
                                        key={idx}
                                        src={url}
                                        controls
                                        className="w-40 h-24 rounded-lg border shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitReview}
                            className="w-full bg-[#a5291b] hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default OrderSingleView;