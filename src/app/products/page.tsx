'use client';
import { getProductApi, getProductcategoriesApi, getWishlistApi } from "@/api-endpoints/products";
import { Pagination } from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import { useCartItem } from "@/context/CartItemContext";
import { useProducts } from "@/context/ProductsContext";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useVendor } from "@/context/VendorContext";
import { useWishList } from "@/context/WishListContext";
import { useCategories } from "@/context/CategoriesContext";
import { useIntentions } from "@/context/IntentionsContext";
import EmptyImage from "../../../public/images/emptyImage.png";


export default function Shop() {
    const topRef = useRef<HTMLDivElement>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIntension, setSelectedIntension] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('price-low');
    const ITEMS_PER_PAGE = 12;
    const [showInStock, setShowInStock] = useState(false);
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const router = useRouter();
    const { products, isAuthenticated, isLoading }: any = useProducts();
    const { cartItem }: any = useCartItem();
    const { vendorId }: any = useVendor();
    const [getUserId, setUserId] = useState<string | null>(null);
    const { wishList, wishListLoading }: any = useWishList();
    const emptyImage = EmptyImage;

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);
    const { categories } = useCategories();
    const { intentions }: any = useIntentions();

    const handleCheckboxChange = (categoryId: any) => {
        setSelectedCategory((prev: any) =>
            prev === categoryId ? '' : categoryId
        );
    };
    const handleCheckboxChangeIntension = (name: any) => {
        setSelectedIntension((prev: any) =>
            prev === name ? '' : name)
    }
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filter = products?.data?.products?.filter((item: any) => {
        // Only consider products with status true
        if (
            item?.status !== true &&
            item?.status !== 1 &&
            item?.status !== '1' &&
            item?.status !== 'true' &&
            item?.status !== 'TRUE' &&
            item?.status !== 'active' &&
            item?.status !== 'ACTIVE'
        ) {
            return false;
        }

        const isInStock = item?.stock_quantity > 0;
        const isOutOfStock = item?.stock_quantity === 0;

        const matchesAvailability =
            (!showInStock && !showOutOfStock) || // no filters applied
            (showInStock && isInStock) ||
            (showOutOfStock && isOutOfStock);

        const macthingIntension =
            !selectedIntension || item?.subcategory_name == selectedIntension;
        const matchesCategory =
            !selectedCategory || item?.category === selectedCategory;

        const matchesSearch =
            !searchQuery ||
            item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase());

        return (
            matchesAvailability &&
            matchesCategory &&
            matchesSearch &&
            macthingIntension
        );
    });


    const filteredProducts = Array.isArray(filter) ? filter : [];

    const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
        if (sortOption === 'price-low') {
            return a?.price - b?.price;
        } else if (sortOption === 'price-high') {
            return b?.price - a?.price;
        }
        return 0;
    });


    const totalPages = Math.ceil(sortedProducts?.length / ITEMS_PER_PAGE);
    const paginatedItems = sortedProducts?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const matchingProductsArray = paginatedItems?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.cart?.items?.find(
            (item: any) => item?.product === product?.id
        );

        if (matchingCartItem) {
            return {
                ...product,
                Aid: index,
                cartQty: matchingCartItem?.quantity,
                cartId: matchingCartItem.id,
            };
        }
        return product;
    });


    const finalProductData = matchingProductsArray?.map((item: any) => {
        const wishLists = wishList?.data?.find(
            (wish: any) => wish?.product === item?.id
        );
        return {
            ...item,
            isLike: wishLists ? true : false,
            wishListId: wishLists?.id
        };
    });

    function slugConvert(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');     // Remove non-word characters except hyphens
    }


    return (
        <div className="max-w-[1280px] mx-auto px-2 md:px-10 py-2 md:py-5">
            {/* Page title */}
            <div className="my-2 mb-5 flex">
                <ArrowLeft onClick={() => router.back()} className='text-gray-400 cursor-pointer' />
                <p className="text-md text-gray-400 flex mt-0.5 gap-1">
                    <span className='cursor-pointer flex' onClick={() => router.back()} >
                        Home</span> / Shop</p>

            </div>

            {/* Filter toggle on mobile */}
            <div className="md:hidden mb-6">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border rounded text-sm"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Sidebar Filter (collapsible on mobile) */}
                <aside className={`${showFilters ? 'block' : 'hidden'} md:block space-y-6`}>
                    <div>
                        <h3 className="font-semibold mb-2">Category</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            {categories?.data?.map((category: any) => (
                                <label key={category?.id} className="block">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedCategory === category.id}
                                        onChange={() => handleCheckboxChange(category.id)}
                                    />
                                    {category?.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Availability */}
                    <div>
                        <h3 className="font-semibold mb-2">Availability</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <label className="block">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={showInStock}
                                    onChange={() => setShowInStock(!showInStock)}
                                />
                                In stock
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={showOutOfStock}
                                    onChange={() => setShowOutOfStock(!showOutOfStock)}
                                />
                                Out of stock
                            </label>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Intension</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            {intentions?.map((category: any) => (
                                <label key={category?.name} className="block">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedIntension === category.name}
                                        onChange={() => handleCheckboxChangeIntension(category.name)}
                                    />
                                    {category?.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Clear Button */}
                    <button className="mt-4 px-4 py-1 bg-black text-white text-sm rounded"
                        onClick={() => {
                            setShowInStock(false);
                            setShowOutOfStock(false);
                            setSelectedCategory('');
                            setSearchQuery('');
                            setSelectedIntension('');
                        }}
                    >Clear all</button>
                </aside>

                {/* Product Section */}
                <div className="md:col-span-3" ref={topRef}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-gray-100 p-2 rounded-lg">
                        {/* Search Input */}
                        <div className="w-full sm:w-1/2">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="w-full sm:w-auto">
                            <select
                                className="w-full sm:w-auto bg-white border rounded px-4 py-2 text-sm"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="newest">Sort By</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>

                    </div>



                    {/* Product Grid */}
                    {finalProductData?.length ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6" >
                            {finalProductData.map((product, idx) => (
                                <div
                                    key={idx}
                                    className=""
                                    onClick={() => router.push(`/products/${slugConvert(product?.name)}`)}
                                >
                                    <ProductCard
                                        image={product?.image_urls[0] ?product?.image_urls[0] :EmptyImage}
                                        hoverImage={product?.image_urls?.[1] ? product?.image_urls?.[1] : product?.image_urls?.[0] || emptyImage}
                                        title={product?.name}
                                        price={product?.price}
                                        onAddToCart={() => alert(`Add to cart: ${product?.name}`)}
                                        onView={() => router.push(`/products/${slugConvert(product?.slug_name)}`)}
                                        onWishlist={() => alert(`Wishlist: ${product?.name}`)}
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-20 text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mb-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 13h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v13a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold">No Products Found</h3>
                            <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                        </div>
                    )}



                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page);
                                    topRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            />
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
