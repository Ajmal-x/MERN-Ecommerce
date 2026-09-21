import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  const productImage = Array.isArray(image) ? image[0] : image;
  const productPrice = Number(price) || 0;

  return (
    <Link
      to={`/product/${id}`}
      className="group block cursor-pointer text-gray-700"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
        {productImage ? (
          <img
            src={productImage}
            alt={name || "Product"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

        {/* Top Actions */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-900 shadow-sm backdrop-blur">
            New
          </span>

          <button
            type="button"
            onClick={(event) => event.preventDefault()}
            aria-label="Add to wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm backdrop-blur transition hover:bg-black hover:text-white"
          >
            <Heart size={17} strokeWidth={1.7} />
          </button>
        </div>

        {/* View Product */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-xl">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-900">
              <ShoppingBag size={15} strokeWidth={1.8} />
              View Product
            </span>

            <ArrowUpRight
              size={17}
              strokeWidth={1.8}
              className="text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-1 pt-4">
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-800 transition-colors group-hover:text-black">
          {name}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-950">
            {currency}
            {productPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <span className="text-[11px] text-gray-400 transition-colors group-hover:text-gray-700">
            Shop now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;