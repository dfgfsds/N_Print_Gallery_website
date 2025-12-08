// 'use client'
// import QuoteModal from "@/components/QuoteModal";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

export default function Services() {
  // const router = useRouter();
  // const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1CECFD] via-[#13cea1] to-[#1CECFD] text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="mt-3 text-lg max-w-2xl mx-auto">
          End-to-end printing solutions — from personal gifts to professional branding.
        </p>
      </section>

      {/* Services Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-12">
          What We Offer
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Service Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-cyan-600 mb-3">🎨 Custom Design</h3>
            <p className="text-gray-600">
              Personalized designs for t-shirts, mugs, posters, and more to make your
              brand or memories stand out.
            </p>
          </div>
          {/* Service Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-cyan-600 mb-3">🖨️ Digital & Offset Printing</h3>
            <p className="text-gray-600">
              High-quality prints for brochures, flyers, visiting cards, and large
              banners with vibrant colors.
            </p>
          </div>
          {/* Service Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-cyan-600 mb-3">🎁 Corporate Gifts</h3>
            <p className="text-gray-600">
              Customized corporate gifting solutions like branded merchandise,
              stationery kits, and awards.
            </p>
          </div>
          {/* Service Card 4 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-cyan-600 mb-3">📸 Photo Printing</h3>
            <p className="text-gray-600">
              High-resolution photo prints, albums, and canvas art to cherish
              memories forever.
            </p>
          </div>
          {/* Service Card 5 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-cyan-600 mb-3">👕 Apparel Printing</h3>
            <p className="text-gray-600">
              T-shirts, hoodies, caps, and uniforms with screen, DTG, or embroidery
              printing for style and branding.
            </p>
          </div>
          {/* Service Card 6 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-cyan-600 mb-3">📦 Bulk Orders</h3>
            <p className="text-gray-600">
              Cost-effective bulk printing with guaranteed quality and fast delivery
              for businesses & events.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="bg-gradient-to-r from-[#1CECFD] to-[#13cea1] text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Need a Custom Printing Solution?</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Whether it’s a one-time gift or a full business package, we’ve got you covered.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            onClick={() => setQuoteOpen(!quoteOpen)}
          >
            Get a Quote
          </button>
          <button className="bg-[#13cea1] px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#4db49c] transition"
            onClick={() => router.push("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section> */}
      {/* {quoteOpen && <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />} */}

    </main>
  );
}
