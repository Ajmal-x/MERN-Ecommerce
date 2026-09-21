import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Package,
  Plus,
  ShoppingBag,
  Users,
  RefreshCw,
  TrendingUp,
  CircleDollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { backendUrl, currency } from "../App";

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("7");
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        backendUrl + "/api/order/admin",
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error(
        "Dashboard error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const isValidOrder = (order) => {
    return order.status !== "Cancelled";
  };

  const getOrderDate = (order) => {
    const date = new Date(order.date);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const getPeriodStart = (days) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1));
    return date;
  };

  const getPreviousPeriodStart = (days) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days * 2 + 1);
    return date;
  };

  const getPreviousPeriodEnd = (days) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days);
    return date;
  };

  const formatChange = (current, previous) => {
    if (previous === 0 && current === 0) {
      return "0%";
    }

    if (previous === 0) {
      return "+100%";
    }

    const change = ((current - previous) / previous) * 100;

    if (!Number.isFinite(change)) {
      return "0%";
    }

    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // --------------------------------------------------
  // Current period
  // --------------------------------------------------

  const currentPeriodOrders = useMemo(() => {
    const days = Number(period);
    const start = getPeriodStart(days);

    return orders.filter((order) => {
      const date = getOrderDate(order);

      return (
        date &&
        date >= start &&
        isValidOrder(order)
      );
    });
  }, [orders, period]);

  // --------------------------------------------------
  // Previous period
  // --------------------------------------------------

  const previousPeriodOrders = useMemo(() => {
    const days = Number(period);
    const start = getPreviousPeriodStart(days);
    const end = getPreviousPeriodEnd(days);

    return orders.filter((order) => {
      const date = getOrderDate(order);

      return (
        date &&
        date >= start &&
        date < end &&
        isValidOrder(order)
      );
    });
  }, [orders, period]);

  // --------------------------------------------------
  // Revenue
  // --------------------------------------------------

  const totalRevenue = useMemo(() => {
    return currentPeriodOrders.reduce(
      (total, order) =>
        total + Number(order.amount || 0),
      0
    );
  }, [currentPeriodOrders]);

  const previousRevenue = useMemo(() => {
    return previousPeriodOrders.reduce(
      (total, order) =>
        total + Number(order.amount || 0),
      0
    );
  }, [previousPeriodOrders]);

  // --------------------------------------------------
  // Orders
  // --------------------------------------------------

  const totalOrders = currentPeriodOrders.length;

  const previousOrders = previousPeriodOrders.length;

  // --------------------------------------------------
  // Products sold
  // --------------------------------------------------

  const totalItems = useMemo(() => {
    return currentPeriodOrders.reduce(
      (total, order) => {
        return (
          total +
          (order.items || []).reduce(
            (sum, item) =>
              sum + Number(item.quantity || 0),
            0
          )
        );
      },
      0
    );
  }, [currentPeriodOrders]);

  const previousItems = useMemo(() => {
    return previousPeriodOrders.reduce(
      (total, order) => {
        return (
          total +
          (order.items || []).reduce(
            (sum, item) =>
              sum + Number(item.quantity || 0),
            0
          )
        );
      },
      0
    );
  }, [previousPeriodOrders]);

  // --------------------------------------------------
  // Pending orders
  // --------------------------------------------------

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
  ).length;

  // --------------------------------------------------
  // Customer count
  // --------------------------------------------------

  const customerCount = useMemo(() => {
    const customers = new Set();

    orders.forEach((order) => {
      if (order.userId) {
        customers.add(String(order.userId));
      } else if (order.email) {
        customers.add(order.email);
      } else if (order.address?.email) {
        customers.add(order.address.email);
      } else if (order.address?.firstName) {
        customers.add(
          `${order.address.firstName}-${order.address.lastName || ""}`
        );
      }
    });

    return customers.size;
  }, [orders]);

  // --------------------------------------------------
  // Chart
  // --------------------------------------------------

  const chartData = useMemo(() => {
    const days = Number(period);
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const revenue = orders
        .filter((order) => {
          const orderDate = getOrderDate(order);

          if (!orderDate || !isValidOrder(order)) {
            return false;
          }

          orderDate.setHours(0, 0, 0, 0);

          return (
            orderDate.getTime() === date.getTime()
          );
        })
        .reduce(
          (total, order) =>
            total + Number(order.amount || 0),
          0
        );

      result.push({
        name:
          days <= 7
            ? date.toLocaleDateString("en-US", {
                weekday: "short",
              })
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
        revenue,
      });
    }

    return result;
  }, [orders, period]);

  // --------------------------------------------------
  // Top products
  // --------------------------------------------------

  const topProducts = useMemo(() => {
    const productMap = {};

    currentPeriodOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const productId =
          item.productId ||
          item._id ||
          item.name;

        if (!productMap[productId]) {
          productMap[productId] = {
            name: item.name,
            image: Array.isArray(item.image)
              ? item.image[0]
              : item.image,
            quantity: 0,
            revenue: 0,
          };
        }

        productMap[productId].quantity += Number(
          item.quantity || 0
        );

        productMap[productId].revenue +=
          Number(item.price || 0) *
          Number(item.quantity || 0);
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [currentPeriodOrders]);

  // --------------------------------------------------
  // Stats
  // --------------------------------------------------

  const stats = [
    {
      title: "Total Revenue",
      value: currency(totalRevenue),
      change: formatChange(
        totalRevenue,
        previousRevenue
      ),
      icon: CircleDollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      positive: totalRevenue >= previousRevenue,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: formatChange(
        totalOrders,
        previousOrders
      ),
      icon: ShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      positive: totalOrders >= previousOrders,
    },
    {
      title: "Products Sold",
      value: totalItems.toLocaleString(),
      change: formatChange(
        totalItems,
        previousItems
      ),
      icon: Package,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      positive: totalItems >= previousItems,
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      change:
        pendingOrders > 0
          ? "Needs attention"
          : "All clear",
      icon: Clock3,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      positive: pendingOrders === 0,
    },
  ];

  const periodLabel =
    period === "7"
      ? "Last 7 days"
      : period === "30"
      ? "Last 30 days"
      : "Last 90 days";

  return (
    <div className="min-h-full bg-[#f8f8f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* -------------------------------- Header -------------------------------- */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <TrendingUp size={14} />
              Store overview
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Good afternoon, Admin
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Here's what's happening with your store.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Refresh */}

            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Refresh dashboard"
            >
              <RefreshCw
                size={17}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
            </button>

            {/* Period */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowPeriodMenu(
                    (prev) => !prev
                  )
                }
                className="flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:text-gray-950"
              >
                {periodLabel}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showPeriodMenu
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showPeriodMenu && (
                <div className="absolute right-0 top-14 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                  {[
                    {
                      value: "7",
                      label: "Last 7 days",
                    },
                    {
                      value: "30",
                      label: "Last 30 days",
                    },
                    {
                      value: "90",
                      label: "Last 90 days",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setPeriod(item.value);
                        setShowPeriodMenu(false);
                      }}
                      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        period === item.value
                          ? "bg-gray-950 font-medium text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add product */}

            <Link
              to="/add"
              className="flex h-11 items-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              <Plus size={17} />
              Add product
            </Link>
          </div>
        </div>

        {/* -------------------------------- Stats -------------------------------- */}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[170px] animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_3px_20px_rgba(0,0,0,0.025)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                    >
                      <Icon
                        size={20}
                        className={stat.iconColor}
                        strokeWidth={1.8}
                      />
                    </div>

                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        stat.positive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {stat.positive ? (
                        <ArrowUpRight size={13} />
                      ) : (
                        <ArrowDownRight size={13} />
                      )}

                      {stat.change}
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.08em] text-gray-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
                    {stat.value}
                  </h2>
                </div>
              );
            })}
          </div>
        )}

        {/* -------------------------------- Main Analytics -------------------------------- */}

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* Revenue */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-950">
                    Revenue overview
                  </h2>

                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-500">
                    {periodLabel}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Revenue generated from valid orders
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 sm:flex">
                <span className="h-2 w-2 rounded-full bg-gray-950" />
                Revenue
              </div>
            </div>

            <div className="h-[330px] p-4 sm:p-5">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 8,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#111827"
                        stopOpacity={0.16}
                      />
                      <stop
                        offset="100%"
                        stopColor="#111827"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f1f1"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                    }}
                    tickFormatter={(value) =>
                      `$${value}`
                    }
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#d1d5db",
                      strokeDasharray: "4 4",
                    }}
                    contentStyle={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [
                      currency(value),
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#111827"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 3,
                      stroke: "#ffffff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold text-gray-950">
                  Recent activity
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Latest activity in your store
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <Clock3
                  size={17}
                  className="text-gray-500"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center p-8 text-center text-sm text-gray-400">
                  No activity yet.
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-start gap-3 px-5 py-4 sm:px-6"
                  >
                    <div className="relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <ShoppingBag
                        size={14}
                        className="text-gray-600"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">
                        New order received
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Order #
                        {order._id
                          ?.slice(-8)
                          .toUpperCase()}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {getOrderDate(order)
                          ? getOrderDate(
                              order
                            ).toLocaleString()
                          : "Unknown date"}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-gray-900">
                      {currency(order.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------- Bottom -------------------------------- */}

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Top Products */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold text-gray-950">
                  Top products
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Best selling products
                </p>
              </div>

              <Package
                size={19}
                className="text-gray-400"
              />
            </div>

            <div className="divide-y divide-gray-100">
              {topProducts.length === 0 ? (
                <div className="p-10 text-center">
                  <Package
                    size={28}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-sm text-gray-400">
                    No products sold yet.
                  </p>
                </div>
              ) : (
                topProducts.map(
                  (product, index) => (
                    <div
                      key={`${product.name}-${index}`}
                      className="flex items-center gap-4 px-5 py-4 sm:px-6"
                    >
                      <span className="w-5 text-xs font-semibold text-gray-300">
                        0{index + 1}
                      </span>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package
                            size={17}
                            className="text-gray-400"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {product.quantity} units sold
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        {currency(
                          product.revenue
                        )}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>

          {/* Recent Orders */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <h2 className="font-semibold text-gray-950">
                  Recent orders
                </h2>

                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Latest customer orders
                </p>
              </div>

              <ShoppingBag
                size={19}
                className="text-gray-400"
              />
            </div>

            <div className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-400">
                  No orders yet.
                </div>
              ) : (
                orders.slice(0, 5).map((order) => {
                  const firstName =
                    order.address?.firstName ||
                    "";

                  const lastName =
                    order.address?.lastName ||
                    "";

                  const initials =
                    `${firstName.charAt(
                      0
                    )}${lastName.charAt(
                      0
                    )}`.toUpperCase();

                  return (
                    <div
                      key={order._id}
                      className="flex items-center gap-3 px-5 py-4 sm:gap-4 sm:px-6"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-950 text-[10px] font-bold text-white">
                        {initials || "CU"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {firstName ||
                          lastName
                            ? `${firstName} ${lastName}`
                            : "Customer"}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          #
                          {order._id
                            ?.slice(-8)
                            .toUpperCase()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {currency(
                            order.amount
                          )}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            order.status ===
                            "Delivered"
                              ? "bg-emerald-50 text-emerald-600"
                              : order.status ===
                                "Cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {order.status ||
                            "Processing"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------- Footer Insight -------------------------------- */}

        {!loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_3px_20px_rgba(0,0,0,0.025)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Users
                  size={20}
                  className="text-blue-600"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Customers
                </p>

                <p className="mt-1 text-xl font-bold text-gray-950">
                  {customerCount.toLocaleString()}
                </p>
              </div>

              <div className="ml-auto text-right">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Total
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  Unique customers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-950 p-5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <TrendingUp
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Store performance
                </p>

                <p className="mt-1 text-sm font-medium">
                  {pendingOrders > 0
                    ? `${pendingOrders} orders need your attention`
                    : "Everything is up to date"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;