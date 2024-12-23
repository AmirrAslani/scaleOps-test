import React, { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToWishlist } from '@/store/wishlistSlice';
import { useDispatch } from 'react-redux';
import IconSearch from '@/components/Icon/IconSearch';
import { useRouter } from 'next/router';

// Types
type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
};

type ProductsResponse = {
    products: Product[];
    nextPage: number | null;
};

// Fetch Products
const fetchProducts = async ({ pageParam = 1 }): Promise<ProductsResponse> => {
    const response = await axios.get(`https://fakestoreapi.com/products?_page=${pageParam}&_limit=10`);
    return {
        products: response.data,
        nextPage: response.data.length ? pageParam + 1 : null,
    };
};


const ProductCards: React.FC<{ product: Product }> = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery('products', fetchProducts, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<string>('');

    // const handleAddToCartClick = (product: Product): void => {
    //     setSelectedProduct(product);
    //     setIsDialogOpen(true);
    // };
    const handleAddToCartClick = (product: Product): void => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            toast.warn('Please login to add items to your cart.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            router.push('/login');
        }

        setSelectedProduct(product);
        setIsDialogOpen(true);
    };
    const addToCart = (product: Product): void => {
        // خواندن سبد خرید از localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        // اضافه کردن محصول جدید به سبد خرید
        cart.push(product);
        // ذخیره سبد خرید در localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const handleConfirmAddToCart = (): void => {
        if (selectedProduct) {
            addToCart(selectedProduct); // اضافه کردن به سبد خرید
            toast.success(`${selectedProduct.title} has been added to your cart!`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setSelectedProduct(null);
            setIsDialogOpen(false);
        }
    };

      const handleAddToWishlist = (product: Product) => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            toast.warn('Please login to add items to your wishlist.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            router.push('/login');
            return;
        }

        dispatch(addToWishlist(product));
        toast.success(`${product.title} added to wishlist!`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleDialogClose = (): void => {
        setSelectedProduct(null);
        setIsDialogOpen(false);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSortOrder(event.target.value);
    };

    // Filter and sort products
    const filteredProducts = data?.pages
        .flatMap((page) => page.products)
        .filter((product) => product.title.toLowerCase().includes(searchQuery))
        .sort((a, b) => {
            if (sortOrder === 'lowest') return a.price - b.price;
            if (sortOrder === 'highest') return b.price - a.price;
            return 0;
        }) || [];

    const handleLoadMore = (): void => {
        if (hasNextPage) fetchNextPage();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500 text-center">Error while fetching data!</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <div className="mb-6 flex gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        className="peer form-input w-full bg-gray-100 border border-gray-300 rounded-lg placeholder:tracking-widest ltr:pl-9 rtl:pl-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                        placeholder="Search product name"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button
                        type="button"
                        className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto"
                    >
                        <IconSearch className="mx-auto" />
                    </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex-1">
                    <select
                        className="form-select w-full bg-gray-100 border border-gray-300 rounded-lg p-2"
                        value={sortOrder}
                        onChange={handleSortChange}
                    >
                        <option value="">Sort By</option>
                        <option value="lowest">Price: Low to High</option>
                        <option value="highest">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div key={product.id} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden animate__animated animate__fadeIn">
                            <div className="bg-gray-100 p-4"
                             style={{
                                animationDelay: `${index * 0.1}s`, // تاخیر برای هر کارت
                            }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-48 mx-auto object-contain"
                                />
                            </div>
                            <div className="flex flex-col flex-grow p-4">
                                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{product.description.slice(0, 100)}...</p>
                                <p className="text-lg font-bold text-dark-600t">Price: <span className='text-md text-gray-600'>${product.price}</span></p>
                            </div>
                            <button onClick={() => handleAddToWishlist(product)}>Add to wishlist</button>

                            <div className="p-4">
                                <button
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                    onClick={() => handleAddToCartClick(product)}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 w-full">No products found!</div>
                )}
            </div>

            {isFetchingNextPage && (
                <div className="flex justify-center items-center mt-6">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            )}

            {filteredProducts.length > 0 && (
                <>
                    {hasNextPage && (
                        <div className="flex justify-center mt-6">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                onClick={handleLoadMore}
                                disabled={isFetchingNextPage}
                            >
                                See more
                            </button>
                        </div>
                    )}
                </>
            )}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-bold">Adding to cart</h2>
                        </div>
                        <div className="p-4">
                            <p>
                                Are you sure about adding <strong>{selectedProduct?.title}</strong> to your cart?
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
                            <button
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 focus:outline-none"
                                onClick={handleDialogClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                onClick={handleConfirmAddToCart}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCards;
