"use client";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function TopHeader2Breadcrumbs() {
  const pathname = usePathname();
  const pathnameArray = pathname.split("/");
  const breadcrumbs = pathnameArray.map((item, index) => {
    if (index === 0) {
      return null;
    }
    const path = `/${pathnameArray.slice(1, index + 1).join("/")}`;
    return (
      <BreadcrumbItem className="capitalize" key={index} href={path}>
        {item.replace(/-/g, " ")}
      </BreadcrumbItem>
    );
  });

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
    </div>
  );
}
