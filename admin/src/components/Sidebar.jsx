import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  PlusCircle,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Store,
  ShieldCheck,
} from "lucide-react";

const Sidebar = ({ setToken }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Add Product",
      path: "/add",
      icon: PlusCircle,
    },
    {
      name: "Products List",
      path: "/list",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ShoppingBag,
      badge: "New", // می‌توانید جهت نمایش بج متغیر بگذارید
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (setToken) setToken("");
    navigate("/login");
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 border-r border-gray-100 bg-white transition-all duration-300 ease-in-out lg:flex lg:flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header / Logo */}
      <div className="relative flex h-20 items-center justify-between border-b border-gray-100 px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-md">
            <Store size={20} strokeWidth={1.8} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-200">
              <span className="text-base font-bold tracking-tight text-gray-950">
                Trendify
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                <ShieldCheck size={12} /> Admin Panel
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-black"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        <div>
          {!isCollapsed && (
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Management
            </p>
          )}

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-black text-white shadow-lg shadow-black/10"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                    } ${isCollapsed ? "justify-center px-0" : ""}`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.2 : 1.7}
                        className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                      />

                      {!isCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}

                      {/* Optional Badge */}
                      {item.badge && !isCollapsed && (
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-white text-black"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer / Profile & Actions */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition duration-200 ${
              isActive
                ? "bg-gray-100 text-black font-semibold"
                : "text-gray-600 hover:bg-gray-100 hover:text-black"
            } ${isCollapsed ? "justify-center px-0" : ""}`
          }
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings size={19} strokeWidth={1.8} className="shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        {/* User Card (When Expanded) */}
        {!isCollapsed && (
          <div className="my-2 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 font-semibold text-xs text-white">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900">
                Admin User
              </p>
              <p className="truncate text-[10px] text-gray-400">
                admin@trendify.com
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-gray-600 transition duration-200 hover:bg-red-50 hover:text-red-600 ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={19} strokeWidth={1.8} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;