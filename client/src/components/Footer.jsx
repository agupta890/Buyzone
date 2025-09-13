import React from "react";
import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto  px-6 py-12">
        {/* Top section: multiple columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 border-b border-gray-700 pb-8">
          {/* Customer Care */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Care</h3>
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
          </div>

          {/* About BuyZone */}
          <div>
            <h3 className="text-white font-semibold mb-4">About BuyZone</h3>
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
          </div>

          {/* Shop By Category */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop By Category</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/men" className="hover:text-yellow-500">
                  Men
                </NavLink>
              </li>
              <li>
                <NavLink to="/women" className="hover:text-yellow-500">
                  Women
                </NavLink>
              </li>
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
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Admin</h3>
            <ul>
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
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
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
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-white font-semibold mb-4">Download App</h3>
            <div className="flex space-x-4">
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
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-gray-400">
              <a
                href="https://facebook.com/buyzone"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-500"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12v-9.294H9.294v-3.622H12V8.41c0-2.667 1.627-4.12 4-4.12 1.153 0 2.143.086 2.43.124v2.82h-1.666c-1.308 0-1.56.622-1.56 1.53v2.01h3.12l-.406 3.622h-2.714V24h5.326C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/buyzone"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-500"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5A3.75 3.75 0 0020 16.25v-8.5A3.75 3.75 0 0016.25 4h-8.5zm8.5 1.75a.75.75 0 110 1.5.75.75 0 010-1.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/buyzone"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-500"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14.86A4.48 4.48 0 0022.4 1.6a9 9 0 01-2.85 1.1 4.48 4.48 0 00-7.64 4.1A12.75 12.75 0 013 2.13a4.48 4.48 0 001.39 6 4.41 4.41 0 01-2.04-.57v.06a4.48 4.48 0 003.59 4.4 4.49 4.49 0 01-2.03.08 4.48 4.48 0 004.18 3.12A9 9 0 012 19.54a12.69 12.69 0 006.92 2.02c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.2 9.2 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/buyzone"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-500"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-9h3v9zm-1.5-10.3a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm13.5 10.3h-3v-4.5c0-1.07-.02-2.45-1.5-2.45s-1.75 1.18-1.75 2.38v4.57h-3v-9h2.89v1.23h.04a3.17 3.17 0 012.85-1.57c3.05 0 3.61 2.01 3.61 4.62v4.72z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} BuyZone Pvt Ltd. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};
