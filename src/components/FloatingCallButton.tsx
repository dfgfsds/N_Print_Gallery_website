"use client";

import Link from "next/link";
import { Phone } from "lucide-react"; // or react-icons if u prefer

interface FloatingCallButtonProps {
    phoneNumber?: string;
}

export default function FloatingCallButton({
    phoneNumber = "+919092036699",
}: FloatingCallButtonProps) {
    return (
     <Link
  href={`tel:${phoneNumber}`}
  className="fixed bottom-36 md:bottom-24 left-5 z-50 flex items-center justify-center 
  w-11 h-11 sm:w-13 sm:h-13 rounded-full 
  bg-gradient-to-r from-blue-600 to-blue-800 
  text-white shadow-lg border border-blue-700 
  transition-transform duration-300 hover:shadow-2xl"
>
  <Phone size={20} className="sm:size-6 relative z-10" />
</Link>

    );
}
