import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          tempData.push({
            _id: productId,
            size,
            quantity: cartItems[productId][size],
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  const isCartEmpty = cartData.length === 0;

  const increaseQuantity = (item) => {
    updateQuantity(item._id, item.size, item.quantity + 1);
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.size, item.quantity - 1);
    }
  };

  return (
    <section className="border-t border-gray-100 pt-8 sm:pt-10">
      {/* Header */}
      <div className="mb-8">
        <Title text1="YOUR" text2="CART" />

        {!isCartEmpty && (
          <p className="mt-2 text-sm text-gray-500">
            Review your selected products before checkout.
          </p>
        )}
      </div>

      {/* Empty Cart */}
      {isCartEmpty ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <ShoppingBag size={26} className="text-gray-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="mt-6 rounded-xl bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            {cartData.map((item) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              if (!productData) return null;

              const productImage = Array.isArray(productData.image)
                ? productData.image[0]
                : productData.image;

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="border-b border-gray-100 p-4 last:border-b-0 sm:p-6"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-24">
                      <img
                        src={productImage}
                        alt={productData.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 sm:text-base">
                            {productData.name}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-gray-900">
                            {currency}
                            {productData.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item._id, item.size, 0)
                          }
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-red-500"
                          aria-label="Remove product"
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </div>

                      {/* Size + Quantity */}
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Size:
                          </span>

                          <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                            {item.size}
                          </span>
                        </div>

                        <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item)}
                            disabled={item.quantity <= 1}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item)}
                            className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="my-16 flex justify-end">
            <div className="w-full sm:w-[450px]">
              <CartTotal />

              <button
                type="button"
                onClick={() => navigate("/place-order")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;