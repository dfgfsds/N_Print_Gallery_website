'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'INR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (cur: Currency) => void;
    convertPrice: (priceInINR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Example exchange rate — make dynamic via API if needed
const RUPEES_PER_DOLLAR = 85;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>('INR');

    const convertPrice = (priceInINR: number) => {
        if (currency === 'INR') return `₹${priceInINR.toFixed(2)}`; // e.g. ₹349 → ₹349.00

        // USD price = INR price ÷ 80
        const usd = priceInINR / RUPEES_PER_DOLLAR;
        return `$ ${usd.toFixed(2)}`;      // e.g. ₹349 → $4.36
    };
    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
    return context;
};
