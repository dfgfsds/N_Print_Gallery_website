"use client";
import { createContext, useContext,  ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductsReviewsApi } from "@/api-endpoints/CartsApi";
import { useVendor } from "./VendorContext";

// Context
const ReviewsContext = createContext<any | undefined>(undefined);

// Provider
export function ReviewProductsProvider({ children }: { children: ReactNode }) {

    const { vendorId } = useVendor();

    const { data, isLoading } = useQuery({
        queryKey: ["getProductReviewData", vendorId],
        queryFn: () => getProductsReviewsApi(`?vendor_id=${vendorId}`),
        enabled: !!vendorId,
    });

    return (
        <ReviewsContext.Provider
            value={{
                productReviewItem: data || [],
                isAuthenticated: !!data,
                isLoading,
            }}
        >
            {children}
        </ReviewsContext.Provider>
    );
}

// Hook
export function useReviews() {
    const context = useContext(ReviewsContext);
    if (!context) {
        throw new Error("useReviews must be used within a productReviewsProvider");
    }
    return context;
}
