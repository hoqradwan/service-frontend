"use client";
import UserPopover from "../UserPopover/UserPopover";
import AddLicenseModal from "@/components/Shared/create-license/AddLicenseModal";
import { useContext } from "react";
import { RoleContext } from "@/Provider/RoleContext";
import Image from "next/image";
import logo from "@/assets/logo.png";

const TopHeader = () => {
  const { role, setRole } = useContext(RoleContext);
  return (
    <>
      <div className="">
        <div
          className={`flex p-3 items-center justify-end sm:justify-between px-8 sticky top-0 bg-white`}
        >
          <div className="hidden sm:block">
            <Image
              src={logo}
              alt="logo of digital tools website"
              width={500}
              height={50}
              priority={true}
              className="w-fit h-[40px]"
            />
          </div>

          <div className="flex space-x-3 justify-end items-center gap-3">
            {/* add license modal */}
            <div className="hidden sm:block">
              {role === "admin" && <AddLicenseModal />}
            </div>
            
            {/* user popover */}
            <UserPopover />
          </div>
        </div>
        <hr />
      </div>
    </>
  );
};

export default TopHeader;
