import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([
    null,
    null,
    null,
    null,
  ]);

  // =========================
  // Fetch Product
  // =========================
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/product/single`,
        {
          productId: id,
        }
      );

      if (!response.data.success) {
        toast.error(
          response.data.message || "Failed to load product"
        );
        return;
      }

      const product = response.data.product;

      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setSubCategory(product.subCategory || "");
      setPrice(product.price || "");
      setSizes(product.sizes || []);
      setBestSeller(product.bestSeller || false);
      setExistingImages(product.image || []);
    } catch (error) {
      console.error("Error while loading product:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // =========================
  // Image Change
  // =========================
  const handleImageChange = (index, file) => {
    if (!file) return;

    setNewImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  // =========================
  // Remove New Image
  // =========================
  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  // =========================
  // Toggle Size
  // =========================
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  // =========================
  // Submit Update
  // =========================
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      // Add new images
      newImages.forEach((image, index) => {
        if (image) {
          formData.append(`image${index + 1}`, image);
        }
      });

      // Add product information
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      console.log("Updating product...");
      console.log("Product ID:", id);
      console.log("Backend URL:", backendUrl);

      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        toast.success(
          response.data.message || "Product updated successfully"
        );

        setTimeout(() => {
          navigate("/list");
        }, 500);
      } else {
        toast.error(
          response.data.message || "Failed to update product"
        );
      }
    } catch (error) {
      console.error("========== UPDATE ERROR ==========");
      console.error("FULL ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);
      console.error("MESSAGE:", error.message);
      console.error("=================================");

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2
            size={20}
            className="animate-spin"
          />
          <span>Loading product...</span>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update your product information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/list")}
          className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      >
        {/* Images */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Product Images
          </h2>

          <div className="flex flex-wrap gap-4">
            {[0, 1, 2, 3].map((index) => {
              const newImage = newImages[index];
              const existingImage = existingImages[index];

              return (
                <div
                  key={index}
                  className="relative"
                >
                  <label
                    htmlFor={`image${index + 1}`}
                    className="block cursor-pointer"
                  >
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-500">
                      {newImage ? (
                        <img
                          src={URL.createObjectURL(newImage)}
                          alt="New product"
                          className="h-full w-full object-cover"
                        />
                      ) : existingImage ? (
                        <img
                          src={existingImage}
                          alt="Product"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="px-3 text-center text-xs text-gray-400">
                          Add Image
                        </span>
                      )}
                    </div>
                  </label>

                  <input
                    id={`image${index + 1}`}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) =>
                      handleImageChange(
                        index,
                        event.target.files?.[0]
                      )
                    }
                  />

                  {newImage && (
                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(index)
                      }
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Select new images only if you want to replace
            the current product images.
          </p>
        </div>

        {/* Name */}
        <div className="mt-7">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Product Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter product name"
            className="w-full max-w-2xl rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Product Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter product description"
            rows={5}
            className="w-full max-w-2xl resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
            required
          />
        </div>

        {/* Category / Sub Category / Price */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {/* Sub Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Sub Category
            </label>

            <select
              value={subCategory}
              onChange={(event) =>
                setSubCategory(event.target.value)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
              required
            >
              <option value="">
                Select Sub Category
              </option>
              <option value="Topwear">Topwear</option>
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
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Price
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              placeholder="Enter price"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-500"
              required
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-6">
          <label className="mb-3 block text-sm font-semibold text-gray-700">
            Product Sizes
          </label>

          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL"].map(
              (size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    sizes.includes(size)
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              )
            )}
          </div>
        </div>

        {/* Best Seller */}
        <div className="mt-6">
          <label className="flex w-fit cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(event) =>
                setBestSeller(event.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm text-gray-700">
              Add to Best Seller
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/list")}
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-black"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

export default Edit;