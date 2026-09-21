import React, { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  RotateCcw,
  Check,
} from "lucide-react";

const categories = ["Men", "Women", "Kids"];
const subCategories = ["Topwear", "Bottomwear", "Winterwear"];

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // =========================
  // Category Filter
  // =========================

  const toggleCategory = (event) => {
    const value = event.target.value;

    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // =========================
  // Sub Category Filter
  // =========================

  const toggleSubCategory = (event) => {
    const value = event.target.value;

    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // =========================
  // Filter + Search + Sort
  // =========================

  const filterProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (showSearch && search.trim()) {
      const searchValue = search.toLowerCase().trim();

      result = result.filter((item) =>
        item.name?.toLowerCase().includes(searchValue)
      );
    }

    // Category
    if (category.length > 0) {
      result = result.filter((item) =>
        category.includes(item.category)
      );
    }

    // Sub Category
    if (subCategory.length > 0) {
      result = result.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Sort
    if (sortType === "low-high") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortType === "high-low") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    return result;
  }, [
    products,
    search,
    showSearch,
    category,
    subCategory,
    sortType,
  ]);

  // =========================
  // Active Filters
  // =========================

  const activeFilterCount =
    category.length + subCategory.length;

  const hasActiveFilters =
    activeFilterCount > 0 ||
    (showSearch && search.trim()) ||
    sortType !== "relevant";

  // =========================
  // Clear Filters
  // =========================

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
  };

  // =========================
  // Remove Category
  // =========================

  const removeCategory = (item) => {
    setCategory((prev) =>
      prev.filter((value) => value !== item)
    );
  };

  // =========================
  // Remove Sub Category
  // =========================

  const removeSubCategory = (item) => {
    setSubCategory((prev) =>
      prev.filter((value) => value !== item)
    );
  };

  return (
    <section className="min-h-screen border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* =========================
            Collection Header
        ========================= */}

        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-7 bg-gray-900" />

                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-gray-500">
                  Collection
                </span>
              </div>

              <h1 className="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                All Products
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Discover our latest collection.
              </p>
            </div>

            <div className="text-sm text-gray-500">
              {filterProducts.length}{" "}
              {filterProducts.length === 1
                ? "product"
                : "products"}
            </div>

          </div>
        </div>

        {/* =========================
            Search Result
        ========================= */}

        {showSearch && search.trim() && (
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <Search
              size={16}
              className="shrink-0 text-gray-400"
            />

            <p className="text-sm text-gray-600">
              Results for{" "}
              <span className="font-medium text-gray-900">
                "{search.trim()}"
              </span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* =========================
              Desktop Sidebar
          ========================= */}

          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-28">

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Filters
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Refine your selection
                  </p>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200">

                {/* Category */}

                <div className="border-b border-gray-200 py-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Category
                  </p>

                  <div className="space-y-1">
                    {categories.map((item) => {
                      const checked = category.includes(item);

                      return (
                        <label
                          key={item}
                          className="group flex cursor-pointer items-center justify-between px-1 py-2.5"
                        >
                          <span
                            className={`text-sm transition ${
                              checked
                                ? "font-medium text-gray-900"
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}
                          >
                            {item}
                          </span>

                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                              checked
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-300 bg-white text-transparent group-hover:border-gray-400"
                            }`}
                          >
                            <Check
                              size={12}
                              strokeWidth={3}
                            />
                          </span>

                          <input
                            type="checkbox"
                            value={item}
                            checked={checked}
                            onChange={toggleCategory}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Type */}

                <div className="py-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Type
                  </p>

                  <div className="space-y-1">
                    {subCategories.map((item) => {
                      const checked =
                        subCategory.includes(item);

                      return (
                        <label
                          key={item}
                          className="group flex cursor-pointer items-center justify-between px-1 py-2.5"
                        >
                          <span
                            className={`text-sm transition ${
                              checked
                                ? "font-medium text-gray-900"
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}
                          >
                            {item}
                          </span>

                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                              checked
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-300 bg-white text-transparent group-hover:border-gray-400"
                            }`}
                          >
                            <Check
                              size={12}
                              strokeWidth={3}
                            />
                          </span>

                          <input
                            type="checkbox"
                            value={item}
                            checked={checked}
                            onChange={toggleSubCategory}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* =========================
              Main Content
          ========================= */}

          <div className="min-w-0 flex-1">

            {/* Toolbar */}

            <div className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  {/* Mobile Filter */}

                  <button
                    type="button"
                    onClick={() => setShowFilter(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 lg:hidden"
                  >
                    <SlidersHorizontal size={16} />

                    Filters

                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1.5 text-[10px] font-semibold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <p className="hidden text-sm text-gray-500 sm:block">
                    {filterProducts.length}{" "}
                    {filterProducts.length === 1
                      ? "product"
                      : "products"}
                  </p>
                </div>

                {/* Sort */}

                <div className="relative">
                  <select
                    value={sortType}
                    onChange={(event) =>
                      setSortType(event.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-700 outline-none transition hover:border-gray-300 focus:border-gray-500 sm:w-56"
                  >
                    <option value="relevant">
                      Sort by: Relevant
                    </option>

                    <option value="low-high">
                      Price: Low to High
                    </option>

                    <option value="high-low">
                      Price: High to Low
                    </option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

              </div>

              {/* Active Filters */}

              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2">

                  {category.map((item) => (
                    <button
                      key={`category-${item}`}
                      type="button"
                      onClick={() => removeCategory(item)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      {item}
                      <X size={13} />
                    </button>
                  ))}

                  {subCategory.map((item) => (
                    <button
                      key={`subcategory-${item}`}
                      type="button"
                      onClick={() =>
                        removeSubCategory(item)
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      {item}
                      <X size={13} />
                    </button>
                  ))}

                  {sortType !== "relevant" && (
                    <button
                      type="button"
                      onClick={() =>
                        setSortType("relevant")
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      {sortType === "low-high"
                        ? "Price: Low to High"
                        : "Price: High to Low"}

                      <X size={13} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-gray-400 transition hover:text-gray-900"
                  >
                    <RotateCcw size={13} />
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* =========================
                Products
            ========================= */}

            {filterProducts.length === 0 ? (
              <div className="flex min-h-[420px] items-center justify-center border border-gray-200 bg-gray-50 px-6">
                <div className="max-w-sm text-center">

                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white">
                    <Search
                      size={22}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="text-lg font-medium text-gray-900">
                    No products found
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    We couldn't find anything matching your
                    current search or filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    <RotateCcw size={15} />
                    Reset filters
                  </button>

                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filterProducts.map((item) => (
                  <ProductItem
                    key={item._id || item.id}
                    id={item._id || item.id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* =========================
          Mobile Filter
      ========================= */}

      {showFilter && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowFilter(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">

            {/* Drawer Header */}

            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4">
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-base font-semibold text-gray-950">
                    Filters
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Refine your collection
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilter(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                >
                  <X size={18} />
                </button>

              </div>
            </div>

            <div className="space-y-7 p-5">

              {/* Category */}

              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Category
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {categories.map((item) => {
                    const checked = category.includes(item);

                    return (
                      <label
                        key={item}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                          checked
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        {item}

                        {checked && <Check size={16} />}

                        <input
                          type="checkbox"
                          value={item}
                          checked={checked}
                          onChange={toggleCategory}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Type */}

              <div>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Type
                </p>

                <div className="space-y-2">
                  {subCategories.map((item) => {
                    const checked =
                      subCategory.includes(item);

                    return (
                      <label
                        key={item}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                          checked
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        {item}

                        {checked && <Check size={16} />}

                        <input
                          type="checkbox"
                          value={item}
                          checked={checked}
                          onChange={toggleSubCategory}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Actions */}

              <div className="sticky bottom-0 -mx-5 border-t border-gray-100 bg-white p-5">
                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Clear all
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFilter(false)}
                    className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Show {filterProducts.length} products
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Collection;