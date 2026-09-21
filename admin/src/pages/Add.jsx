import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  Upload,
  ImagePlus,
  X,
  Check,
  Plus,
  Trash2,
  PackagePlus,
  Tag,
  Layers3,
  DollarSign,
  Star,
} from "lucide-react";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageStates = [
    {
      value: image1,
      setter: setImage1,
      id: "image1",
      label: "Main image",
    },
    {
      value: image2,
      setter: setImage2,
      id: "image2",
      label: "Image 02",
    },
    {
      value: image3,
      setter: setImage3,
      id: "image3",
      label: "Image 03",
    },
    {
      value: image4,
      setter: setImage4,
      id: "image4",
      label: "Image 04",
    },
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1) {
      toast.error("Please upload the main product image.");
      return;
    }

    if (sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);

    setName("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
  };

  const removeImage = (setter) => {
    setter(null);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="min-h-full w-full bg-[#f8f8f7] px-4 py-6 sm:px-6 lg:px-8">
      <form
        onSubmit={onSubmitHandler}
        className="mx-auto max-w-6xl"
      >
        {/* =================================
            Header
        ================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              <PackagePlus size={15} />
              Product Management
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              Add new product
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Create a new product and publish it to your
              store catalog.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Ready to publish
          </div>
        </div>

        {/* =================================
            Main Grid
        ================================= */}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* =================================
              Left Column
          ================================= */}

          <div className="space-y-6">
            {/* Product Information */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-white">
                  <Tag size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Product information
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Basic information about your product.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Product name
                  </label>

                  <input
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    value={name}
                    type="text"
                    placeholder="e.g. Premium Cotton Oversized T-Shirt"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                  />
                </div>

                {/* Description */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Description
                    </label>

                    <span className="text-[10px] text-gray-400">
                      {description.length}/500
                    </span>
                  </div>

                  <textarea
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, 500))
                    }
                    value={description}
                    rows={5}
                    placeholder="Describe the material, fit, style and other important details..."
                    required
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                  />
                </div>
              </div>
            </section>

            {/* Category & Pricing */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                  <Layers3 size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Organization & pricing
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Categorize your product and set its price.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                {/* Category */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Category
                  </label>

                  <select
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    value={category}
                    required
                    className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                {/* Sub Category */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Sub category
                  </label>

                  <select
                    onChange={(e) =>
                      setSubCategory(e.target.value)
                    }
                    value={subCategory}
                    required
                    className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                  >
                    <option value="">
                      Select sub category
                    </option>

                    <option value="Topwear">
                      Topwear
                    </option>

                    <option value="Bottomwear">
                      Bottomwear
                    </option>

                    <option value="Winterwear">
                      Winterwear
                    </option>
                  </select>
                </div>

                {/* Price */}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Price
                  </label>

                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      value={price}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:bg-white focus:ring-4 focus:ring-gray-950/5"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Sizes */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                  <span className="text-sm font-bold">
                    S
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-950">
                    Available sizes
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Select all sizes currently available.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "XXL"].map(
                  (size) => {
                    const selected =
                      sizes.includes(size);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          toggleSize(size)
                        }
                        className={`group relative flex h-11 min-w-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-all duration-200 ${
                          selected
                            ? "border-gray-950 bg-gray-950 text-white shadow-lg shadow-gray-950/10"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        {selected && (
                          <Check
                            size={13}
                            className="mr-1"
                          />
                        )}

                        {size}
                      </button>
                    );
                  }
                )}
              </div>

              {sizes.length > 0 && (
                <p className="mt-4 text-xs text-gray-400">
                  {sizes.length}{" "}
                  {sizes.length === 1
                    ? "size"
                    : "sizes"}{" "}
                  selected
                </p>
              )}
            </section>

            {/* Best Seller */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-7">
              <button
                type="button"
                onClick={() =>
                  setBestSeller((prev) => !prev)
                }
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                  bestSeller
                    ? "border-gray-950 bg-gray-950 text-white"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      bestSeller
                        ? "bg-white/10"
                        : "bg-white"
                    }`}
                  >
                    <Star
                      size={18}
                      className={
                        bestSeller
                          ? "fill-white text-white"
                          : "text-gray-500"
                      }
                    />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        bestSeller
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Add to Best Sellers
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        bestSeller
                          ? "text-white/60"
                          : "text-gray-400"
                      }`}
                    >
                      Highlight this product in the
                      Best Sellers section.
                    </p>
                  </div>
                </div>

                <div
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                    bestSeller
                      ? "bg-white"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full transition-transform ${
                      bestSeller
                        ? "translate-x-5 bg-gray-950"
                        : "translate-x-0 bg-white"
                    }`}
                  />
                </div>
              </button>
            </section>
          </div>

          {/* =================================
              Right Column
          ================================= */}

          <div className="space-y-6">
            {/* Image Upload */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:p-6 lg:sticky lg:top-24">
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-950">
                      Product media
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Upload up to 4 product images.
                    </p>
                  </div>

                  <ImagePlus
                    size={19}
                    className="text-gray-400"
                  />
                </div>
              </div>

              {/* Main Image */}

              {imageStates.map(
                (
                  {
                    value,
                    setter,
                    id,
                    label,
                  },
                  index
                ) => (
                  <div
                    key={id}
                    className={
                      index === 0
                        ? "mb-3"
                        : "mb-3"
                    }
                  >
                    <label
                      htmlFor={id}
                      className={`group relative block cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                        value
                          ? "border-gray-200 bg-gray-50"
                          : index === 0
                          ? "border-dashed border-gray-300 bg-gray-50 hover:border-gray-950 hover:bg-gray-100"
                          : "border-dashed border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                      } ${
                        index === 0
                          ? "aspect-[4/3]"
                          : "aspect-[4/1]"
                      }`}
                    >
                      {value ? (
                        <>
                          <img
                            src={URL.createObjectURL(value)}
                            alt={label}
                            className={`h-full w-full object-cover ${
                              index === 0
                                ? ""
                                : "object-center"
                            }`}
                          />

                          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-900 backdrop-blur">
                            {index === 0
                              ? "Main image"
                              : `Image 0${index + 1}`}
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              removeImage(setter);
                            }}
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                            aria-label={`Remove ${label}`}
                          >
                            <X size={15} />
                          </button>

                          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-lg">
                            <Check size={14} />
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                          <div
                            className={`mb-3 flex items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm ${
                              index === 0
                                ? "h-12 w-12"
                                : "h-9 w-9"
                            }`}
                          >
                            {index === 0 ? (
                              <Upload size={20} />
                            ) : (
                              <Plus size={17} />
                            )}
                          </div>

                          <p className="text-xs font-semibold text-gray-700">
                            {index === 0
                              ? "Upload main image"
                              : "Add another image"}
                          </p>

                          {index === 0 && (
                            <p className="mt-1 text-[10px] text-gray-400">
                              PNG, JPG or WEBP
                            </p>
                          )}
                        </div>
                      )}

                      <input
                        id={id}
                        type="file"
                        hidden
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0];

                          if (file) {
                            setter(file);
                          }

                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                )
              )}

              <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Images uploaded
                  </span>

                  <span className="font-semibold text-gray-900">
                    {
                      imageStates.filter(
                        (item) => item.value
                      ).length
                    }{" "}
                    / 4
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* =================================
            Bottom Actions
        ================================= */}

        <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            Reset details
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-950 px-7 text-sm font-semibold text-white shadow-lg shadow-gray-950/10 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Publishing...
              </>
            ) : (
              <>
                <PackagePlus size={17} />
                Add product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;