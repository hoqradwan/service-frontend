import React from "react";
import { formatTime } from "@/utility/formatTime";

const LicenseInfo = ({ license }) => {
  const { serviceName, expiryDate, status } = license;

  const statusColors = {
    new: "text-green-600 bg-green-100",
    used: "text-yellow-600 bg-yellow-100",
    expired: "text-red-600 bg-red-100",
    suspended: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-gray-200 mb-2">
      {/* Service Name */}
      <span className="text-gray-800 text-sm font-semibold">{serviceName}</span>

      {/* Expiry Date */}
      <span className="text-gray-500 text-sm">
        Expiry {formatTime(expiryDate)}
      </span>

      {/* License Status */}
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
      >
        {status}
      </span>
    </div>
  );
};

export default LicenseInfo;
