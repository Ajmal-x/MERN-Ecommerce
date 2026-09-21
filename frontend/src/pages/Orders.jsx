import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import { Package, Truck, CalendarDays } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${BACKEND_URL}/api/order`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error(
        "Error loading orders:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="border-t border-gray-100 pt-8 sm:pt-10">
      {/* Header */}
      <div className="mb-8">
        <Title text1="YOUR" text2="ORDERS" />

        <p className="mt-2 text-sm text-gray-500">
          View and track your recent orders.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
        </div>
      ) : orders.length === 0 ? (
        /* Empty Orders */
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <Package size={26} className="text-gray-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            No orders yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your orders will appear here after you make a purchase.
          </p>
        </div>
      ) : (
        /* Orders */
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package size={17} className="text-gray-500" />

                    <div>
                      <p className="text-xs text-gray-400">
                        Order
                      </p>

                      <p className="max-w-[180px] truncate text-sm font-medium text-gray-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="hidden h-8 w-px bg-gray-200 sm:block" />

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="text-gray-500"
                    />

                    <div>
                      <p className="text-xs text-gray-400">
                        Date
                      </p>

                      <p className="text-sm text-gray-700">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex gap-4 p-5 sm:p-6"
                  >
                    {/* Product Image */}
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 sm:text-base">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-base font-semibold text-gray-900">
                            $
                            {item.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="rounded-md bg-gray-50 px-3 py-1.5">
                            Size: {item.size}
                          </span>

                          <span className="rounded-md bg-gray-50 px-3 py-1.5">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-gray-400">
                        Product ID: {item.productId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col gap-4 border-t border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-xs text-gray-400">
                    Payment Method
                  </p>

                  <p className="mt-1 text-sm font-medium uppercase text-gray-700">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div>
                    <p className="text-xs text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-950">
                      $
                      {order.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Truck size={15} />
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Orders;