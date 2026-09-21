import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">

      {/* Main Footer */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16">

          {/* Brand */}

          <div>
            <Link to="/" className="inline-block">
              <img
                src={assets.logo}
                className="mb-5 w-32"
                alt="Trendify"
              />
            </Link>

            <p className="max-w-xl text-sm leading-6 text-gray-500">
              Discover modern styles and quality products at Trendify.
              We're here to make your shopping experience simple,
              enjoyable, and inspiring.
            </p>
          </div>

          {/* Company */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-gray-900">
              Company
            </h3>

            <ul className="flex flex-col gap-3 text-sm text-gray-500">

              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-gray-900"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/collection"
                  className="transition-colors hover:text-gray-900"
                >
                  Shop
                </Link>
              </li>

            </ul>
          </div>

          {/* Get In Touch */}

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.15em] text-gray-900">
              Get In Touch
            </h3>

            <ul className="flex flex-col gap-3 text-sm text-gray-500">

              <li>
                <a
                  href="tel:+11558669447"
                  className="transition-colors hover:text-gray-900"
                >
                  +1 558-669-447
                </a>
              </li>

              <li>
                <a
                  href="mailto:contact@trendify.com"
                  className="break-all transition-colors hover:text-gray-900"
                >
                  contact@trendify.com
                </a>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="py-5 text-center text-xs text-gray-400">
            © 2026 Trendify. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;