import React, { useContext, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
  } = useContext(ShopContext);

  const location = useLocation();
  const inputRef = useRef(null);

  const isCollectionPage =
    location.pathname === "/collection";

  // Hide search when leaving collection page
  useEffect(() => {
    if (!isCollectionPage) {
      setShowSearch(false);
    }
  }, [isCollectionPage, setShowSearch]);

  // Focus input when search opens
  useEffect(() => {
    if (showSearch && isCollectionPage) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [showSearch, isCollectionPage]);

  if (!showSearch || !isCollectionPage) {
    return null;
  }

  const closeSearch = () => {
    setShowSearch(false);
    setSearch("");
  };

  return (
    <div className="border-y border-gray-100 bg-gray-50/80 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        {/* Search Input */}
        <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-gray-400">
          <Search
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-gray-400"
          />

          <input
            ref={inputRef}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-400 transition hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Close Search */}
        <button
          type="button"
          onClick={closeSearch}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-gray-400 hover:text-black"
          aria-label="Close search"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;