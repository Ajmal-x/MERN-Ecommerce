import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Package,
  User,
  ArrowUpRight,
} from "lucide-react";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);

  const { setShowSearch, getCartCount, setCartItems, navigate } =
    useContext(ShopContext);

  // =========================
  // Sync User State
  // =========================
  useEffect(() => {
    const syncUser = () => {
      const savedUser = localStorage.getItem("user");
      try {
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  // =========================
  // Close Menus on Click Outside & Escape Key
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowProfileMenu(false);
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // =========================
  // Lock Scroll When Mobile Menu Open
  // =========================
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // =========================
  // Close Mobile Menu on Desktop Resize
  // =========================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setVisible(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =========================
  // Logout Handler
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCartItems({});
    localStorage.setItem("cartItems", JSON.stringify({}));

    setUser(null);
    setShowProfileMenu(false);
    setVisible(false);
    navigate("/");
  };

  const closeMenus = () => {
    setShowProfileMenu(false);
    setVisible(false);
  };

  const openSearch = () => {
    setShowSearch(true);
    setVisible(false);
  };

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/collection", label: "COLLECTION" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  return (
    <>
      {/* ========================= Header ========================= */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" onClick={closeMenus} className="group shrink-0">
            <img
              src={assets.logo}
              className="w-28 transition duration-300 group-hover:opacity-75 sm:w-32 lg:w-36"
              alt="Trendify"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? "text-black" : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-3 right-3 h-[1.5px] bg-black transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <button
              type="button"
              onClick={openSearch}
              className="group flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-black"
              aria-label="Search products"
            >
              <Search
                size={19}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Desktop Profile Dropdown */}
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className={`group flex h-10 items-center gap-2 rounded-full px-2.5 transition-all duration-300 ${
                  showProfileMenu ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
                aria-label="Account menu"
                aria-expanded={showProfileMenu}
              >
                <UserRound size={19} strokeWidth={1.7} />
                {user && (
                  <span className="hidden max-w-20 truncate text-xs font-medium text-gray-700 lg:block">
                    {user.name || "Account"}
                  </span>
                )}
              </button>

              {/* Profile Menu Popup */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 origin-top-right animate-in fade-in zoom-in-95 duration-200 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                  {user ? (
                    <>
                      <div className="border-b border-gray-100 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                            <User size={18} strokeWidth={1.7} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-950">
                              {user.name || "User"}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={closeMenus}
                          className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-black"
                        >
                          <span className="flex items-center gap-3">
                            <UserRound size={16} /> Profile
                          </span>
                          <ArrowUpRight size={15} className="opacity-0 transition group-hover:opacity-100" />
                        </Link>

                        <Link
                          to="/orders"
                          onClick={closeMenus}
                          className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-black"
                        >
                          <span className="flex items-center gap-3">
                            <Package size={16} /> Orders
                          </span>
                          <ArrowUpRight size={15} className="opacity-0 transition group-hover:opacity-100" />
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2">
                      <Link
                        to="/login"
                        onClick={closeMenus}
                        className="group flex items-center justify-between rounded-xl bg-black px-4 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
                      >
                        <span>Login</span>
                        <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Profile Link */}
            <Link
              to={user ? "/profile" : "/login"}
              onClick={() => setVisible(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-black sm:hidden"
              aria-label={user ? "Profile" : "Login"}
            >
              <UserRound size={19} strokeWidth={1.7} />
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="group relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-black"
              aria-label="Shopping cart"
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {getCartCount() > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-1 text-[8px] font-bold leading-none text-white ring-2 ring-white">
                  {getCartCount() > 99 ? "99+" : getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-black sm:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================= Mobile Menu Drawer ========================= */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 sm:hidden ${
          visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setVisible(false)}
      >
        <div
          className={`absolute right-0 top-0 flex h-full w-[88%] max-w-[390px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
            <Link to="/" onClick={closeMenus}>
              <img src={assets.logo} className="w-28" alt="Trendify" />
            </Link>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-700 transition hover:bg-black hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.7} />
            </button>
          </div>

          {/* Mobile Search Input */}
          <div className="px-5 pt-5">
            <button
              type="button"
              onClick={openSearch}
              className="flex w-full items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3.5 text-left text-sm text-gray-400 transition hover:bg-gray-100"
            >
              <Search size={18} strokeWidth={1.7} />
              <span>Search products...</span>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-5 pt-6">
            <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Navigation
            </p>
            <div className="space-y-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-4 py-4 text-sm font-medium transition-all duration-300 ${
                      isActive ? "bg-black text-white shadow-lg" : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <ChevronRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Account Section */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Account
              </p>
              {user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                      <User size={17} strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-950">{user.name || "User"}</p>
                      <p className="mt-0.5 truncate text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setVisible(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-black"
                  >
                    <UserRound size={17} /> My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setVisible(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-black"
                  >
                    <Package size={17} /> My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={17} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setVisible(false)}
                  className="flex items-center justify-between rounded-2xl bg-black px-4 py-4 text-sm font-medium text-white shadow-lg transition hover:bg-gray-800"
                >
                  <span>Login to your account</span>
                  <ArrowUpRight size={18} />
                </Link>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="shrink-0 border-t border-gray-100 px-5 py-5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-gray-400">
              <span>Trendify</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;