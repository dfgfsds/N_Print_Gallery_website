"use client"

import { useState } from 'react';
import { X, Minus, Plus, TrashIcon, Trash2Icon, Upload, Pencil, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { formatPrice } from '@/lib/utils';
// import type { Product } from '@/lib/data';
import { deleteCartitemsApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '../../../lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '@/api-endpoints/ApiUrls';
import EmptyImage from '../../../public/images/emptyImage.png';


interface CartItemProps {
  // product: Product;
  product: any;
  quantity: number;
}

export default function CartItem({ product, quantity: initialQuantity }: CartItemProps) {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { convertPrice } = useCurrency();
  const emptyImage = EmptyImage;

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          toast.success('Product removed!')
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`)
        if (response) {
          toast.success('Product updated in cart!')
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      }

    } catch (error) {

    }
  }
  const handleRemoveItem = async (id: any) => {
    try {
      const updateApi = await deleteCartitemsApi(`${id}`)
      toast.success('Product removed!')
      if (updateApi) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error: any) {
      // toast.error(error?.response?.data?.error)
    }
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
      console.error("Error deleting image:", error);
    }
  };

  const handleUploadRef = async (images: File[]) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("cart_item", product?.cartId ?? "");
      formData.append("created_by", "user");
      formData.append("updated_by", "user");
      images.forEach((file) => {
        formData.append("images", file);
      });
      const response = await axios.post(`${baseUrl}/cart-item-images/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }

      // console.log("Upload success:", response.data);
    } catch (error) {
      toast.error("Please add item to Cart!")
    } finally {
      setUploading(false); // 🔥 stop loading
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const files: any = Array.from(e.target.files);
      handleUploadRef(files);
    };
    input.click();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border last:border-0 last:pb-0">
      <div className="flex-grow">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
          {/* Product Main Section with Delete Icon */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Delete button placed at top-right */}
            {/* <button
              onClick={() => handleRemoveItem(product?.cartId)}
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2Icon className="h-5 w-5" />
            </button> */}

            <div className="absolute top-0 right-0 flex gap-4 text-sm font-semibold">
              <button
                // onClick={() => handleEditOrder(product)}
                className="flex items-center gap-1 text-[#13cea1] font-bold hover:underline transition"
              >
                <Pencil size={14} />
                Edit Order
              </button>
              <button
                onClick={() => handleRemoveItem(product?.cartId)}
                className="flex items-center gap-1 text-red-600 hover:underline transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

            {/* Product Image and Name */}
            <div className="flex items-center gap-4">
              {/* PRODUCT IMAGE */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <img
                  src={
                    product?.image_urls?.[0] ||
                    product?.product_variant_image_urls?.[0] ||
                    "https://semantic-ui.com/images/wireframe/image.png"
                  }
                  alt={product?.name || "Product Image"}
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>

              {/* PRODUCT TEXT */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800">
                  {product?.name
                    ? product?.name
                    : product?.product_variant_title
                      ? product?.product_variant_title
                      : product?.product_size || "Product"}
                </h3>

                {/* Option: Name : Value */}
                {product?.cartItemData?.options && (
                  <div className="text-sm text-gray-600 mt-1">
                    {Object.values(product?.cartItemData?.options)?.map((opt: any) => (
                      <p key={opt?.id}>
                        <span className="font-semibold">{opt?.option_name}:</span>{" "}
                        {opt?.value}
                      </p>
                    ))}
                  </div>
                )}

                {/* PRICE */}
                <p className="text-gray-500 text-sm mt-1">
                  Price:{" "}
                  {convertPrice(
                    Number(
                      product?.optionPrice
                        ? product?.optionPrice
                        : product?.product_size_price
                    )
                  )}
                </p>
              </div>
            </div>


            {/* Quantity and Total Price Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0 sm:ml-auto">
              <div className="text-right text-lg font-bold text-gray-800 w-24">
                {convertPrice(Number(product?.optionPrice ? product?.optionPrice : "0"))}
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Uploaded Images and Controls Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-700 mb-2">
                Uploaded Designs ({product?.uploadImages?.image_urls?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-3">
                {product?.uploadImages?.image_urls?.length > 0 ? (
                  product.uploadImages.image_urls.map((url: any, index: any) => (
                    <div
                      key={`${product.uploadImages.id}-${index}`}
                      className="relative w-24 h-24 rounded-lg border shadow-sm group"
                    >
                      <img
                        src={url || 'https://via.placeholder.com/100'}
                        alt={`Uploaded Design ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => onRemoveImage(product.uploadImages.id, index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition-transform duration-200 transform scale-100 hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No designs uploaded yet. Please upload your images.</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 mt-4 sm:mt-0">
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-bold transition-colors duration-300 ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
                  }`}
              >
                {uploading ? (
                  <>
                    <Upload size={18} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Add/Upload Designs
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}