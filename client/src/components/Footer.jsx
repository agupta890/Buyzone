import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 sm:border-none">
      {/* Header for mobile */}
      <button
        className="w-full flex justify-between items-center text-white font-semibold py-2 sm:py-0 sm:text-left sm:block"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className="sm:hidden">{open ? "−" : "+"}</span>
      </button>

      {/* Content */}
      <div
        className={`mt-2 sm:mt-0 sm:block text-gray-300 text-sm space-y-2 ${
          open ? "block" : "hidden sm:block"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top section: grid for large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          {/* Customer Care */}
          <FooterSection title="Customer Care">
            <ul className="space-y-2">
              <li>
                <NavLink to="/help" className="hover:text-yellow-500">
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className="hover:text-yellow-500">
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/shipping" className="hover:text-yellow-500">
                  Shipping
                </NavLink>
              </li>
              <li>
                <NavLink to="/returns" className="hover:text-yellow-500">
                  Returns
                </NavLink>
              </li>
              <li>
                <NavLink to="/order-tracking" className="hover:text-yellow-500">
                  Order Tracking
                </NavLink>
              </li>
            </ul>
          </FooterSection>

          {/* About BuyZone */}
          <FooterSection title="About BuyZone">
            <ul className="space-y-2">
              <li>
                <NavLink to="/about" className="hover:text-yellow-500">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/careers" className="hover:text-yellow-500">
                  Careers
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms" className="hover:text-yellow-500">
                  Terms & Conditions
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy" className="hover:text-yellow-500">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/sitemap" className="hover:text-yellow-500">
                  Sitemap
                </NavLink>
              </li>
            </ul>
          </FooterSection>

          {/* Shop By Category */}
          <FooterSection title="Shop By Category">
            <ul className="space-y-2">
              <li>
                <NavLink to="/mobile-covers" className="hover:text-yellow-500">
                  Mobile Covers
                </NavLink>
              </li>
              <li>
                <NavLink to="/new-arrivals" className="hover:text-yellow-500">
                  New Arrivals
                </NavLink>
              </li>
              <li>
                <NavLink to="/best-sellers" className="hover:text-yellow-500">
                  Best Sellers
                </NavLink>
              </li>
            </ul>
          </FooterSection>

          {/* Admin */}
          <FooterSection title="Admin">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/admin"
                  className="hover:text-yellow-500"
                  target="_blank"
                >
                  Admin Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/address"
                  className="hover:text-yellow-500"
                  target="_blank"
                >
                  Address
                </NavLink>
              </li>
            </ul>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-2">
              <li>
                <NavLink to="/gift-cards" className="hover:text-yellow-500">
                  Gift Cards
                </NavLink>
              </li>
              <li>
                <NavLink to="/offers" className="hover:text-yellow-500">
                  Offers
                </NavLink>
              </li>
              <li>
                <NavLink to="/affiliate" className="hover:text-yellow-500">
                  Affiliate
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className="hover:text-yellow-500">
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/store-locator" className="hover:text-yellow-500">
                  Store Locator
                </NavLink>
              </li>
            </ul>
          </FooterSection>

          {/* Download App */}
          <FooterSection title="Download App">
            <div className="flex space-x-4 mt-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.buyzone.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play Store"
                  className="h-10"
                />
              </a>
              <a
                href="https://apps.apple.com/app/buyzone/id123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-10"
                />
              </a>
            </div>
          </FooterSection>
        </div>

        {/* Social Media */}
        <div className="flex justify-center mt-8 space-x-4 text-gray-400">
          {/* Same SVG icons as before */}
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} BuyZone Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
