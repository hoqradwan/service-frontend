import Link from "next/link";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Tooltip } from "@nextui-org/react";

const NavLink = ({ navLinksData, i, open }) => {
  const pathname = usePathname();
  return (
    <Tooltip
      placement="right"
      content={navLinksData?.name}
      className={`${open ? "opacity-0" : ""}`}
    >
      <Link
        href={`${navLinksData?.link}`}
        target={navLinksData.target}
        className={`${
          navLinksData?.link === pathname
            ? "bg-primary text-white"
            : "hover:bg-[#E1F7E6]"
        } ${
          open ? "" : "w-[38px]"
        } group flex cursor-pointer items-center text-sm gap-3.5 p-2  rounded-md`}
      >
        {navLinksData?.img && (
          <Image
            className="w-[20px]"
            src={navLinksData?.img}
            alt={`${navLinksData?.name} logo`}
            height={25}
            width={25}
          />
        )}
        {navLinksData?.icon && (
          <div
            className={`text-secondary ${
              navLinksData?.link === pathname ? "text-white" : ""
            }`}
          >
            {React.createElement(navLinksData?.icon, { size: "20" })}{" "}
          </div>
        )}
        <p
          className={`whitespace-pre text-sm duration-500 ${
            !open
              ? "opacity-0 translate-x-28 cursor-pointer overflow-hidden"
              : ""
          }`}
        >
          {navLinksData?.name}
        </p>
      </Link>
    </Tooltip>
  );
};

export default NavLink;
