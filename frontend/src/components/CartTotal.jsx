import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } =
    useContext(ShopContext);

  const subtotal = getCartAmount();
  const shippingFee = subtotal === 0 ? 0 : delivery_fee;
  const total = subtotal + shippingFee;

  const formatPrice = (price) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-7">
      <div className="mb-6">
        <Title text1="CART" text2="TOTAL" />
      </div>

      <div className="space-y-4 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-gray-500">Subtotal</p>

          <p className="font-medium text-gray-900">
            {currency}
            {formatPrice(subtotal)}
          </p>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Shipping */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-gray-500">Shipping Fee</p>

            {shippingFee === 0 && (
              <p className="mt-1 text-xs text-gray-400">
                Free shipping
              </p>
            )}
          </div>

          <p className="font-medium text-gray-900">
            {currency}
            {formatPrice(shippingFee)}
          </p>
        </div>

        <div className="h-px bg-gray-200" />

        {/* Total */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-base font-semibold text-gray-900">
            Total Amount
          </p>

          <p className="text-xl font-semibold text-gray-950">
            {currency}
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;