import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
  return (
    <div className="border-t border-gray-100 bg-white">

      {/* =========================
          Page Header
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Title text1="CONTACT" text2="US" />
      </div>

      {/* =========================
          Contact Information
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* Image */}

          <div className="w-full lg:w-1/2">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={assets.contact_img}
                alt="Trendify store"
                className="w-full object-cover transition duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Content */}

          <div className="w-full lg:w-1/2">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Get in Touch
            </p>

            <h2 className="text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">
              We'd love to hear from you.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500">
              Have a question about an order, our products, or anything
              else? Feel free to get in touch with our team.
            </p>

            {/* Store */}

            <div className="mt-8 border-t border-gray-200 pt-7">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-900">
                Our Store
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Trendify
                <br />
                354 Fashion Lane
                <br />
                Los Angeles, CA 90001, USA
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Tel: (+1) 558-669-447
                <br />
                Email: contact@trendify.com
              </p>
            </div>

            {/* Careers */}

            <div className="mt-7 border-t border-gray-200 pt-7">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-900">
                Careers at Trendify
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500">
                Join our team and help shape the future of fashion.
                Explore our current opportunities and discover how you
                can contribute to Trendify.
              </p>

              <button
                type="button"
                className="mt-6 border border-gray-900 px-7 py-3 text-sm font-medium text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white"
              >
                Explore Jobs
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          Newsletter
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <NewsLetterBox />
      </div>

    </div>
  );
};

export default Contact;