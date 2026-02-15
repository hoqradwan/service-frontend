"use client";
import React from "react";
import TopHeader2Breadcrumbs from "./TopHeader2Breadcrumbs";
import { usePathname } from "next/navigation";

const TopHeader2 = ({ pageName }) => {
  const pathname = usePathname();
  return (
    <div>
      {pathname !== "/dashboard/profile" && (
        <div className="px-8 py-3 flex flex-wrap-reverse gap-x-4 gap-y-2 items-center justify-between bg-white">
          {pageName ? (
            <p className="capitalize text-primary font-medium text-xl">
              {pageName}
            </p>
          ) : (
            <p className="capitalize text-primary font-medium text-xl">
              {pathname.split("/").pop().replace(/-/g, " ")}
            </p>
          )}
          <div className="hidden sm:block">
            <TopHeader2Breadcrumbs />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopHeader2;
