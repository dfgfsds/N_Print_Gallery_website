'use client';
import React from 'react';
import Image from 'next/image';
import { useVendor } from '@/context/VendorContext';
import { useQuery } from '@tanstack/react-query';
import { getBlogsApi } from '@/api-endpoints/authendication';
import { useRouter } from 'next/navigation';


const BlogSection: React.FC = () => {
    const { vendorId } = useVendor();
    const router = useRouter();
    const emptyImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE='
    const getBlogsData: any = useQuery({
        queryKey: ['getBlogsData', 64],
        queryFn: () => getBlogsApi(`?vendor_id=${vendorId}`)
    })

    return (
        <section className="py-6 px-4 bg-white">
            <div className="max-w-7xl mx-auto container">
                {/* <h2 className="text-3xl font-extrabold text-center mb-10">Our Latest Blogs</h2> */}
                   <div className="text-center">
        <h2 className="text-2xl text-gray-700 font-bold">Our Latest Blogs</h2>
        <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
      </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    {getBlogsData?.data?.data?.blogs?.map((post: any, idx: any) => {
                        const dateObj = new Date(post?.created_at || post?.date);
                        const monthDay = dateObj?.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        }); // e.g. "Jun 28"
                        const year = dateObj?.getFullYear(); // e.g. 2025
                        return (
                            <div key={idx} className="px-3 ">
                                <div className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 h-full">

                                    {/* Image Section with Centered Date */}
                                    <div className="relative h-56 w-full hover:scale-105 transition-transform duration-300">
                                        {/* {post?.banner_url && ( */}
                                        <Image
                                            src={post?.banner_url ? post?.banner_url : emptyImage}
                                            alt={post?.title}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* )} */}


                                        {/* Centered Date Badge */}
                                        <div className="absolute top-full left-1/2  transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="bg-white text-gray-800 text-xs p-4 rounded-full shadow-md text-center w-24">
                                                <p>{monthDay}</p>
                                                <div className="my-1 border-t border-gray-300 w-full"></div>
                                                <p>{year}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 text-center">
                                        <h3 className="text-lg font-bold text-gray-900 mt-6">{post?.title}</h3>
                                        <p className="text-sm text-gray-600 mt-2">{post?.description?.slice(0, 200)}</p>

                                        <div className='mt-4 flex justify-center items-center'>
                                            <button className="relative w-36 h-12 rounded-full text-sm font-medium bg-[#03E5F4] text-white  hover:text-white overflow-hidden z-10 group transition-all duration-300"
                                                onClick={() => router.push(`/blog/${post?.id}`)}
                                            >
                                                <span className="relative z-10">Read more</span>
                                                <span className="absolute left-0 top-0 h-full w-0 rounded-full bg-[#991b1b] transition-all duration-500 ease-in-out group-hover:w-full z-0"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
