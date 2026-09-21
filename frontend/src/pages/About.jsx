import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const About = () => {
  return (
    <div className="border-t border-gray-100 bg-white">

      {/* =========================
          About Header
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Title text1="ABOUT" text2="US" />
      </div>

      {/* =========================
          About Introduction
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* Image */}

          <div className="w-full lg:w-1/2">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={assets.about_img}
                alt="Trendify fashion collection"
                className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Content */}

          <div className="w-full lg:w-1/2">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Our Story
            </p>

            <h2 className="text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">
              Style made simple.
            </h2>

            <div className="mt-6 space-y-5 text-sm leading-7 text-gray-600">
              <p>
                Welcome to Trendify, where style meets quality. Our mission
                is to bring you the latest fashion trends and must-have
                items, carefully selected with quality and design in mind.
              </p>

              <p>
                We believe fashion should be an easy and enjoyable way to
                express yourself. That's why our collections are carefully
                selected to offer a variety of styles for different tastes
                and occasions.
              </p>

              <p>
                From browsing our collection to receiving your order, we
                focus on creating a simple and enjoyable shopping experience.
              </p>
            </div>

            {/* Mission / Vision */}

            <div className="mt-8 grid gap-6 border-t border-gray-200 pt-7 sm:grid-cols-2">

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Our Mission
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  To make quality, modern fashion accessible while helping
                  everyone express their individual style.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Our Vision
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  To build a fashion brand known for modern design, quality
                  products and a simple shopping experience.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Why Choose Us
      ========================= */}

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

          <div className="mb-10 text-center">
            <Title text1="WHY" text2="CHOOSE US" />

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
              We focus on quality, convenience and reliable service to make
              every part of your shopping experience better.
            </p>
          </div>

          <div className="grid grid-cols-1 border border-gray-200 bg-white md:grid-cols-3">

            {/* Quality */}

            <div className="border-b border-gray-200 p-8 md:border-b-0 md:border-r md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                01
              </span>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Quality Assurance
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Every product is carefully selected to meet our standards
                for quality, design and everyday wear.
              </p>
            </div>

            {/* Convenience */}

            <div className="border-b border-gray-200 p-8 md:border-b-0 md:border-r md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                02
              </span>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Convenience
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Browse easily, discover new styles and enjoy a simple
                shopping experience from start to finish.
              </p>
            </div>

            {/* Customer Service */}

            <div className="p-8 md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                03
              </span>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Customer Service
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Our support team is here to help with questions and concerns
                so you can shop with confidence.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          Newsletter
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <NewsLetterBox />
      </div>

    </div>
  );
};

export default About;