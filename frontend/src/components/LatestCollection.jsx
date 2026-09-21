import React, {
  useContext,
  useEffect,
  useRef,
} from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);

  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);

  const latestProducts = [...products]
    .sort((a, b) => {
      const dateA = Number(a.date) || 0;
      const dateB = Number(b.date) || 0;

      return dateB - dateA;
    })
    .slice(0, 10);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || latestProducts.length === 0) {
      return;
    }

    const speed = 0.5;

    const autoScroll = () => {
      if (
        !isHoveredRef.current &&
        !isDraggingRef.current
      ) {
        slider.scrollLeft += speed;

        if (
          slider.scrollLeft >=
          slider.scrollWidth - slider.clientWidth - 1
        ) {
          slider.scrollLeft = 0;
        }
      }

      animationRef.current =
        requestAnimationFrame(autoScroll);
    };

    animationRef.current =
      requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [products, latestProducts.length]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    isDraggingRef.current = false;

    const slider = sliderRef.current;

    if (slider) {
      slider.style.cursor = "grab";
      slider.style.userSelect = "";
    }
  };

  const handleMouseDown = (event) => {
    const slider = sliderRef.current;

    if (!slider) return;

    isDraggingRef.current = true;

    dragStartXRef.current = event.pageX;
    dragStartScrollLeftRef.current =
      slider.scrollLeft;

    slider.style.cursor = "grabbing";
    slider.style.userSelect = "none";
  };

  const handleMouseMove = (event) => {
    if (!isDraggingRef.current) return;

    const slider = sliderRef.current;

    if (!slider) return;

    const distance =
      event.pageX - dragStartXRef.current;

    slider.scrollLeft =
      dragStartScrollLeftRef.current - distance;
  };

  const stopDragging = () => {
    const slider = sliderRef.current;

    isDraggingRef.current = false;

    if (slider) {
      slider.style.cursor = "grab";
      slider.style.userSelect = "";
    }
  };

  const handleWheel = (event) => {
    const slider = sliderRef.current;

    if (!slider) return;

    if (
      Math.abs(event.deltaY) >
      Math.abs(event.deltaX)
    ) {
      event.preventDefault();

      slider.scrollLeft += event.deltaY;
    }
  };

  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <section className="my-20 overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <Title
            text1="LATEST"
            text2="COLLECTIONS"
          />

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Discover the newest pieces added to our
            collection.
          </p>
        </div>

        <span className="hidden text-xs uppercase tracking-[0.2em] text-gray-400 sm:block">
          New arrivals
        </span>
      </div>

      {/* Products Slider */}
      <div
        ref={sliderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onWheel={handleWheel}
        className="flex cursor-grab gap-5 overflow-x-auto pb-4 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {latestProducts.map((item) => {
          const itemId = item._id || item.id;

          return (
            <div
              key={itemId}
              className="w-[72vw] shrink-0 sm:w-[300px] md:w-[280px] lg:w-[260px]"
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

      {/* Mobile Hint */}
      <div className="mt-4 flex items-center sm:hidden">
        <span className="text-xs text-gray-400">
          Swipe or drag to explore
        </span>

        <div className="ml-4 h-px flex-1 bg-gray-100" />
      </div>
    </section>
  );
};

export default LatestCollection;