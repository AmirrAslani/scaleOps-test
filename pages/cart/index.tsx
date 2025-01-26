import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const CartPage: React.FC = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart: Product[] = JSON.parse(storedCart);
        const groupedCart = groupByProduct(parsedCart);
        setCartItems(groupedCart);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const groupByProduct = (products: Product[]): CartItem[] => {
    const grouped: { [key: number]: CartItem } = {};

    products.forEach((product) => {
      if (grouped[product.id]) {
        grouped[product.id].quantity += 1;
      } else {
        grouped[product.id] = { product, quantity: 1 };
      }
    });

    return Object.values(grouped);
  };

  const handleRemoveFromCart = (productId: number): void => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        const updatedCart = cart.filter((product: Product) => product.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(groupByProduct(updatedCart));
      }
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Cart:</h2>

      {cartItems.length > 0 ? (
        <div>
          {cartItems.map(({ product, quantity }, index) => (
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
                  <p className="text-sm text-gray-600">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {quantity}</p>
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
              Continue Shopping
            </button>
            <p className="font-semibold">
              Total: $
              {cartItems.reduce(
                (total, { product, quantity }) => total + product.price * quantity,
                0
              )}
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
