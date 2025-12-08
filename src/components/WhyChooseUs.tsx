import { FaRegGem } from "react-icons/fa"; // Premium Quality
import { CiDeliveryTruck } from "react-icons/ci"; // Fast Delivery
import { FaTags } from "react-icons/fa"; // Affordable Prices
import { MdDesignServices } from "react-icons/md"; // Custom Designs

export default function WhyChooseUs() {
  const features = [
    {
      title: "Premium Quality",
      desc: "High-quality printing with sharp details and vibrant colors.",
      icon: <FaRegGem size={40} color="#4db49c" />,
    },
    {
      title: "Fast Delivery",
      desc: "Get your orders delivered quickly without delays.",
      icon: <CiDeliveryTruck size={40} color="#4db49c" />,
    },
    {
      title: "Affordable Prices",
      desc: "Best rates with no compromise on print quality.",
      icon: <FaTags size={40} color="#4db49c" />,
    },
    {
      title: "Custom Designs",
      desc: "Unique and personalized designs tailored for your needs.",
      icon: <MdDesignServices size={40} color="#4db49c" />,
    },
  ];

  return (
    <section className="mx-auto px-4 py-16">
      {/* <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2> */}
       <div className="text-center mb-6">
            <h2 className="text-2xl text-gray-700  font-bold">Why Choose Us</h2>
            <div className="w-20 h-1 bg-[#13cea1] mx-auto mt-2 rounded"></div>
          </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#4db49c]/10">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[#4db49c]">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
