"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileAccount from "@/components/profile/ProfileAccount";
import ProfileAddresses from "@/components/profile/ProfileAddresses";
import ProfileOrders from "@/components/profile/ProfileOrders";

export default function ProfilePageClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (tabParam === "addresses" || tabParam === "account") {
      setActiveTab(tabParam);
    } else {
      setActiveTab("orders");
    }
  }, [tabParam]);
  

  return (
    <div className="bg-[#F8F7F2] min-h-screen">
      <div className="container mx-auto px-4 py-5">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tab Buttons */}
          <div className="border-b">
            <div className="container px-6">
              <div className="flex h-14 gap-4 items-center">
                {[
                  { label: "Order History", value: "orders" },
                  { label: "Addresses", value: "addresses" },
                  { label: "Account Info", value: "account" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-1 pb-2 text-sm font-bold transition border-b-2 ${
                      activeTab === tab.value
                        ? "border-[#13cea1] text-[#13cea1]"
                        : "border-transparent text-gray-600 hover:text-[#4db49c]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "orders" && <ProfileOrders />}
            {activeTab === "addresses" && <ProfileAddresses />}
            {activeTab === "account" && <ProfileAccount />}
          </div>
        </div>
      </div>
    </div>
  );
}
