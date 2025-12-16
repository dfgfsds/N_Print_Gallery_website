"use client";

import Link from "next/link";
import { Phone } from "lucide-react"; // or react-icons if u prefer
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVendor } from "@/context/VendorContext";
import { getVendorDeliveryDetailsApi } from "@/api-endpoints/authendication";

interface FloatingCallButtonProps {
    phoneNumber?: string;
}

export default function FloatingCallButton({ }: FloatingCallButtonProps) {

    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const { vendorId } = useVendor();

    const getVendorDeliveryDetailsData: any = useQuery({
        queryKey: ['getVendorDeliveryDetailsData', vendorId],
        queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
        enabled: !!vendorId
    })
    const floatingCallData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.vendor_floating_icon;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile(); // initial check
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const message = encodeURIComponent('Hello! I am interested in your services.');

    const isProductPage = pathname?.startsWith('/productLandingPage/');


    return (
        <>
            {floatingCallData?.call?.value && floatingCallData?.call?.status === true && (
                <Link
                    href={`tel:${floatingCallData?.call?.value}`}
                    className={`fixed bottom-36 md:bottom-24 ${floatingCallData?.call?.alignment?.split('-')[1]}-5 z-50 flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg border border-green-900 transition-transform duration-300 hover:scale-110 hover:shadow-2xl`}
                    aria-label="Call Us"
                >
                    <Phone size={22} className="sm:size-6 relative z-10" />
                </Link>
            )} 
        </>

    );
}
