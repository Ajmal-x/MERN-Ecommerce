import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="overflow-hidden bg-[#f7f7f7]">
      <div className="flex min-h-[500px] flex-col sm:flex-row lg:min-h-[620px]">
        {/* Left Side */}
        <div className="flex w-full items-center justify-center px-6 py-14 sm:w-1/2 sm:px-10 sm:py-0 lg:px-16">
          <div className="max-w-xl text-[#414141]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#414141] sm:w-10" />

              <p className="text-xs font-semibold tracking-[0.2em] sm:text-sm">
                OUR BEST SELLERS
              </p>
            </div>

            <h1 className="prata-regular text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Latest
              <br />
              Arrivals
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Discover our latest collection, carefully selected to bring
              timeless style and everyday comfort to your wardrobe.
            </p>

            <Link
              to="/collection"
              className="group mt-8 inline-flex items-center gap-3 border border-gray-900 bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-transparent hover:text-gray-900"
            >
              <span>SHOP NOW</span>

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full sm:w-1/2">
          <img
            src={assets.hero_img}
            alt="Latest arrivals"
            className="h-full min-h-[380px] w-full object-cover object-center sm:min-h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;