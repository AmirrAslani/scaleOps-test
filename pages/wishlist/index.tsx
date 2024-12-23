import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '@/store/wishlistSlice';
import { useRouter } from "next/router";

type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  };

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(storedWishlist);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleRemoveFromWishlist = (id: number) => {
    dispatch(removeFromWishlist(id)); // حذف محصول از لیست علاقه‌مندی‌ها
    window.location.reload();
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Wishlist</h2>
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden animate__animated animate__fadeIn">
              <div className="bg-gray-100 p-4">
                <img src={product.image} alt={product.title} className="h-48 mx-auto object-contain" />
              </div>
              <div className="flex flex-col flex-grow p-4">
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description.slice(0, 100)}...</p>
                <p className="text-lg font-bold text-dark-600t">Price: <span className="text-md text-gray-600">${product.price}</span></p>
              </div>
              <button
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                onClick={() => handleRemoveFromWishlist(product.id)}
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 w-full">No items in your wishlist!</div>
      )}
    </div>
  );
};

export default Wishlist;
