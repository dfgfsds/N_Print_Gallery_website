"use client";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBlogsApi } from '@/api-endpoints/authendication';

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogPost({ params }: { params: { id: string } }) {

  const getBlogsData: any = useQuery({
    queryKey: ['getBlogsData', params?.id],
    queryFn: () => getBlogsApi(`${params?.id}`)
  })
  const post = getBlogsData?.data?.data?.blog


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {post?.banner_url && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${encodeURI(post.banner_url)}')` }}

          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}



        <div className="relative h-full max-w-3xl mx-auto px-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-white/90 mb-4">
            <span className="font-medium"> {post?.title && post.title.charAt(0).toUpperCase() + post.title.slice(1)}</span>
            <span>•</span>
            <span>{formatDate(post?.created_at)}</span>
            <span>•</span>
            <span>5 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 capitalize">
            {post?.subtitle}
          </h1>
          <div className="flex items-center">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2 "
              alt={post?.author}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="text-white">
              <div className="font-medium">{post?.author}</div>
              {/* <div className="text-sm text-white/90">{post?.author}</div> */}
            </div>
          </div>

        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <button
            className="mb-8 hover:bg-transparent hover:text-[#4D8B31]"
          >
            <Link href="/blog" className='flex items-center text-gray-600 font-medium'>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </button>

          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post?.content }} />
          </article>

          {/* Share Section */}
        
        </div>
      </div>
    </div>
  );
}