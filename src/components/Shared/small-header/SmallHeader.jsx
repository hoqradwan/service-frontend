import React from "react";

const SmallHeader = ({ title, routes }) => {
  return (
    <div className="bg-white shadow-md w-full flex items-center justify-between px-3 py-4">
      <h1 className="text-[#4DBC60]">{title || ""}</h1>
      <div className="text-gray-400 text-sm">
        <span>{routes || ""}</span>
      </div>
    </div>
  );
};

export default SmallHeader;
