"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProducts } from "./../../../context/ProductsContext";
import { slugConvert } from "../../../../lib/utils";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, ShoppingBasket, ShoppingCartIcon, X } from "lucide-react";
import { deleteCartitemsApi, postCartitemApi, updateCartitemApi, updateCartitemsApi } from "@/api-endpoints/CartsApi";
import { InvalidateQueryFilters, useQuery, useQueryClient } from "@tanstack/react-query";
import { useVendor } from "@/context/VendorContext";
import LoginModal from "@/app/LoginModal/page";
import { useCartItem } from "@/context/CartItemContext";
import axios from "axios";
import ApiUrls, { baseUrl } from "@/api-endpoints/ApiUrls";
import toast from "react-hot-toast";
import { deleteWishListApi, getProductWithOptionsApi, getProductWithVariantSizeApi, postWishListApi } from "@/api-endpoints/products";
import ProductCard from "@/components/ProductCard";
import EmptyImage from '../../../../public/images/emptyImage.png';
import { useWishList } from "@/context/WishListContext";


export default function ProductPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [signInmodal, setSignInModal] = useState(false);
  const [cartData, setCartData] = useState<any>(null);
  const touchStartX = useRef<number | null>(null);
  const params = useParams();
  const { products }: any = useProducts();
  const queryClient = useQueryClient();
  const { vendorId } = useVendor();
  const { cartItem }: any = useCartItem();
  const [product, setProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const router = useRouter();
  const emptyImage = EmptyImage;
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const { wishList, wishListLoading }: any = useWishList();

  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: any }>({});
  const [selectedPrice, setSelectedPrice] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<any | null>(0);
  const [prevQuantity, setPrevQuantity] = useState<any | null>(null);


  const handleSelectOption = (optionId: number, value: any) => {
    setSelectedOptions((prev) => {
      if (!value) {
        const updated = { ...prev };
        delete updated[optionId];
        return updated;
      }

      return {
        ...prev,
        [optionId]: value,
      };
    });

    setCartData(null);
  };


  const isAllOptionsSelected = () => {
    const options = productData?.data?.data?.product?.options;

    // 🔹 If product has options → all must be selected
    if (options?.length > 0) {
      const totalOptions = options.length;
      const selectedCount = Object.keys(selectedOptions).length;

      if (selectedCount !== totalOptions) return false;
    }

    // 🔹 Quantity must be selected
    if (!quantity || quantity === "") return false;

    return true;
  };


  const isSameOptionsSelected = () => {
    if (!cartData?.options) return false;

    return Object.entries(selectedOptions).every(
      ([optId, optValue]: any) =>
        cartData?.options[optId]?.id === optValue?.id
    );
  };


  const isUploadDisabled =
    cartData &&
    isSameOptionsSelected() &&
    cartData?.images?.length > 0;

  useEffect(() => {
    if (cartData?.options?.length && Object.keys(selectedOptions)?.length === 0) {
      setSelectedOptions(
        Object.entries(cartData?.options).reduce((acc: any, [id, value]) => {
          acc[id] = { id: value };
          return acc;
        }, {})
      );
    }
  }, [cartData, selectedOptions]);


  const productData: any = useQuery({
    queryKey: ['productWithOptionsData', product?.id],
    queryFn: () => getProductWithOptionsApi(`${product?.id}`),
    enabled: !!product?.id
  });


  useEffect(() => {
    if (products?.data && params?.slug) {
      const found = products?.data?.products?.find((p: any) => slugConvert(p?.slug_name) === params?.slug);
      if (found) {
        setProduct(found);
      } else {
      }
    }
  }, [products, params.slug]);

  useEffect(() => {
    if (productData?.data?.data && !selectedVariant) {
      setSelectedVariant(productData?.data?.data?.product);
    }
  }, [productData, selectedVariant]);

  useEffect(() => {
    if (cartItem?.data) {
      const cartMatch = cartItem?.data?.cart?.items?.find((item: any) => {
        const matchesBase =
          item?.product?.id === product?.id ||
          item?.product_variant === selectedVariant?.id ||
          item?.product_size === selectedSize?.id;

        // 🔥 Match all selected options perfectly
        const matchesOptions = Object.entries(selectedOptions).every(
          ([optId, optValue]: any) =>
            item?.options?.[optId]?.id === optValue?.id
        );

        return matchesBase && matchesOptions;
      });

      if (cartMatch) {
        setCartData({
          cartId: cartMatch.id,
          quantity: cartMatch.quantity,
          options: cartMatch.options,
          images: cartMatch?.cart_item_images || [],
          cartItemId: cartMatch?.id,
        });
      } else {
        setCartData(null); // 🔥 Reset if no exact match
      }
    }
  }, [cartItem, selectedVariant, selectedSize, selectedOptions]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');

    setUserId(storedUserId);
    setCartId(storedCartId);
  }, []);

  const getPayload = (qty: any) => ({
    cart: getCartId,
    user: getUserId,
    vendor: vendorId,
    quantity: qty,
    updated_by: "user",
    created_by: "user",
    ...(product?.id && !selectedVariant?.product_variant_title && { product: product?.id }),
    options: Object.entries(selectedOptions).reduce((acc: any, [optionId, value]: any) => {
      acc[optionId] = value?.id;
      return acc;
    }, {}),
  });

  const handleAddCart = async (qty: any) => {
    try {
      const payload = getPayload(qty);
      const response = await postCartitemApi("", payload);
      if (response) {
        if (productData?.data?.data?.is_custom_image_required !== true) {
          router.push('/cart')
        }
        toast.success("Added to cart!");
        queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
        queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };


  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1 && type === "decrease") {
        await deleteCartitemsApi(`${id}`);
        toast.success("Removed from cart");
      } else {
        const payload = getPayload(type === "increase" ? cartData.quantity + 1 : cartData.quantity - 1);
        const response = await updateCartitemApi(`${cartData.cartItemId}/`, payload);
        setQuantity(response?.data?.item?.quantity);
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
      queryClient.invalidateQueries(["getCartitemsData"] as InvalidateQueryFilters);
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };


  const handleUploadRef = async (images: File[]) => {
    try {
      if (!cartData?.cartId) {
        toast.error("Please select options and click Buy Now before uploading images");
        return;
      }
      else {
        setUploading(true);
        const formData = new FormData();
        formData.append("cart_item", cartData?.cartItemId ?? "");
        formData.append("created_by", "user");
        formData.append("updated_by", "user");
        images.forEach((file) => {
          formData.append("images", file);
        });
        const response = await axios?.post(`${baseUrl}/cart-item-images/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      }



    } catch (error) {
      toast.error("Please add item to Cart!")
    } finally {
      setUploading(false);
    }
  };

  const handleUploadError = () => {
    toast.error("Please select options and click Buy Now before uploading images");
  }

  const onRemoveImage = async (imageId: number, index: number) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/cart-item-images-delete/${imageId}/?index=${index}&media_type=image`
      );
      if (response.status === 200) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  };

  if (!products || products?.data?.length === 0) {
    return <p>Loading products...</p>;
  }

  function ProductImageGallery({ images, name }: any) {
    const [activeIndex, setActiveIndex] = useState(0);
    const emptyImage = "/no-image.png";

    const [showLens, setShowLens] = useState(false);
    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const [bgPos, setBgPos] = useState("0% 0%");

    // ⭐ Mobile Fullscreen Zoom Modal
    const [mobileZoom, setMobileZoom] = useState(false);

    const handlePrev = () => {
      setActiveIndex((prev) => (prev === 0 ? images?.length - 1 : prev - 1));
    };

    const handleNext = () => {
      setActiveIndex((prev) => (prev === images?.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
      if (images?.length > 1) {
        const timer = setInterval(handleNext, 5000);
        return () => clearInterval(timer);
      }
    }, [images?.length]);

    // ⭐ MOUSE DESKTOP ZOOM
    const handleMouseMove = (e: any) => {
      if (window.innerWidth < 768) return; // ⛔ MOBILE → dont run hover zoom

      const container = e.currentTarget.getBoundingClientRect();

      let x = e.clientX - container.left;
      let y = e.clientY - container.top;

      setLensPos({ x, y });

      let xPercent = (x / container.width) * 100;
      let yPercent = (y / container.height) * 100;

      setBgPos(`${xPercent}% ${yPercent}%`);
    };

    return (
      <>
        <div className="sticky top-0 flex flex-col items-center space-y-4">

          {/* IMAGE */}
          <div
            // className="relative w-full max-w-md h-auto"
            className="relative w-[800px] h-[800px] max-w-full bg-white rounded-xl shadow-lg overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => window.innerWidth > 768 && setShowLens(true)}
            onMouseLeave={() => window.innerWidth > 768 && setShowLens(false)}
            onClick={() => window.innerWidth < 768 && setMobileZoom(true)} // ⭐ MOBILE TAP TO ZOOM
          >
            {/* <img
              src={images[activeIndex] || emptyImage}
              alt={name}
              className="w-full h-auto object-contain rounded-xl shadow-lg"
            /> */}

            <img
              src={images[activeIndex] || emptyImage}
              alt={name}
              // className="max:w-full max:h-[1000px] object-contain rounded-xl shadow-lg"
              className="w-full h-full object-contain"
            />

            {/* DESKTOP LENS */}
            {showLens && (
              <div
                className="absolute w-32 h-32 bg-white/40 border border-gray-400 rounded-md pointer-events-none"
                style={{
                  left: lensPos.x - 64,
                  top: lensPos.y - 64,
                }}
              ></div>
            )}

            {/* DESKTOP ZOOM BOX */}
            {showLens && (
              <div
                className="absolute top-0 left-[105%] w-[450px] h-[450px] border border-gray-300 bg-white shadow-xl rounded-md hidden md:block z-9999"
                style={{
                  backgroundImage: `url(${images[activeIndex]})`,
                  backgroundSize: "200%",
                  backgroundPosition: bgPos,
                }}
              ></div>
            )}

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow"
            >
              <ChevronLeft />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`border-2 rounded-lg overflow-hidden flex-shrink-0 ${activeIndex === idx ? "border-blue-500" : "border-transparent"
                  }`}
              >
                <img
                  src={img || emptyImage}
                  alt={`${name} thumbnail ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ⭐ MOBILE FULLSCREEN ZOOM MODAL */}
        {mobileZoom && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              onClick={() => setMobileZoom(false)}
              className="absolute top-5 right-5 text-white text-3xl"
            >
              ✕
            </button>

            {/* Pinch Zoom */}
            <img
              src={images[activeIndex]}
              className="w-full h-auto max-w-full max-h-full object-contain touch-pan-y touch-pin
ch-zoom"
            />
          </div>
        )}
      </>
    );
  }



  const finalProductData = products?.data?.products?.map((item: any) => {
    const wishLists = wishList?.data?.find(
      (wish: any) => wish?.product === product?.id
    );
    return {
      ...item,
      isLike: wishLists ? true : false,
      wishListId: wishLists?.id
    };
  });

  const currentProduct = finalProductData?.find(
    (item: any) => item?.id === product?.id
  );

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

    }
  }

  // deleteWishListApi
  const handleDeleteWishList = async () => {
    try {
      const updateAPi = await deleteWishListApi(`${currentProduct?.wishListId}`,
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

  const { id }: any = useParams();
  const { getSingleProductApi } = useProducts();

  useEffect(() => {
    const fetchOptionPrice = async () => {
      if (!product?.id) return;

      let apiUrl = `${ApiUrls.getSingleProductWithOptionsPrice}?product=${product?.id}&quantity=${quantity ? quantity : productData?.data?.data?.product?.min_purchase_quantity}`;
      Object.entries(selectedOptions || {}).forEach(([optionId, value]: any) => {
        if (value?.id) {
          apiUrl += `&optionId=${optionId}&valueId=${value.id}`;
        }
      });

      try {
        const res = await axios.get(apiUrl);

        setSelectedPrice((prev: any) => {
          if (JSON.stringify(prev) !== JSON.stringify(res?.data?.data)) {
            return res?.data?.data;
          }
          return prev;
        });
      } catch (error) {
      }
    };

    fetchOptionPrice();
  }, [quantity, JSON.stringify(selectedOptions), product?.id]);


  const minQty = Number(productData?.data?.data?.product?.min_purchase_quantity ? productData?.data?.data?.product?.min_purchase_quantity : 1);
  const maxQty = Number(productData?.data?.data?.product?.max_purchase_quantity ? productData?.data?.data?.product?.max_purchase_quantity : 50);

  // const generateQuantityOptions = (minQty: number, maxQty: number) => {
  //   const options: number[] = [];

  //   // CASE 1: minQty = 1 (special UX pattern)
  //   if (minQty === 1) {
  //     const initialSteps = [1, 2, 3, 4, 5];

  //     // first small numbers
  //     initialSteps.forEach((val) => {
  //       if (val <= maxQty) options.push(val);
  //     });

  //     // after 5 → jump by 5
  //     let current = 10;
  //     while (current <= maxQty) {
  //       options.push(current);
  //       current += 5;
  //     }

  //     return options;
  //   }

  //   // CASE 2: minQty > 1 → multiply pattern
  //   let current = minQty;
  //   while (current <= maxQty) {
  //     options.push(current);
  //     current += minQty;
  //   }

  //   return options;
  // };

  const generateQuantityOptions = (minQty: number, maxQty: number) => {
    const options: number[] = [];

    // 🔹 CASE 1: Start = 1 (special UX)
    if (minQty === 1) {
      // 1 → 5
      for (let i = 1; i <= 5 && i <= maxQty; i++) {
        options.push(i);
      }

      // after 5 → +5
      let current = 10;
      while (current <= maxQty) {
        options.push(current);
        current += 5;
      }

      return options;
    }

    // 🔹 Determine step
    let step: number;

    if (minQty < 10) {
      step = minQty;        // 2 → +2, 5 → +5
    } else if (minQty < 50) {
      step = 10;            // 10,20,30...
    } else if (minQty < 100) {
      step = 50;            // 50,100,150...
    } else {
      step = 100;           // 100,200,300...
    }

    // 🔹 Generate options
    let current = minQty;
    while (current <= maxQty) {
      options.push(current);
      current += step;
    }

    return options;
  };

  const quantityOptions = generateQuantityOptions(minQty, maxQty);

  useEffect(() => {
    if (quantityOptions.length > 0) {
      setQuantity(quantityOptions[0]);
    }
  }, [quantityOptions.length]);

  const [showAllPricing, setShowAllPricing] = useState(false);

  const pricingData = selectedPrice?.quantity_pricing || [];
  const visiblePricing = showAllPricing
    ? pricingData
    : pricingData.slice(0, 5);


  return (
    <>
      {/* <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 pb-2 px-6 bg-white"> */}
      <div className="mx-auto max-w-screen-xl gap-10 w-full grid grid-cols-1 md:grid-cols-2 pt-10 pb-2 px-4 sm:px-6 md:px-8 lg:px-10 bg-white">

        <div className="relative">
          <nav className="text-xs ml-20 sm:text-base font-semibold mb-6 text-gray-800 flex flex-wrap gap-1">
            <Link href="/" className="hover:underline">Home</Link> /
            <Link href="/" onClick={() => router.back()} className="hover:underline">Back</Link> /
            <span className="text-gray-800 font-medium truncate">{selectedVariant?.name ? selectedVariant?.name : selectedVariant?.product_variant_title}</span>
          </nav>

          <div className="relative h-full">
            <ProductImageGallery
              images={selectedVariant?.image_urls || selectedVariant?.product_variant_image_urls || []}
              name={selectedVariant?.product_variant_title || "Product"}
            />
          </div>

        </div>

        <div className="md:pt-16 pt-20 sm:pt-16 lg:pt-0 xl:pt-0">
          <div className="flex items-center  gap-4 border-b py-1 border-gray-300">
            <div >
              <h1 className="text-2xl font-bold text-[#13cea1]">
                {selectedVariant?.product_variant_title}
              </h1>
              <p className="text-gray-600 mt-1">
                Brand: {productData?.data?.data?.product?.brand_name}
              </p>
            </div>

            {currentProduct?.isLike === true ? (
              <button
                onClick={handleDeleteWishList}
                className="w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 "
              >
                <Heart size={20} />
              </button>
            ) : (
              <button
                onClick={handleWishList}
                className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 "
              >
                <Heart size={20} />
              </button>
            )}
          </div>

          {productData?.data?.data?.product?.options?.length > 0 ? (
            <div className="py-5">

              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-lg flex items-center gap-2">
                  <span className="text-red-600 capitalize">{productData?.data?.data?.product?.name}</span>
                  <span className="text-gray-500 text-sm italic">(Custom Printed)</span>
                </h3>
                <div className="border-b border-gray-300 mb-4"></div>
              </div>

              <div className="mb-5 flex items-center justify-between w-full">
                <label className="text-slate-600 font-bold w-1/3 text-md">Quantity</label>
                <select
                  className="border border-[#D9D9D9] rounded-md px-3 py-2 w-2/3 h-[45px]"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                >
                  <option value="" disabled>Select Quantity</option>

                  {quantityOptions.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>

              </div>

              {productData?.data?.data?.product?.options.map((opt: any) => (
                <div
                  key={opt.id}
                  className="mb-5 flex items-center justify-between w-full"
                >

                  <label className="text-slate-600 font-bold w-1/3 text-md">{opt.option}</label>


                  <div className=" w-2/3">
                    <select
                      className="w-full h-[45px] border border-[#D9D9D9] rounded-md pl-3 pr-10 text-gray-800
  focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none"
                      value={selectedOptions[opt.id]?.id || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        // 👉 EMPTY SELECT → CLEAR
                        if (!value) {
                          handleSelectOption(opt.id, null);
                          return;
                        }

                        const selectedVal = opt.values.find(
                          (v: any) => v.id === Number(value)
                        );

                        handleSelectOption(opt.id, {
                          id: selectedVal.id,
                          option_name: selectedVal.option_name,
                          value: selectedVal.value,
                          pricings: selectedVal.pricings,
                        });
                      }}
                    >
                      <option value="">Select {opt?.option}</option>

                      {opt.values.map((val: any) => (
                        <option key={val.id} value={val.id}>
                          {val.value}
                        </option>
                      ))}
                    </select>


                    {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                      ▾
                    </span> */}
                  </div>
                </div>
              ))}

            </div>
          ) : (
            /* 🔹 If NO options, show ONLY quantity nicely */
            <div className="py-5">
              <div className="flex items-center justify-between w-full">
                <label className="text-slate-600 font-bold w-1/3 text-md">Quantity</label>
                <select
                  className="border border-[#D9D9D9] rounded-md px-3 py-2 w-2/3 h-[45px]"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                >
                  <option value="" disabled>Select Quantity</option>

                  {quantityOptions.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>

              </div>
            </div>
          )}

          {pricingData?.length > 0 && (
            <>
              <table className="w-full border border-gray-300 mt-4 border-collapse">
                <thead>
                  <tr className="bg-[#fafafa]">
                    <th className="py-2 px-3 text-center font-semibold text-gray-700 text-[15px] border border-gray-300">
                      Quantity
                    </th>
                    <th className="py-2 px-3 text-center font-semibold text-gray-700 text-[15px] border border-gray-300">
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visiblePricing?.map((row: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2 px-3 text-center text-[16px] border border-gray-300 font-medium">
                        {row?.quantity}
                      </td>

                      <td className="py-2 px-3 border border-gray-300 text-center">
                        <div className="font-bold text-[16px] text-black">
                          ₹{row?.price}
                        </div>
                        <div className="text-[14px] text-gray-600">
                          ₹{row?.per_item_price}/unit
                        </div>

                        {row?.discountPercent > 0 && (
                          <div className="text-green-600 text-[13px] font-medium">
                            (Save {row?.discountPercent}%)
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pricingData.length > 5 && (
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => setShowAllPricing(!showAllPricing)}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {showAllPricing ? "See less" : "See more"}
                  </button>
                </div>
              )}
            </>
          )}

          {(selectedPrice?.final_price || productData?.data?.data?.product?.price) && (
            <div className="mt-3 text-right pt-2">

              {/* PRICE */}
              <p className="text-lg font-semibold text-red-600">
                Total: ₹
                {selectedPrice?.final_price
                  ? selectedPrice.final_price.toFixed(2)
                  : productData?.data?.data?.product?.price}
              </p>

              {/* ✅ GST INCLUDED TEXT – FROM DATA */}
              {Number(productData?.data?.data?.product?.gst_percent) > 0 && (
                <p className="text-xs text-gray-500">
                  (Price inclusive of {productData.data.data.product.gst_percent}% GST)
                </p>
              )}

              {/* MRP */}
              {selectedPrice?.mrp_price > 0 && (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{selectedPrice.mrp_price.toFixed(2)}
                  </p>

                  {/* GST NOTE FOR MRP */}
                  {productData?.data?.data?.product?.gst_percent && (
                    <p className="text-xs text-gray-400">
                      (MRP inclusive of GST)
                    </p>
                  )}
                </>
              )}
            </div>
          )}


          {cartData?.images && cartData?.images?.length > 0 ? (
            <>
              {/* {selectedVariant?.is_custom_image_required === true && ( */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                <div className="flex gap-4 flex-wrap">
                  {cartData?.images?.map((img: any) => (
                    img?.image_urls?.map((url: any, index: number) => (
                      <div key={`${img?.id}-${index}`} className="relative inline-block">
                        <img
                          src={url || emptyImage}
                          alt="Uploaded"
                          className="w-32 h-32 aspect-square object-cover rounded-lg border shadow"
                        />
                        <button
                          onClick={() => onRemoveImage(img?.id, index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  ))}
                </div>
              </div>
              {/* // )} */}
            </>
          ) : null}

          <div className="mt-8">
            {!cartData?.images?.length && (
              <button
                // disabled={isAllOptionsSelected()}
                onClick={(e) => {
                  e.stopPropagation();
                  // if (isAllOptionsSelected()) return;

                  getUserId
                    ? handleAddCart(quantity ? quantity : 1)
                    : setSignInModal(true);
                }}
                //             className={`flex justify-center font-semibold px-6 py-3 rounded-lg w-full transition
                //   ${isAllOptionsSelected()
                //                 ? "bg-[#13cea1]/50 text-white cursor-not-allowed"
                //                 : "bg-[#13cea1] hover:bg-[#4db49c] text-white cursor-pointer"
                //               }
                // `}
                className={`flex justify-center font-semibold px-6 py-3 rounded-lg w-full transition
bg-[#13cea1] hover:bg-[#4db49c] text-white cursor-pointe"
    `}
              >
                Buy now <ShoppingCartIcon className="ml-2" />
              </button>
            )}
          </div>

          {selectedVariant?.is_custom_image_required === true && (
            <button
              type="button"
              onClick={() => {
                if (!cartData?.cartId) {
                  handleUploadError();
                  return;
                }
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*";
                input.onchange = (e: any) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;

                  handleUploadRef(files as File[]);
                };
                input.click();
              }}
              disabled={uploading}
              className={`mt-3 w-full px-6 py-3 rounded-lg text-white bg-[#13cea1] hover:bg-[#4db49c]
    ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploading ? "Uploading..." : "Upload Designs"}
            </button>
          )}

          {/* GO TO CART BUTTON — only after image upload */}
          {!uploading && cartData?.images?.length > 0 && (
            <button
              onClick={() => router.push('/cart')}
              className="bg-[#13cea1] mt-2 flex justify-center hover:bg-[#4db49c] text-white font-semibold px-6 py-3 rounded-lg w-full"
            >
              Go to Cart
            </button>
          )}



        </div>

        {signInmodal && (
          <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
        )}
      </div>
      <div className="mx-auto max-w-screen-xl w-full  pt-15 pb-2 px-4 sm:px-6 md:px-8 lg:px-10 bg-white">

        <h2 className="text-xl font-bold text-gray-800 my-4">Product Descriptions:</h2>

        <div
          className="mt-2 text-gray-700 overflow-hidden break-words break-all leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: productData?.data?.data?.product?.description }}
        />

      </div>


      <div className="mx-auto  pt-10 pb-2 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 bg-white">
        <div className="text-center my-8">
          <h2 className="text-2xl text-gray-700 font-bold">You May also Like</h2>
          <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {products?.data?.products
            ?.filter((product: any) => productData?.data?.data?.product?.category === product?.category)
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
    </>
  );
}