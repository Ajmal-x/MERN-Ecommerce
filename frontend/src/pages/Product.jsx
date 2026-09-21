import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck } from "lucide-react";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const product = products.find(
      (item) =>
        String(item._id) === String(productId) ||
        String(item.id) === String(productId)
    );

    if (product) {
      setProductData(product);

      const productImages = Array.isArray(product.image)
        ? product.image
        : product.image
          ? [product.image]
          : [];

      setImage(productImages[0] || "");
      setSize("");
    } else {
      setProductData(null);
      setImage("");
      setSize("");
    }
  }, [productId, products]);

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size first.");
      return;
    }

    if (!productData) return;

    const itemId = productData._id || productData.id;

    addToCart(itemId, size);
  };

  if (!productData) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
      </div>
    );
  }

  const productImages = Array.isArray(productData.image)
    ? productData.image
    : productData.image
      ? [productData.image]
      : [];

  const productPrice = Number(productData.price) || 0;

  return (
    <section className="border-t border-gray-100 pt-8 sm:pt-10">
      {/* Product Main Section */}
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Product Images */}
        <div className="flex w-full flex-col-reverse gap-4 sm:flex-row lg:w-[58%]">
          {/* Thumbnails */}
          <div className="flex w-full gap-3 overflow-x-auto sm:w-24 sm:flex-col sm:overflow-y-auto">
            {productImages.map((item, index) => (
              <button
                type="button"
                key={`${item}-${index}`}
                onClick={() => setImage(item)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-gray-50 transition sm:h-24 sm:w-24 ${
                  image === item
                    ? "border-gray-900"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={item}
                  alt={`${productData.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 overflow-hidden rounded-2xl bg-gray-50">
            {image ? (
              <img
                src={image}
                alt={productData.name}
                className="h-full max-h-[700px] w-full object-cover transition duration-500"
              />
            ) : (
              <div className="flex min-h-[500px] items-center justify-center text-sm text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            {productData.category}
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {productData.name}
          </h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-1">
            {[1, 2, 3, 4].map((item) => (
              <img
                key={item}
                src={assets.star_icon}
                alt=""
                className="h-3.5 w-3.5"
              />
            ))}

            <img
              src={assets.star_dull_icon}
              alt=""
              className="h-3.5 w-3.5"
            />

            <span className="ml-2 text-sm text-gray-500">
              4.0 (122 reviews)
            </span>
          </div>

          {/* Price */}
          <p className="mt-6 text-3xl font-semibold text-gray-950">
            {currency}
            {productPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-6 text-gray-500">
            {productData.description}
          </p>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                Select Size
              </p>

              {!size && (
                <span className="text-xs text-gray-400">
                  Please select a size
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {productData.sizes?.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSize(item)}
                  className={`min-w-14 rounded-lg border px-4 py-2.5 text-sm transition ${
                    item === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99]"
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            ADD TO CART
          </button>

          {/* Benefits */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Truck size={18} className="shrink-0 text-gray-500" />

                <div>
                  <p className="text-xs font-medium text-gray-800">
                    Cash on Delivery
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Pay at your doorstep
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="shrink-0 text-gray-500" />

                <div>
                  <p className="text-xs font-medium text-gray-800">
                    Easy Returns
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Within 10 days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="shrink-0 text-gray-500" />

                <div>
                  <p className="text-xs font-medium text-gray-800">
                    Quality Assured
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Shop with confidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className="border-b-2 border-black px-5 py-3 text-sm font-medium text-gray-900"
          >
            Description
          </button>

          <button
            type="button"
            className="px-5 py-3 text-sm text-gray-500"
          >
            Reviews (122)
          </button>
        </div>

        <div className="border border-t-0 border-gray-200 px-6 py-6 text-sm leading-7 text-gray-500">
          <p>
            Elevate your style with our meticulously crafted Trendify
            products. Designed with a perfect balance of elegance and
            practicality, these products are made from premium materials that
            ensure both durability and comfort.
          </p>

          <p className="mt-4">
            Whether you're dressing up for a special occasion or adding a
            touch of sophistication to your everyday look, Trendify products
            offer versatility for every wardrobe.
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </section>
  );
};

export default Product;