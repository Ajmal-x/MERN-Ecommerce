import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  MapPin,
  CreditCard,
  CalendarDays,
  Package,
  ChevronDown,
} from "lucide-react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // --------------------------------
  // Fetch Orders
  // --------------------------------

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/order/admin",
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error while fetching orders:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --------------------------------
  // Update Order Status
  // --------------------------------

  const updateStatus = async () => {
    if (!selectedOrder || !newStatus) {
      return;
    }

    try {
      setUpdating(true);

      const response = await axios.put(
        `${backendUrl}/api/order/admin/${selectedOrder._id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Order status updated successfully."
        );

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        setSelectedOrder(null);
        setNewStatus("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error while updating order status:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------
  // Filter Orders
  // --------------------------------

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customerName =
        `${order.address?.firstName || ""} ${
          order.address?.lastName || ""
        }`.toLowerCase();

      const orderId = order._id.toLowerCase();

      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        customerName.includes(searchValue) ||
        orderId.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // --------------------------------
  // Status Style
  // --------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-100";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Processing":
        return "bg-violet-50 text-violet-700 border-violet-100";

      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-16 animate-pulse rounded-2xl bg-white" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-2xl bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* -------------------------------- Header -------------------------------- */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-400">
              Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and track all customer orders.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5">
            <ShoppingBag
              size={17}
              className="text-gray-500"
            />

            <span className="text-sm font-medium text-gray-700">
              {orders.length} total orders
            </span>
          </div>
        </div>

        {/* -------------------------------- Filters -------------------------------- */}

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          {/* Status Filter */}

          <div className="relative md:w-52">
            <SlidersHorizontal
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            >
              <option value="All">
                All Status
              </option>

              <option value="Order Placed">
                Order Placed
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* -------------------------------- Results -------------------------------- */}

        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <ShoppingBag
                size={24}
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No orders found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const totalQuantity =
                order.items.reduce(
                  (total, item) =>
                    total +
                    Number(item.quantity || 0),
                  0
                );

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Order Top */}

                  <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-6 py-5 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        <ShoppingBag
                          size={19}
                          className="text-gray-600"
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-gray-900">
                            #
                            {order._id
                              .slice(-8)
                              .toUpperCase()}
                          </h2>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          <CalendarDays size={13} />

                          {new Date(
                            order.date
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs text-gray-400">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {totalQuantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-950">
                          {currency(order.amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}

                  <div className="grid lg:grid-cols-[1.5fr_1fr]">
                    {/* Products */}

                    <div className="border-b border-gray-100 p-6 lg:border-b-0 lg:border-r">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Order Items
                        </h3>

                        <span className="text-xs text-gray-400">
                          {order.items.length}{" "}
                          product
                          {order.items.length !==
                          1
                            ? "s"
                            : ""}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {order.items.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="flex gap-4"
                            >
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {item.name}
                                </p>

                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                                  <span>
                                    Size:{" "}
                                    {item.size}
                                  </span>

                                  <span>
                                    Qty:{" "}
                                    {
                                      item.quantity
                                    }
                                  </span>
                                </div>

                                <p className="mt-2 text-sm font-semibold text-gray-800">
                                  {currency(
                                    item.price
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Customer Information */}

                    <div className="p-6">
                      <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Customer Details
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Customer
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {
                              order.address
                                ?.firstName
                            }{" "}
                            {
                              order.address
                                ?.lastName
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Delivery Address
                          </p>

                          <div className="mt-1 flex items-start gap-2">
                            <MapPin
                              size={15}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />

                            <p className="text-sm leading-5 text-gray-600">
                              {
                                order.address
                                  ?.street
                              }
                              <br />
                              {
                                order.address
                                  ?.city
                              }
                              ,{" "}
                              {
                                order.address
                                  ?.state
                              }
                              <br />
                              {
                                order.address
                                  ?.country
                              }{" "}
                              {
                                order.address
                                  ?.zipCode
                              }
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Payment
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <CreditCard
                              size={15}
                              className="text-gray-400"
                            />

                            <p className="text-sm text-gray-700">
                              {
                                order.paymentMethod
                              }
                            </p>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                order.payment
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {order.payment
                                ? "Paid"
                                : "Pending"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Contact
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            {
                              order.address
                                ?.mobile
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}

                  <div className="flex flex-col justify-between gap-4 border-t border-gray-100 bg-gray-50/70 px-6 py-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Package size={14} />

                      <span>
                        Order placed on{" "}
                        {new Date(
                          order.date
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(
                            order.status
                          );
                        }}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-700"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------------------- Status Modal -------------------------------- */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Update Order Status
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Order #
                  {selectedOrder._id
                    .slice(-8)
                    .toUpperCase()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setNewStatus("");
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Status */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Order Status
              </label>

              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
              >
                <option value="Order Placed">
                  Order Placed
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Buttons */}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setNewStatus("");
                }}
                disabled={updating}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={updateStatus}
                disabled={updating}
                className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;