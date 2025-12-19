"use client";

// import { Button } from '@/components/ui/button';
import { formatDate } from '../../../lib/utils';
// import { getProducts } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrdersAndOrdersItemsApi } from '@/api-endpoints/CartsApi';
import { Eye, Package } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';

export default function ProfileOrders() {
  const router = useRouter();
  const { vendorId } = useVendor();
  const { convertPrice } = useCurrency();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  // const { data, isLoading }: any = useQuery({
  //   queryKey: ['getOrderData', userId, vendorId],
  //   queryFn: () => getOrderApi(`${userId}/vendor/${vendorId}`),
  //   enabled: !!userId && !!vendorId
  // });

  const getOrdersAndOrdersItemsApiData: any = useQuery({
    queryKey: ['getOrdersAndOrdersItemsApiData', userId, vendorId],
    queryFn: () => getOrdersAndOrdersItemsApi(`?vendor_id=${vendorId}&user_id=${userId}`),
    enabled: !!userId && !!vendorId
  });

  function slugConvert(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '');     // Remove non-word characters except hyphens
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Orders</h2>
      {getOrdersAndOrdersItemsApiData?.data?.data?.length ? (
        <div className="space-y-6">
          {getOrdersAndOrdersItemsApiData?.data?.data?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((order: any) => (
            <div key={order?.id} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-[#F8F7F2] p-4 flex justify-between items-center flex-wrap">
                <div>
                  <div className="text-sm text-muted-foreground font-bold">Order placed</div>
                  <div className="font-medium">{formatDate(order?.created_at)}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground font-bold">Order number</div>
                  <div className="font-medium">{order?.id}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground font-bold">Total</div>
                  <div className="font-medium">{convertPrice(Number(order?.total_amount))}</div>
                </div>

                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-bold ${order?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order?.status === 'Processing' ? 'bg-blue-50 text-red-600' :
                        order?.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                          order?.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                            order?.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-600'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {order?.order_items?.map((product: any) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#F8F7F2] rounded-md overflow-hidden flex-shrink-0">
                        {product?.product?.image_urls?.[0] && (
                          <Image
                            src={product.product?.image_urls?.[0] || "https://semantic-ui.com/images/wireframe/image.png"}
                            alt="Image"
                            className="w-full h-full object-cover"
                            height={100}
                            width={100}
                          />
                        )}

                      </div>

                      <div className="flex-grow">
                        <h3 className="font-bold">{product?.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {product?.quantity}
                        </p>
                      </div>

                      <div>
                        <button
                          className='rounded bg-[#13cea1] text-white font-bold px-4 py-2 hover:bg-[#4db49c] transition-colors'
                          onClick={() => router.push(`/products/${(product?.product?.slug_name)}`)}
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex py-1 justify-between font-bold hover:text-[#4db49c]">
                  <button
                    onClick={() => router.push(`/order-view/${order.id}`)}
                    className='flex gap-2'
                  >
                    <Eye />
                    View Order Details
                  </button>

                  {/* <Button variant="outline" size="sm">
                    Track Package
                  </Button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new orders.</p>
        </div>
      )}
    </div>
  );
}