export default function About() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1CECFD] via-[#13cea1] to-[#1CECFD] text-white py-16 text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-3 text-lg max-w-2xl mx-auto">
          Crafting personalized printing solutions with passion, precision, and creativity.
        </p>
      </section>

      {/* Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our Story</h2>
        <p className="text-gray-600 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          At <span className="font-semibold text-cyan-600">N Prints Gallery</span>,
          we specialize in delivering high-quality printing solutions and customized gifting services that leave a lasting impression. From all types of printing services—whether it's business cards, brochures, banners, or premium marketing materials—to a wide range of personalized and corporate gifts, we ensure every product reflects creativity, quality, and attention to detail.
        </p>
      </section>

      {/* Mission & Vision */}
      {/* <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide top-notch printing solutions that blend creativity,
              quality, and affordability. We aim to make every customer’s idea
              a reality through innovation and excellence.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">🌟 Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be recognized as the most trusted and innovative printing
              brand in India, serving individuals and businesses with
              customized solutions that inspire and connect.
            </p>
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      {/* <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-10">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-cyan-600 mb-3">✔️ Quality Prints</h4>
            <p className="text-gray-600">
              Premium materials and advanced printing tech ensure vibrant,
              long-lasting results.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-cyan-600 mb-3">✔️ Customization</h4>
            <p className="text-gray-600">
              From single pieces to bulk orders, we personalize every detail
              to match your needs.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-cyan-600 mb-3">✔️ Quick Delivery</h4>
            <p className="text-gray-600">
              With efficient processes and reliable logistics, your orders
              reach you on time, every time.
            </p>
          </div>
        </div>
      </section> */}

      {/* Additional About Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-cyan-600 mb-3">🖨️ Printing Services</h4>
              <p className="text-gray-600">
                Digital, offset, large-format, and custom printing for both personal and professional needs.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-cyan-600 mb-3">🎁 Personalized Gifts</h4>
              <p className="text-gray-600">
                Unique, tailor-made gifts designed to celebrate special occasions and make moments memorable.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-cyan-600 mb-3">🏢 Corporate Gifts</h4>
              <p className="text-gray-600">
                Elegant, professional gift solutions that help businesses strengthen relationships with clients, partners, and employees.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">Who We Serve</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-cyan-600 mb-2">🏢 Corporate Companies</h4>
              <p className="text-gray-600">
                Looking for branding, promotional items, and premium gift solutions to strengthen business relationships.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-cyan-600 mb-2">👤 Individuals</h4>
              <p className="text-gray-600">
                Seeking customized gifts and high-quality printing for personal occasions such as birthdays, weddings, and celebrations.
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed text-center max-w-4xl mx-auto mt-12">
            At <span className="font-semibold text-cyan-600">N Prints Gallery</span>, we blend creativity,
            technology, and customer-centric service to provide solutions that go beyond expectations. 
            Whether you're a business aiming to stand out or an individual looking for something special, 
            we're here to bring your ideas to life—beautifully and professionally.
          </p>
        </div>
      </section>
    </main>
  );
}
