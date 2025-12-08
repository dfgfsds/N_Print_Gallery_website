export default function CorporateGifts() {
    return (
        <main className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#13cea1] to-[#1CECFD] text-white py-16 px-6 text-center">
                <h1 className="text-4xl font-bold">Corporate Gifts</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg">
                    Strengthen business relationships with premium corporate gifts.
                    Perfect for clients, employees, and events.
                </p>
            </section>

            {/* Content Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                        Why Choose Our Corporate Gifts?
                    </h2>
                    <ul className="space-y-4 text-lg text-gray-700">
                        <li>🎁 Customizable products with your branding</li>
                        <li>🌍 Eco-friendly & sustainable options</li>
                        <li>⚡ Bulk order support with fast delivery</li>
                        <li>🏢 Ideal for employee rewards, events & clients</li>
                    </ul>

                    <button className="mt-8 px-6 py-3 bg-[#13cea1] hover:bg-[#1CECFD] text-white font-medium rounded-lg shadow transition">
                        Get a Quote
                    </button>
                </div>

                {/* Image / Visual */}
                <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                        src="https://img.freepik.com/free-photo/present-boxes-arrangement_23-2148866882.jpg"
                        alt="Corporate Gifts"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-gradient-to-r from-[#1CECFD] to-[#13cea1] py-16 px-6 text-white">
                <h2 className="text-3xl font-semibold text-center mb-10">
                    Popular Corporate Gift Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="p-6 bg-white text-gray-800 rounded-lg shadow hover:shadow-md transition">
                        <img
                            src="https://img.freepik.com/free-photo/stationery-branding-elements_53876-75915.jpg"
                            alt="Office Essentials"
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">Office Essentials</h3>
                        <p className="text-gray-600">
                            Custom notebooks, pens, mugs & more with your branding.
                        </p>
                    </div>
                    <div className="p-6 bg-white text-gray-800 rounded-lg shadow hover:shadow-md transition">
                        <img
                            src="https://img.freepik.com/free-photo/elegant-gift-boxes-arrangement_23-2148899264.jpg"
                            alt="Premium Gifts"
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">Premium Hampers</h3>
                        <p className="text-gray-600">
                            Luxury hampers and festive gift sets for clients & events.
                        </p>
                    </div>
                    <div className="p-6 bg-white text-gray-800 rounded-lg shadow hover:shadow-md transition">
                        <img
                            src="https://img.freepik.com/free-photo/eco-friendly-products_53876-126473.jpg"
                            alt="Eco-Friendly Gifts"
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">Eco-Friendly Gifts</h3>
                        <p className="text-gray-600">
                            Reusable, sustainable, and environmentally friendly options.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
