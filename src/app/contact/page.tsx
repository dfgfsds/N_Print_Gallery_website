// import { MapPin, Phone, Mail } from "lucide-react";

// export default function Contact() {
//     return (
//         <main className="bg-gray-50">
//             {/* Title Section */}
//             <section className="text-center py-12">
//                 <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
//                 <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
//                     Have questions or want to work together? Reach out to us directly using the info below.
//                 </p>
//             </section>

//             {/* Info + Map */}
//             <section className="max-w-6xl mx-auto px-6 pb-16">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//                     {/* Left Side - Contact Info */}
//                     <div className="space-y-6">
//                         {/* Phone */}
//                         <div className="flex items-center gap-4">
//                             <Phone className="w-6 h-6 text-[#1CECFD]" />
//                             <a
//                                 href="tel:+919092036699"
//                                 className="text-lg text-gray-700 hover:text-[#1CECFD]"
//                             >
//                                 +91-9092036699
//                             </a>
//                         </div>

//                         {/* Email */}
//                         <div className="flex items-center gap-4">
//                             <Mail className="w-6 h-6 text-[#1CECFD]" />
//                             <a
//                                 href="mailto:Mr.kingmobilescbe@gmail.com"
//                                 className="text-lg text-gray-700 hover:text-[#1CECFD]"
//                             >
//                                 support@nprintgallery.com
//                             </a>
//                         </div>

//                         {/* Address */}
//                         <div className="flex items-center gap-4">
//                             <MapPin className="w-8 h-8 text-[#1CECFD]" />
//                             <p className="text-lg text-gray-700">
//                                 #25,D97, Dhanishka Allegeria Gardens, Vengadamangalam Road, Kandigai, Chennai-600127
//                             </p>
//                         </div>

//                           <div className="flex items-center gap-4">
//                             <MapPin className="w-8 h-8 text-[#1CECFD]" />
//                             <p className="text-lg text-gray-700">
//                                 Plot No: 179, Ground Floor, Phase 2, Alai Balai Chowrasta,<br />
//                                 Opp: Venkateswara Swami Temple, Tngo’s Colony,<br />
//                                 Hyderabad – 500032
//                             </p>
//                         </div>
//                     </div>

//                     {/* Right Side - Map */}
//                     <div className="w-full h-80 rounded-lg overflow-hidden shadow-md">
//                         <iframe
//                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.11109418995886!2d80.14348257862703!3d12.857642223105215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5259027e53eeb9%3A0xd66e39ead3d2ddd0!2sDhanishkha%20Apartment!5e0!3m2!1sen!2sin!4v1757489093191!5m2!1sen!2sin"
//                             width="100%"
//                             height="100%"
//                             style={{ border: 0 }}
//                             allowFullScreen
//                             loading="lazy"
//                         ></iframe>
//                     </div>
//                 </div>
//             </section>
//         </main>
//     );
// }


"use client";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import ApiUrls from "@/api-endpoints/ApiUrls";
import toast from "react-hot-toast";
import { useVendor } from "@/context/VendorContext";


export default function Contact() {
    const { vendorId } = useVendor();
    const [form, setForm] = useState({
        name: "",
        email: "",
        description: "",
        contact_number: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(ApiUrls?.sendQuoteRequest, { ...form, vendor_id: vendorId });
            toast.success("Message sent successfully ✅");
            setForm({ name: "", email: "", contact_number: "", description: "" });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Something went wrong, try again later");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-50">
            {/* Header */}
            {/* <section className="relative h-64 bg-[url('/contact-banner.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/40 w-full h-full absolute"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2">We’d love to hear from you</p>
        </div>
      </section> */}

            {/* Form + Info */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left - Form */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                            />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                            />
                            <input
                                type="number"
                                name="contact_number"
                                value={form.contact_number}
                                onChange={handleChange}
                                placeholder="Mobile"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                            />
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Message"
                                rows={5}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                            ></textarea>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#13cea1] text-white py-2 rounded-lg hover:bg-[#79d3be] transition disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Right - Contact Info */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
                        <p className="text-gray-600 mb-6">
                            Have questions about our products or services? Reach out to us through any of the following channels.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-6 h-6 text-green-600 mt-1" />
                                <p>   #25,D97, Dhanishka Allegeria Gardens, Vengadamangalam Road, Kandigai, Chennai-600127</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-6 h-6 text-green-600" />
                                <p> +91-9092036699</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-green-600" />
                                <p>  support@nprintgallery.com</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-6 h-6 text-green-600 mt-1" />
                                <p>
                                    Monday – Friday: 9:00 AM – 6:00 PM <br />
                                    Saturday: 10:00 AM – 4:00 PM <br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="mt-8 w-full h-64 rounded-lg overflow-hidden shadow">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.11109418995886!2d80.14348257862703!3d12.857642223105215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5259027e53eeb9%3A0xd66e39ead3d2ddd0!2sDhanishkha%20Apartment!5e0!3m2!1sen!2sin!4v1757489093191!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

