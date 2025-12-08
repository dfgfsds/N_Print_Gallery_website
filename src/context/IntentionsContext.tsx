"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubCategoriesApi } from "@/api-endpoints/products";
import { useVendor } from "./VendorContext";

interface IntentionContextType {
    intentions: any; // Categories data
    isAuthenticated: boolean; // Authentication status
    isLoading: boolean; // Loading state
    error: any; // Error state
}


const IntentionContext = createContext<IntentionContextType | undefined>(undefined);

export function IntentionProvider({ children }: any) {
    const { vendorId } = useVendor();
    const { data, isLoading, error } = useQuery({
        queryKey: ["getCategoriesData", vendorId],
        queryFn: () => getSubCategoriesApi(`/${vendorId}`),
        enabled: !!vendorId
    });



    return (
        <IntentionContext.Provider
            value={{
                intentions: data?.data[0]?.subcategories || [],
                isAuthenticated: !!data,
                isLoading,
                error,
            }}
        >
            {children}
        </IntentionContext.Provider>
    );
}



export function useIntentions() {
    const context = useContext(IntentionContext);
    if (context === undefined) {
        throw new Error("useIntentions must be used within a IntentionProvider");
    }
    return context;
}
