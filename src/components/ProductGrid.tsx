"use client";

import Image from "next/image";

const products = [
  {
    title: "Box",
    desc: "Versatile boxes for all your packaging needs.",
    image: "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/opt/contentimages/images/option+03+copy.png.webp?v=722", // update with your image path
    bg: "bg-[#FFEAEA]",
  },
  {
    title: "Stand-Up Zip Pouch",
    desc: "Custom print available in single or double-sided.",
    image: "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/opt/contentimages/images/option+03+copy.png.webp?v=722",
    bg: "bg-[#ffc8c8]",
  },
  {
    title: "Flyer",
    desc: "Vibrant custom flyers to promote your message.",
    image: "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/opt/contentimages/images/option+03+copy.png.webp?v=722",
    bg: "bg-[#bfc7d3]",
  },
  {
    title: "Sticker",
    desc: "Custom stickers to make your brand stick.",
    image: "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/opt/contentimages/images/option+03+copy.png.webp?v=722",
    bg: "bg-[#bfc7d3]",
  },
  {
    title: "Business Card",
    desc: "Finest Business Card!",
    image: "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/opt/contentimages/images/option+03+copy.png.webp?v=722",
    bg: "bg-[#FFEAEA]",
  },
  {
    title: "Certificate",
    desc: "Customizable certificates that celebrate success in style!",
    image: "https://d3pyarv4eotqu4.cloudfront.net/printongo/images/opt/contentimages/images/option+03+copy.png.webp?v=722",
    bg: "bg-[#ffc8c8]",
  },
];

export default function ProductGrid() {
  return (
    <section className="w-full py-12">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {products.map((item, i) => (
          <div
            key={i}
            className={`${item.bg} flex flex-col md:flex-row items-center justify-between p-8`}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 max-w-xs">{item.desc}</p>
            </div>
            <div className="mt-6 md:mt-0 md:ml-6">
              <Image
                src={item.image}
                alt={item.title}
                width={220}
                height={180}
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
