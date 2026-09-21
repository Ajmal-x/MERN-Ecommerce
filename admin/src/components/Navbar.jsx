import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Get admin profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${backendUrl}/api/user/admin/profile`,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error(
        "Error loading navbar profile:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logged out successfully.");
  };

  const displayName = profile?.name || "Administrator";
  const displayEmail = profile?.email || "";
  const displayRole =
    profile?.role === "admin" ? "Store Manager" : "Administrator";

  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
            T
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
              Trendify
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Right side */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-gray-50"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* User info */}
            <div className="hidden text-left sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-gray-900">
                {displayName}
              </p>

              <p className="text-xs text-gray-500">
                {displayRole}
              </p>
            </div>

            <ChevronDown
              size={17}
              className={`hidden text-gray-500 transition-transform sm:block ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* Profile header */}
              <div className="border-b border-gray-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {displayEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="p-2">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <User size={18} />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Security */}
              <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3">
                <ShieldCheck
                  size={17}
                  className="text-gray-600"
                />

                <div>
                  <p className="text-xs font-medium text-gray-700">
                    Protected Account
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Administrator access
                  </p>
                </div>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;