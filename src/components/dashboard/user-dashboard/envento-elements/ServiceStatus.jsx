"use client";
import { Tooltip } from "@nextui-org/tooltip";

import Link from "next/link";
import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { FiShoppingCart } from "react-icons/fi";

const ServiceStatus = ({ serviceStatus }) => {
  return (
    <div className="flex items-center justify-center">
      <Tooltip
        className="max-w-[230px]"
        content={`${
          serviceStatus
            ? "Your account is active"
            : "Watch the promo video on how to activate your account."
        }`}
      >
        <div
          className={`flex gap-1 items-center ${
            serviceStatus
              ? "bg-green-700 text-white"
              : "bg-gray-500 text-gray-300"
          } font-medium rounded-lg text-sm px-5 py-2.5`}
        >
          {serviceStatus ? <FaCheck /> : <ImCross />}
          Service Status:
          {serviceStatus ? <> Running</> : <> Not Running or Expired</>}
        </div>
      </Tooltip>
      {!serviceStatus && (
        <Link
          href="https://digitaltoolsbd.com/"
          target="_blank"
          className=" ml-5"
        >
          <button className="animate-blink border font-medium rounded-lg text-[17px] px-5 py-2 flex justify-center items-center ">
            <FiShoppingCart className="mr-2" />
            Buy Now
          </button>
        </Link>
      )}
    </div>
  );
};

export default ServiceStatus;
