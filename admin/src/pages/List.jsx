import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [listProducts, setListProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchListProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${backendUrl}/api/product/list`
      );

      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(
          response.data.message || "Failed to fetch products"
        );
      }
    } catch (error) {
      console.error("Error while fetching products:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setListProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product._id !== id
          )
        );
      } else {
        toast.error(
          response.data.message || "Failed to delete product"
        );
      }
    } catch (error) {
      console.error("Error while removing product:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">
          Products
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your store products.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2
              size={20}
              className="animate-spin"
            />
            <span>Loading products...</span>
          </div>
        </div>
      ) : listProducts.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              No products found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add your first product to get started.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Header */}
          <div className="hidden overflow-hidden rounded-t-xl border border-gray-200 bg-gray-100 md:grid md:grid-cols-[70px_1.2fr_1.8fr_0.8fr_0.9fr_0.7fr_120px] md:items-center">
            <div className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Image
            </div>

            <div className="px-3 py-3 text-sm font-semibold text-gray-600">
              Name
            </div>

            <div className="px-3 py-3 text-sm font-semibold text-gray-600">
              Description
            </div>

            <div className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
              Category
            </div>

            <div className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
              Sub Category
            </div>

            <div className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
              Price
            </div>

            <div className="px-3 py-3 text-center text-sm font-semibold text-gray-600">
              Actions
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-col">
            {listProducts.map((item) => (
              <div
                key={item._id}
                className="border-x border-b border-gray-200 bg-white transition hover:bg-gray-50"
              >
                {/* Desktop */}
                <div className="hidden md:grid md:grid-cols-[70px_1.2fr_1.8fr_0.8fr_0.9fr_0.7fr_120px] md:items-center">
                  {/* Image */}
                  <div className="flex justify-center px-3 py-3">
                    <img
                      src={
                        Array.isArray(item.image)
                          ? item.image[0]
                          : item.image
                      }
                      alt={item.name}
                      className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                    />
                  </div>

                  {/* Name */}
                  <div className="px-3 py-3">
                    <p className="line-clamp-2 text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="px-3 py-3">
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="px-3 py-3 text-center">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {item.category}
                    </span>
                  </div>

                  {/* Sub Category */}
                  <div className="px-3 py-3 text-center text-sm text-gray-600">
                    {item.subCategory}
                  </div>

                  {/* Price */}
                  <div className="px-3 py-3 text-center text-sm font-semibold text-gray-800">
                    {currency(item.price)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-2 px-3 py-3">
                    <Link
                      to={`/edit/${item._id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-black"
                      title="Edit Product"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        removeProduct(item._id)
                      }
                      disabled={deletingId === item._id}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete Product"
                    >
                      {deletingId === item._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile */}
                <div className="flex gap-4 p-4 md:hidden">
                  {/* Image */}
                  <div className="shrink-0">
                    <img
                      src={
                        Array.isArray(item.image)
                          ? item.image[0]
                          : item.image
                      }
                      alt={item.name}
                      className="h-24 w-24 rounded-xl border border-gray-100 object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-sm font-semibold text-gray-800">
                      {item.name}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                        {item.category}
                      </span>

                      <span className="text-xs text-gray-400">
                        {item.subCategory}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {currency(item.price)}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        to={`/edit/${item._id}`}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-black"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          removeProduct(item._id)
                        }
                        disabled={deletingId === item._id}
                        className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === item._id ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}

                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default List;