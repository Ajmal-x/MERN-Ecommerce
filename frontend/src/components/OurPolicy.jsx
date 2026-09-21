import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Return & Exchange",
      description: "Easy returns and exchanges within 10 days.",
    },
    {
      icon: assets.quality_icon,
      title: "Quality Assurance",
      description: "Trendify ensures high-quality products.",
    },
    {
      icon: assets.support_img,
      title: "Dedicated Support",
      description: "We're here to help via email, phone, or chat.",
    },
  ];

  return (
    <section className="my-16 border-y border-gray-100 bg-gray-50/50 px-6 py-12 sm:my-20 lg:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
        {policies.map((policy) => (
          <div
            key={policy.title}
            className="group text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src={policy.icon}
                className="h-9 w-9 object-contain"
                alt={policy.title}
              />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-gray-900 sm:text-base">
              {policy.title}
            </h3>

            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-gray-500 sm:text-sm">
              {policy.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;