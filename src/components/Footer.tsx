// components/Footer.tsx
"use client";
import { Facebook, Instagram, Youtube, Linkedin, Twitter, } from "lucide-react";
import Image from "next/image";
import logo from "../../public/images/logo.webp"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuoteModal from "./QuoteModal";
import { useVendor } from "@/context/VendorContext";
import { useUser } from "@/context/UserContext";
import { useCategories } from "@/context/CategoriesContext";
import { useQuery } from "@tanstack/react-query";
import { getVendorDeliveryDetailsApi } from "@/api-endpoints/authendication";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const router = useRouter();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' })
  const { vendorId } = useVendor();
  const [submitted, setSubmitted] = useState(false);
  const { user, setUser }: any = useUser();
  const [testimonialData, setTestimonialData] = useState<any>()
  const [getUserId, setUserId] = useState<string | null>(null);
  const { categories }: any = useCategories();

  const getVendorDeliveryDetailsData: any = useQuery({
    queryKey: ['getVendorDeliveryDetailsData', vendorId],
    queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
    enabled: !!vendorId
  })
  const socialMediaData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.social_media_icon;

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post(`${baseUrl}/testimonial/`, { ...form, vendor: vendorId, verified_status: false, created_by: user?.data?.name ? user?.data?.name : 'user', user: getUserId })
      setSubmitted(true)
      setTimeout(() => {
        setIsModalOpen(false)
        setForm({ title: '', description: '' })
        setSubmitted(false)
      }, 1500)
    } catch (err) {
      console.error(err)
      alert('Error submitting testimonial')
    }
  }

  const testimonialGetApi = async () => {
    try {
      const res: any = await axios.get(`${baseUrl}/testimonial/?user_id=${user?.data?.id}&vendor_id=${vendorId}`);
      if (res?.data) {
        setTestimonialData(res?.data?.testimonials);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      // console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    testimonialGetApi();
  }, [user?.data?.id]);

  return (
    <>
      <section className="bg-gradient-to-r from-[#1CECFD] to-[#13cea1] text-white py-16 text-center">
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
      </section>
      <footer className="bg-white border-t border-gray-200">
        <div className=" mx-auto px-6 py-12">
          {/* Logo */}
          <div className="flex justify-start mb-10">
            <Image src={logo} alt="Hardware Dynamic" width={160} height={60} />
          </div>

          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 text-sm text-black">
            {/* Address */}
            <div>
              <h3 className="font-semibold text-black mb-3">Chennai</h3>
              <p>#25, D97, Dhanishka Allegeria Gardens,</p>
              <p>Vengadamangalam Road, Kandigai, Chennai, Tamil Nadu – 600127</p>
              <p>India</p>

            </div>

            {/* Hyderabad Office */}
            <div>
              <h3 className="font-semibold text-black mb-3">Hyderabad</h3>
              <p>Plot No: 179, Ground Floor, Phase 2, Alai Balai Chowrasta,</p>
              <p>Opp: Venkateswara Swami Temple, Tngo’s Colony, Hyderabad – 500032</p>
              <p>India</p>

            </div>


            {/* Our Company */}
            <div>
              <h3 className="font-semibold text-black mb-3">Our Company</h3>
              <ul className="space-y-2">
                {/* <li><Link href="#" className="hover:text-red-600">Our Story</Link></li>
              <li><Link href="#" className="hover:text-red-600">Store Location</Link></li>
              <li><Link href="#" className="hover:text-red-600">Our Clients</Link></li>
              <li><Link href="#" className="hover:text-red-600">FAQ</Link></li>
              <li><Link href="#" className="hover:text-red-600">Testimonials</Link></li> */}
                <li><Link href="/" className="hover:text-[#03E4FA]">Home</Link></li>
                <li><Link href="about" className="hover:text-[#03E4FA]">About</Link></li>
                <li><Link href="services" className="hover:text-[#03E4FA]">Services</Link></li>
                <li><Link href="blog" className="hover:text-[#03E4FA]">Blog</Link></li>
                {/* <li><Link href="corporate-gifts" className="hover:text-[#03E4FA]">Corporate Gifts</Link></li> */}
                <li><Link href="contact" className="hover:text-[#03E4FA]">Contact</Link></li>
              </ul>
            </div>

            {/* Help
          <div>
            <h3 className="font-semibold text-black mb-3">Help</h3>
            <ul className="space-y-2">
      
              <li><Link href="products" className="hover:text-[#03E4FA]">All Products</Link></li>
              <li><Link href="cart" className="hover:text-[#03E4FA]">Cart</Link></li>
            </ul>
          </div> */}

            {/* Policies */}
            <div>
              <h3 className="font-semibold text-black mb-3">Our Policies</h3>
              <ul className="space-y-2">
                <li><Link href="/terms-and-conditions" className="hover:text-[#03E4FA]">Terms and Conditions</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-[#03E4FA]">Privacy & Security Policy</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-[#03E4FA]">Shipping Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-[#03E4FA]">Refund and Returns Policy</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-[#03E4FA]">Cancellation Policy</Link></li>
              </ul>
            </div>


            <div className="">
              <h3 className="font-semibold text-black mb-3">Customer Support</h3>
              <div className="space-y-2">
                <p>Email: <a href="mailto:business@printongo.com" className="hover:underline">support@nprintgallery.com</a></p>
                <p>Call: <a href="tel:+919167691056" className="hover:underline">+91 9167691056</a></p>
                <p>Hours: Mon - Sun | 10:00 AM – 8:00 PM</p>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-black">
            <p>
              Copyright © 2025 <span className="text-black font-semibold">N Print Gallery</span>. All rights
              reserved.
            </p>

            {/* Social Media Icons */}
            {/* <div className="flex space-x-5 mt-4 md:mt-0">
              <a
                href="https://www.facebook.com/share/1GGeyRPXDP/?mibextid=wwXIfr"
                aria-label="Facebook"
                target="_blank"
                className="bg-white text-[#13cea1]  border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/nprintgalry?igsh=YjI5ZHBpeTBvbXIy"
                aria-label="Instagram"
                target="_blank"
                className="bg-white text-[#13cea1] border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-pink-600 transition"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="bg-white text-[#13cea1] border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="bg-white text-[#13cea1] border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
              >
                <Linkedin size={18} />
              </a>
            </div> */}

            <div className="flex space-x-5 mt-4 md:mt-0">
              {socialMediaData?.facebook?.url && socialMediaData?.facebook?.status === true && (
              <a
                href={socialMediaData?.facebook?.url}
                target='_blank'
                className="bg-white text-[#13cea1]  border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
              >
                <Facebook size={18} />
              </a>
               )} 
              {socialMediaData?.twitter?.url && socialMediaData?.twitter?.status === true && (
                <a
                  href={socialMediaData?.twitter?.url}
                  target='_blank'
                  className="bg-white text-[#13cea1]  border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
                >
                  <Twitter size={16} />
                </a>
              )}
              {socialMediaData?.youtube?.url && socialMediaData?.youtube?.status === true && (
                <a
                  href={socialMediaData?.youtube?.url}
                  target='_blank'
                  className="bg-white text-[#13cea1]  border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
                >
                  <Youtube size={16} />
                </a>
              )}
              {socialMediaData?.instagram?.url && socialMediaData?.instagram?.status === true && (
                <a
                  href={socialMediaData?.instagram?.url}
                  target='_blank'
                  className="bg-white text-[#13cea1]  border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
                >
                  <Instagram size={16} />
                </a>
              )}
              {socialMediaData?.linkedin?.url && socialMediaData?.linkedin?.status === true && (
                <a
                  href={socialMediaData?.linkedin?.url}
                  target='_blank'
                  className="bg-white text-[#13cea1]  border border-gray-400 rounded-full p-3 flex items-center justify-center hover:bg-gray-300 hover:text-red-600 transition"
                >
                  <FaLinkedin size={16} />
                </a>
              )}
            </div>

          </div>
        </div>
      </footer>

      {quoteOpen && <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />}

    </>
  );
}
