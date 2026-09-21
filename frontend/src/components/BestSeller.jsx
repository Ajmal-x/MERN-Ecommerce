import React, { useContext, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const sliderRef = useRef(null);

  const bestSeller = products.filter(
    (item) =>
      item.bestSeller === true ||
      item.bestseller === true
  );

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  if (bestSeller.length === 0) {
    return null;
  }

  return (
    <section className="my-20">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <Title text1="BEST" text2="SELLERS" />

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Discover the pieces our customers are loving right now.
          </p>
        </div>

        {/* Desktop Controls */}
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Previous products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition hover:border-black hover:bg-black hover:text-white"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Next products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition hover:border-black hover:bg-black hover:text-white"
          >
            <ArrowRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Products Slider */}
      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {bestSeller.map((item) => {
          const itemId = item._id || item.id;

          return (
            <div
              key={itemId}
              className="w-[72vw] shrink-0 snap-start sm:w-[300px] md:w-[280px] lg:w-[260px]"
            >
              <ProductItem
                id={itemId}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile Scroll Hint */}
      <div className="mt-4 flex items-center justify-between sm:hidden">
        <span className="text-xs text-gray-400">
          Swipe to explore
        </span>

        <div className="h-px flex-1 bg-gray-100 ml-4" />
      </div>
    </section>
  );
};

export default BestSeller;