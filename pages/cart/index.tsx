import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const CartPage: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    // چک کردن اینکه در محیط مرورگر هستیم
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  
  const handleRemoveFromCart = (productId: number): void => {
    // خواندن سبد خرید از localStorage
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      // فیلتر کردن محصول برای حذف
      const updatedCart = cart.filter((product: Product) => product.id !== productId);
      // ذخیره سبد خرید جدید در localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart); // بروزرسانی state
      toast.success('Product has been removed from your cart', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Cart:</h2>

      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((product: Product, index: number) => (
            <div
            key={`${product.id}-${index}`}
              className="flex justify-between items-center bg-gray-100 p-4 mb-4 rounded-lg animate__animated animate__slideInRight"
            >
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-16 w-16 object-contain mr-4"
                />
                <div>
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                onClick={() => handleRemoveFromCart(product.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
              onClick={() => router.push('/checkout')}
            >
              Continue Shpoing
            </button>
            <p className="font-semibold">
              Total: $
              {cartItems.reduce((total: number, product: Product) => total + product.price, 0)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 w-full">Cart is empty</div>
      )}
    </div>
  );
};

export default CartPage;
