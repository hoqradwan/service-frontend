import React from "react";

const Footer = () => {
  return (
    <footer className="flex items-center py-4 px-8 text-gray-500 text-sm flex-wrap">
      Digital Tools BD © {new Date().getFullYear()}. All Rights Reserved.
    </footer>
  );
};

export default Footer;
