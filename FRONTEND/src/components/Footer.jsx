import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-100 via-blue-50 to-white shadow-inner py-3 text-center z-50">
      <p className="text-sm text-gray-700">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600">ZamoraGG Food</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
