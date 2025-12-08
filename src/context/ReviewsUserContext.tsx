"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {  getReviewsApi } from "@/api-endpoints/CartsApi";

// Context
const ReviewsContext = createContext<any | undefined>(undefined);

// Provider
export function ReviewItemProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedCartId = localStorage.getItem('userId');
        setUserId(storedCartId);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["getReviewData", userId],
        queryFn: () => getReviewsApi(`?user_id=${userId}`),
        enabled: !!userId,
    });

    return (
        <ReviewsContext.Provider
            value={{
                ReviewItem: data || [],
                isAuthenticated: !!data,
                isLoading,
            }}
        >
            {children}
        </ReviewsContext.Provider>
    );
}

// Hook
export function useUserReviews() {
    const context = useContext(ReviewsContext);
    if (!context) {
        throw new Error("useUserReviews  must be used within a ReviewsProvider");
    }
    return context;
}
