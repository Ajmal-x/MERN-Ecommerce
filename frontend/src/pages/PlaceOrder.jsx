import React, { useContext, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import {
  CreditCard,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const {
    cartItems,
    products,
    delivery_fee,
    getCartAmount,
    setCartItems,
    navigate,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    mobile: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login before placing an order");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const orderItems = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];

          if (quantity > 0) {
            const product = products.find(
              (item) => item._id === productId
            );

            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: Array.isArray(product.image)
                  ? product.image[0]
                  : product.image,
                size,
                quantity,
              });
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setLoading(false);
        return;
      }

      const amount = getCartAmount() + delivery_fee;

      const response = await axios.post(
        `${BACKEND_URL}/api/order`,
        {
          items: orderItems,
          amount,
          address: formData,
          paymentMethod: method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully!");

        setCartItems({});
        localStorage.setItem("cartItems", JSON.stringify({}));

        navigate("/orders");
      } else {
        toast.error(
          response.data.message || "Failed to place order"
        );
      }
    } catch (error) {
      console.error(
        "Order error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while placing your order"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-gray-500";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="border-t border-gray-100 pt-8 sm:pt-10"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        {/* Left Side */}
        <div>
          <div className="mb-8">
            <Title text1="DELIVERY" text2="INFORMATION" />

            <p className="mt-2 text-sm text-gray-500">
              Enter your delivery details to complete your order.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 sm:p-7">
            {/* Name */}
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Full Name
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  required
                  className={inputClass}
                  type="text"
                  placeholder="First Name"
                />

                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  required
                  className={inputClass}
                  type="text"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Email Address
              </label>

              <input
                name="email"
                value={formData.email}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="email"
                placeholder="hello@example.com"
              />
            </div>

            {/* Address */}
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <MapPin size={15} className="text-gray-500" />

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Delivery Address
                </p>
              </div>

              <input
                name="street"
                value={formData.street}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="text"
                placeholder="Street address"
              />
            </div>

            {/* City / State */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="city"
                value={formData.city}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="text"
                placeholder="City"
              />

              <input
                name="state"
                value={formData.state}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="text"
                placeholder="State / Province"
              />
            </div>

            {/* Zip / Country */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="zipCode"
                value={formData.zipCode}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="text"
                placeholder="ZIP / Postal Code"
              />

              <input
                name="country"
                value={formData.country}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="text"
                placeholder="Country"
              />
            </div>

            {/* Mobile */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Phone size={15} className="text-gray-500" />

                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Mobile Number
                </p>
              </div>

              <input
                name="mobile"
                value={formData.mobile}
                onChange={onChangeHandler}
                required
                className={inputClass}
                type="tel"
                placeholder="+93 700 000 000"
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div>
          {/* Cart Total */}
          <CartTotal />

          {/* Payment Methods */}
          <div className="mt-10">
            <Title text1="PAYMENT" text2="METHODS" />

            <div className="mt-5 space-y-3">
              {/* Stripe */}
              <button
                type="button"
                onClick={() => setMethod("stripe")}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  method === "stripe"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      method === "stripe"
                        ? "border-black bg-black"
                        : "border-gray-300"
                    }`}
                  />

                  <img
                    src={assets.stripe_logo}
                    alt="Stripe"
                    className="h-5"
                  />
                </div>

                <CreditCard
                  size={18}
                  className="text-gray-400"
                />
              </button>

              {/* Razorpay */}
              <button
                type="button"
                onClick={() => setMethod("razorpay")}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  method === "razorpay"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      method === "razorpay"
                        ? "border-black bg-black"
                        : "border-gray-300"
                    }`}
                  />

                  <img
                    src={assets.razorpay_logo}
                    alt="Razorpay"
                    className="h-5"
                  />
                </div>

                <CreditCard
                  size={18}
                  className="text-gray-400"
                />
              </button>

              {/* COD */}
              <button
                type="button"
                onClick={() => setMethod("cod")}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  method === "cod"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      method === "cod"
                        ? "border-black bg-black"
                        : "border-gray-300"
                    }`}
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </span>
                </div>

                <ShoppingBag
                  size={18}
                  className="text-gray-400"
                />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-gray-400">
            By placing your order, you confirm that the information
            provided above is correct.
          </p>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;