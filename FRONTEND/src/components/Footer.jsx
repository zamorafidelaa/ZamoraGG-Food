import React from "react";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 pt-12 sm:pt-16 pb-6 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-3">
            <img src="ggfood.png" alt="ZamoraGG Food Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">ZamoraGG Food</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
            Enjoy your favorite meals delivered fast, safe, and hygienic. We bring happiness straight to your doorstep, anytime you want.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">Quick Links</h3>
          <ul className="space-y-2 text-sm sm:text-base">
            <li>
              <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
            </li>
            <li>
              <a href="/menu" className="hover:text-blue-400 transition-colors">Menu</a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-400 transition-colors">About Us</a>
            </li>
            <li>
              <a href="/orders" className="hover:text-blue-400 transition-colors">Orders</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3 text-sm sm:text-base">Contact Us</h3>
          <ul className="space-y-2 text-sm sm:text-base text-gray-400">
            <li className="flex items-center space-x-2">
              <MapPin size={16} className="text-blue-400" />
              <span>Blok Rengas Jatibarang</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={16} className="text-green-400" />
              <span>+62 877 6332 3044</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={16} className="text-red-400" />
              <span>morafidela1@gmail.com</span>
            </li>
          </ul>

          <div className="flex space-x-3 mt-4">
            <a href="https://www.facebook.com/share/1626MaUZx8/" target="_blank" rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-blue-600 text-white transition transform hover:scale-110">
              <Facebook size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a href="https://www.instagram.com/zaa.moraaa?igsh=a3VtOG00eTNrMzBw" target="_blank" rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-pink-500 text-white transition transform hover:scale-110">
              <Instagram size={16} className="sm:w-5 sm:h-5" />
            </a>
            <a href="https://wa.me/6287763323044" target="_blank" rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-gray-700 hover:bg-green-500 text-white transition transform hover:scale-110">
              <Phone size={16} className="sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-xs sm:text-sm">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-white">ZamoraGG Food</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
