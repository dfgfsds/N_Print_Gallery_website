'use client'
import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import logo from "../../public/images/logo.webp"
import {
  ShoppingCart,
  User,
  Headphones,
  ChevronDown,
  Search,
  Menu,
  X,
  Heart,
} from "lucide-react";
import Link from "next/link";
import LoginModal from "@/app/LoginModal/page";
import { useVendor } from "@/context/VendorContext";
import { useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { slugConvert } from "../../lib/utils";
import { useUser } from "@/context/UserContext";
import { useCartItem } from "@/context/CartItemContext";
import QuickSearch from "./SearchBar";
import QuoteModal from "./QuoteModal";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInmodal, setSignInModal] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { vendorId } = useVendor();
  const router = useRouter();
  const { categories } = useCategories();
  const { products } = useProducts();
  const { user } = useUser();
  const { cartItem }: any = useCartItem();
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);
  const cartCount = cartItem?.data?.cart?.items?.length || 0;
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const menuItems =
    categories?.data
      ?.filter((cat: any) => cat.is_featured === true)
    ?.map((cat: any) => {
      // all products in this category
      const categoryProducts = products?.data?.products?.filter(
        (p: any) => p.category === cat.id 
      );

      // if category has subcategories
      const megaMenu =
        cat.subcategories?.length > 0
          ? cat.subcategories.map((sub: any) => {
            const subProducts = categoryProducts?.filter(
              (p: any) => p.subcategory === sub.id
            );
            return {
              heading: sub.name,
              products: subProducts || [],
            };
          })
          : [
            // no subcategories → attach products directly
            {
              heading: cat.name,
              products: categoryProducts || [],
            },
          ];

      return {
        title: cat.name,
        megaMenu,
      };
    }) || [];

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMenu = (i: any) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(i);
  };

  const closeMenuWithDelay = () => {
    // small delay so moving between button <-> dropdown doesn't flicker
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      closeTimeoutRef.current = null;
    }, 120);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("userId"));
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.clear();
  //   window.location.href = "/";
  // };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setOpenModal(false);
    window.location.href = "/";
    // router.push('/login');
  };


  const [showBar, setShowBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowBar(false); // scroll down → hide
      } else {
        setShowBar(true); // scroll up → show
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    // <div className="sticky top-0 z-50 bg-white border-b">
    <div className="fixed top-0 left-0 w-full z-50">
      {/* TOP NAV */}
      {/* <div className="flex items-center justify-between px-3 md:px-8 py-3 md:py-4"> */}
      <div
        className={`bg-white shadow-sm flex items-center justify-between px-3 md:px-8 py-3 md:py-4 transition-transform duration-300 z-[9998] ${showBar ? "translate-y-0" : "-translate-y-full"
          }`}
      >

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center space-x-2 cursor-pointer pr-2"
        >
          {/* <Image
            src={logo}
            alt="Logo"
            width={140}
            height={50}
            className="cursor-pointer w-32  md:w-40 h-16"
          /> */}
          <Image
            src={logo}
            alt="Logo"
            width={140}
            height={50}
            className="cursor-pointer h-12 md:h-16 xl:h-20 w-auto object-contain"

          />

        </div>

        {/* Menu (Desktop only) */}

        {/* Search Bar */}
        <QuickSearch products={products?.data} />


        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          {/* Enquiry + Quote */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 pr-1">
              <Headphones className="w-4 h-4" />
              <span>
                For Enquiries <b>+91 9092036699</b>
              </span>
            </div>
            <button
              onClick={() => setQuoteOpen(!quoteOpen)}
              className="px-3 py-1 bg-[#13cea1] text-white rounded-xs hover:bg-[#0fb38b] text-sm"
            >
              Get a Quote
            </button>
          </div>


          {/* User Dropdown */}
          <div className="relative z-50" ref={dropdownRef}>
            {isLoggedIn ? (
              <div className="flex items-center space-x-6">
                <span
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center space-x-1 cursor-pointer select-none"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.data?.name || "User"} </span>
                </span>
                <span
                  onClick={() => router.push("/wishlist")}
                  className="flex items-center gap-1 space-x-1 cursor-pointer select-none"
                >
                  Wishlist  <Heart size={18} />
                </span>
              </div>
            ) : (
              <span
                onClick={() => setSignInModal(true)}
                className="flex items-center space-x-1 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </span>
            )}

            {/* Dropdown Menu */}
            {open && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md overflow-hidden shadow-md z-[9999]">
                 {/* <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md z-50"> */}
                <ul className="flex flex-col text-sm ">
                  <li
                    onClick={() => router.push("/profile?tab=account")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Profile
                  </li>
                  <li
                    onClick={() => router.push("/profile?tab=orders")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Orders
                  </li>
                  <li
                    onClick={() => router.push("/profile?tab=addresses")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Address
                  </li>
                  <li
                    // onClick={handleLogout}
                    onClick={() => setOpenModal(true)}
                    className="px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}

          </div>

          {/* Cart */}
          <Link href="/cart" className="flex items-center space-x-1 pr-10">
            <ShoppingCart className="w-4 h-4" />
            <span>Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
          </Link>
        </div>

        {/* Mobile Section */}
        <div className="flex items-center space-x-2 md:hidden">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span
                onClick={() => router.push("/profile?tab=account")}
                className="flex items-center space-x-1 cursor-pointer select-none"
              >
                <User className="w-4 h-4" />
                <span>{user?.data?.name || "User"} </span>
              </span>
              <span
                onClick={() => router.push("/wishlist")}
                className="flex items-center space-x-1 cursor-pointer select-none"
              >
                <Heart className="w-4 h-4" />
                <span>WishList </span>
              </span>
            </div>
          ) : (
            <span
              onClick={() => setSignInModal(true)}
              className="flex items-center space-x-1 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </span>
          )}

          <Link href="/cart" className="flex items-center space-x-1">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">{cartCount > 0 ? `(${cartCount})` : ""}</span>
          </Link>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#13cea1] text-white px-6 py-4 ">

          <div className="space-y-4">
            <button
              className="flex justify-between w-full items-center font-medium"
              onClick={() => {
                router.push('/shop');
                setMobileOpen(false);
              }}
            >
              All products
            </button>
            {menuItems?.map((item: any, idx: number) => {
              // Only render if there are products
              const hasProducts = item?.megaMenu?.some((col: any) => col.products?.length > 0);
              if (!hasProducts) return null;

              return (
                <div key={idx} className="border-b border-[#13cea1] pb-2">
                  <button
                    className="flex justify-between w-full items-center font-medium"
                    onClick={() =>
                      setActiveMenu(activeMenu === idx ? null : idx)
                    }
                  >
                    {item?.title}
                    <ChevronDown
                      size={16}
                      className={`transform transition ${activeMenu === idx ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {activeMenu === idx && (
                    <div className="mt-2 pl-4 space-y-3">
                      {item?.megaMenu?.map((col: any, i: number) => (
                        <div key={i}>
                          <h4 className="font-semibold">{col?.heading}</h4>
                          <ul className="pl-2 text-sm space-y-1">
                            {col.products.map((link: any, j: number) => (
                              <li key={j}>
                                <Link
                                  href={`/products/${slugConvert(link?.slug_name)}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="hover:text-gray-200">
                                  {link?.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* BOTTOM RED NAV (Desktop) */}
      {/* <div className="bg-[#13cea1] text-white px-6 py-4 relative hidden md:block"> */}
      <div
        className={`bg-[#13cea1] text-white px-6 py-4 hidden md:block transition-all duration-300 ${showBar ? "" : "fixed top-0 left-0 w-full"
          }`}
      >
        <div className="container mx-auto flex justify-center gap-10 py-3">
          <Link
            href="/shop"
            className="flex items-center text-lg gap-1 font-medium cursor-pointer"
          >
            All products
          </Link>
          {menuItems?.slice(0, 7)?.map((item: any, idx: number) => {
            const hasProducts = item?.megaMenu?.some((col: any) => col.products?.length > 0);
            if (!hasProducts) return null;

            const populatedMegaMenu = item?.megaMenu?.filter((col: any) => col.products?.length > 0);

            return (
              <div
                key={idx}
                className="relative inline-block"
                onMouseEnter={() => openMenu(idx)}
                onMouseLeave={() => closeMenuWithDelay()}
              >
                <button className="flex items-center text-lg gap-1 font-medium cursor-pointer">
                  {item?.title}
                  <ChevronDown size={16} />
                </button>
                {/* <div
                  className={`
      absolute top-full mt-7 z-40 bg-white text-black shadow-lg p-4 
      transform origin-top transition-all duration-200 ease-in-out min-w-40
      ${activeMenu === idx ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"}
    `}
                  style={{ left: '0' }}
                > */}
                <div
  className={`
    absolute top-full mt-7 z-40 bg-white text-black shadow-lg p-4 
    transform origin-top transition-all duration-200 ease-in-out
    max-w-[95vw] overflow-x-auto
    ${activeMenu === idx ? "scale-y-100 opacity-100 pointer-events-auto" : "scale-y-0 opacity-0 pointer-events-none"}
  `}
  style={{
    left: "50%",
    transform: "translateX(-50%)",
  }}
>
<div className="grid grid-flow-col auto-cols-max gap-x-10">

                  {/* <div className={`grid grid-flow-col auto-cols-min gap-x-10`}> */}
                    {populatedMegaMenu?.map((col: any, i: number) => (
                      <div key={i}>
                        {col?.heading && (
                          <h4 className="font-semibold mb-2 text-md whitespace-nowrap">{col.heading}</h4>

                        )}
                        {col.products?.length > 0 && (
                          <ul className="space-y-2 text-md text-slate-600">
                            {col.products.map((link: any, j: number) => (
                              <li key={j}>
                                <Link
                                  href={`/products/${slugConvert(link?.slug_name)}`}
                                  className="hover:text-[#4db49c] transition whitespace-nowrap"
                                >
                                  {link?.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
      )}
      {quoteOpen && <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />}

      {openModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to sign out?
            </p>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-600"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}