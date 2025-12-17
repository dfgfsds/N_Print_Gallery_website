'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

interface Product {
    id: string | number;
    name: string;
    price: string | number;
    image_urls: string[];
    description?: string;
    tags?: string[];
    category?: { name?: string };
    status?: any;
    slug_name:any;
}

interface Props {
    products: any;
    label?: string;
    defaultOpen?: boolean;
}

const QuickSearch: React.FC<Props> = ({ products, label = 'Search...', defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: Product[]; related: Product[] }>({
        products: [],
        related: [],
    });
    const [showDropdown, setShowDropdown] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { convertPrice } = useCurrency();

    const openSearch = useCallback(() => setIsOpen(true), []);
    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setShowDropdown(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const tid = setTimeout(() => {
            if (query.trim().length > 0) {
                fetchSearchResults(query.trim());
            } else {
                setShowDropdown(false);
            }
        }, 300);
        return () => clearTimeout(tid);
    }, [query, isOpen]);

    const fetchSearchResults = (term: string) => {
        if (!products) return;
        const lower = term.toLowerCase();
        const activeProducts = products?.products?.filter((p:any) => {
            const s = p?.status;
            return (
                s === true ||
                s === 1 ||
                s === '1' ||
                s === 'true' ||
                s === 'TRUE' ||
                s === 'active' ||
                s === 'ACTIVE'
            );
        });

        const titleMatches = activeProducts.filter((p:any) => p.name.toLowerCase().includes(lower));

        const related = activeProducts
            .filter(
                (p:any) =>
                    !titleMatches.includes(p) &&
                    (p.description?.toLowerCase().includes(lower) ||
                        p.tags?.some((t:any) => t.toLowerCase().includes(lower)) ||
                        p.category?.name?.toLowerCase().includes(lower))
            )
            .slice(0, 5);

        setResults({ products: titleMatches, related });
        setShowDropdown(true);
    };

    function slugConvert(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');     // Remove non-word characters except hyphens
    }


    return (
        <div
            ref={wrapperRef}
            className="relative hidden lg:inline-block"
            onMouseEnter={() => {
                setIsOpen(true);
                requestAnimationFrame(() => inputRef.current?.focus());
            }}
            onMouseLeave={() => {
                if (!query) closeSearch();
            }}
        >
            {/* Search Bar */}
            {/* <div
                className={`flex items-center bg-white overflow-hidden 
                    transition-all duration-500 ease-in-out p-2 w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] border rounded-full
                    ${isOpen ? 'w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] border rounded-full' : ''}
                `}
            > */}
            <div
                className={`flex items-center bg-white overflow-hidden rounded-full
    transition-all duration-500 ease-in-out p-2 
    w-[100px] sm:w-[150px] md:w-[200px] lg:w-[350px] xl:w-[500px] 2xl:w-[600px] border 
    ${isOpen ? '   w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] xl:w-[300px] border' : ''}
  `}
            >

                {/* {!isOpen && <span>Search</span>} <Search size={22} className='ml-2' /> */}
                <input
                    ref={inputRef}
                    type="text"
                    className={`w-full text-sm px-2 py-1 focus:outline-none transition-all duration-500 ease-in-out ${!isOpen ? '' : ''}`}
                    placeholder="Search awesome products...✨"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {/* {isOpen && (
                    <button
                        type="button"
                        onClick={() => (query ? setQuery('') : closeSearch())}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )} */}
            </div>

            {/* Dropdown */}
            {isOpen && showDropdown && (
                <div
                    className="absolute left-0 right-0 z-50 bg-white border shadow-md mt-2 rounded-md max-h-[400px] overflow-y-auto text-sm animate-in fade-in slide-in-from-top-2"
                    role="listbox"
                >
                    {results?.products?.length > 0 ? (
                        <>
                            <p className="px-4 py-2 font-bold text-gray-500 border-b">PRODUCTS</p>

                            {results?.products?.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        setQuery('');
                                        // setIsOpen(false);
                                        router.push(`/products/${(item?.slug_name)}`);
                                    }}
                                    className="flex gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    role="option"
                                >
                                    {item?.image_urls?.[0] && (
                                        <Image
                                            src={item?.image_urls[0]}
                                            alt={item?.name}
                                            width={50}
                                            height={50}
                                            className="rounded object-cover"
                                        />
                                    )}

                                    <div>
                                        <p className="font-medium">{item?.name}</p>
                                        <p className="text-red-700">{convertPrice(Number(item?.price))}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                            No products found
                            {query && (
                                <>
                                    &nbsp;for&nbsp;
                                    <span className="font-semibold">“{query}”</span>.
                                </>
                            )}
                            <br />
                            Please try another keyword.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuickSearch;
