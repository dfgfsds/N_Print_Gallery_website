"use client";

import { ReactNode } from "react";
import { VendorProvider } from "@/context/VendorContext";
import { WishListProvider } from "@/context/WishListContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { UserProvider } from "@/context/UserContext";
import { CartItemProvider } from "@/context/CartItemContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { IntentionProvider } from "@/context/IntentionsContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { PolicyProvider } from "@/context/PolicyContext";
import { ReviewItemProvider } from "@/context/ReviewsUserContext";
import { ReviewProductsProvider } from "@/context/ReviewsContext";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ReactQueryProvider>
            <VendorProvider>
                <WishListProvider>
                    <ProductsProvider>
                        <UserProvider>
                            <CartItemProvider>
                                <CategoriesProvider>
                                    <IntentionProvider>
                                        <CurrencyProvider>
                                            <PolicyProvider>
                                                <ReviewItemProvider>
                                                    <ReviewProductsProvider>
                                                        {children}
                                                    </ReviewProductsProvider>
                                                </ReviewItemProvider>
                                            </PolicyProvider>
                                        </CurrencyProvider>
                                    </IntentionProvider>
                                </CategoriesProvider>
                            </CartItemProvider>
                        </UserProvider>
                    </ProductsProvider>
                </WishListProvider>
            </VendorProvider>
        </ReactQueryProvider>
    );
}
