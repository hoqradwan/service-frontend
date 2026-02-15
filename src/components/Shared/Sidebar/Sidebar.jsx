"use client";
import React, { useContext, useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdFileDownloadOff, MdOutlineDashboard } from "react-icons/md";
import { IoMdKey } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { LiaCookieSolid } from "react-icons/lia";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { HiOutlinePhoto } from "react-icons/hi2";
import { BiSupport } from "react-icons/bi";
import envatoLogo from "@/assets/envato_icon_transparent.png";
import freepik from "@/assets/freepik.png";
import storyblocks from "@/assets/storyblocks.png";
import moreServices from "@/assets/moreServices.png";
import motionArray from "@/assets/motionArray.png";
import NavLink from "./NavLink";
import { Tooltip } from "@nextui-org/react";
import { RoleContext } from "@/Provider/RoleContext";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from "next/image";
import ServiceActivationModal from "../service-activation/serviceActivationModal";

const Sidebar = () => {
  const [supportData, setSupportData] = useState([]);
  const { role } = useContext(RoleContext);
  const [open, setOpen] = useState(true);
  const token = Cookies.get("session");

  // Nav links data
  const userDashboard = [
    {
      name: "Dashboard",
      link: "/dashboard/user/download-history",
      icon: MdOutlineDashboard,
    },
  ];

  const adminDashboard = [
    {
      name: "Dashboard",
      link: "/dashboard/admin/order-list",
      icon: MdOutlineDashboard,
    },
  ];

  const servicesStat = [
    {
      name: "Envato Element",
      link: "/dashboard/user/envato-link",
      img: envatoLogo,
    },
    {
      name: "Freepik",
      link: "/dashboard/user/freepik",
      img: freepik,
    },
    {
      name: "Motion Array",
      link: "/dashboard/user/motion-array",
      img: motionArray,
    },
    {
      name: "Storyblocks",
      link: "/dashboard/user/storyblocks",
      img: storyblocks,
    },
    {
      name: "More Services",
      link: "https://digitaltoolsbd.com/",
      img: moreServices,
      target: "_blank",
    },
  ];

  const adminActivation = [
    {
      name: "License List",
      link: "/dashboard/admin/license-list",
      icon: IoMdKey,
    },
  ];

  const userManage = [
    {
      name: "User List",
      link: "/dashboard/admin/user-list",
      icon: FaRegUserCircle,
    },
  ];

  const settings = [
    {
      name: "Cookie",
      link: "/dashboard/admin/cookie-setting",
      icon: LiaCookieSolid,
    },
    {
      name: "Cookie Check",
      link: "/dashboard/admin/cookie-test",
      icon: IoShieldCheckmarkOutline,
    },
    {
      name: "Banner",
      link: "/dashboard/admin/add-banner",
      icon: HiOutlinePhoto,
    },
    {
      name: "Restrict Download",
      link: "/dashboard/admin/download-restrict",
      icon: MdFileDownloadOff,
    },
    {
      name: "Support",
      link: "/dashboard/admin/support",
      icon: BiSupport,
    },
  ];

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/support/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        const data = result?.data;
        setSupportData(data);
      } catch (error) {
        console.error("Error fetching support data:", error);
      }
    };
    fetchSupportData();
  }, [token]);

  return (
    <aside className="bg-[#f7f4f4]">
      <div
        className={`min-h-screen ${
          open ? "w-[180px]" : "w-[60px]"
        } duration-300 text-gray-900 pl-3`}
      >
        {/* Hamburger menu */}
        <div className="py-3 flex justify-end sticky top-0">
          <HiMenuAlt3
            size={30}
            className="cursor-pointer text-secondary"
            onClick={() => setOpen(!open)}
          />
        </div>
        {/* Menu links container */}
        <nav
          className="flex flex-col gap-2 relative h-screen overflow-y-scroll sidebar-scrollbar pb-4 pr-2"
          style={{ height: "calc(100vh - 60px)" }}
        >
          {role === "user" &&
            userDashboard?.map((navLinksData, i) => (
              <NavLink key={i} navLinksData={navLinksData} open={open} />
            ))}
          {role === "admin" &&
            adminDashboard?.map((navLinksData, i) => (
              <NavLink key={i} navLinksData={navLinksData} open={open} />
            ))}
          {/* Services status links */}
          {role === "user" && servicesStat && (
            <>
              <p
                className={`${
                  !open ? "hidden" : ""
                } uppercase font-medium text-sm text-nowrap mt-4`}
              >
                services
              </p>
              {servicesStat?.map((navLinksData, i) => (
                <NavLink
                  key={navLinksData.name}
                  navLinksData={navLinksData}
                  open={open}
                  target={navLinksData.target}
                />
              ))}
            </>
          )}
          {/* Admin activation links */}
          {role === "admin" && adminActivation && (
            <>
              <p
                className={`${
                  !open ? "hidden" : ""
                } uppercase font-medium text-sm text-nowrap mt-4`}
              >
                activation
              </p>
              {adminActivation?.map((navLinksData, i) => (
                <NavLink key={i} navLinksData={navLinksData} open={open} />
              ))}
            </>
          )}
          {/* User manage links */}
          {role === "admin" && userManage && (
            <>
              <p
                className={`${
                  !open ? "hidden" : ""
                } uppercase font-medium text-sm text-nowrap mt-4`}
              >
                user manage
              </p>
              {userManage?.map((navLinksData, i) => (
                <NavLink key={i} navLinksData={navLinksData} open={open} />
              ))}
            </>
          )}
          {/* License activation */}
          {role === "user" && (
            <>
              <p
                className={`${
                  !open ? "hidden" : ""
                } uppercase font-medium text-sm text-nowrap mt-4`}
              >
                activation
              </p>
              <ServiceActivationModal open={open} />
            </>
          )}
          {/* Settings links */}
          {role === "admin" && settings && (
            <>
              <p
                className={`${
                  !open ? "hidden" : ""
                } uppercase font-medium text-sm text-nowrap mt-4`}
              >
                settings
              </p>
              {settings?.map((navLinksData, i) => (
                <NavLink key={i} navLinksData={navLinksData} open={open} />
              ))}
            </>
          )}
          {/* Supports button */}
          {role === "user" && (
            <>
              <p
                className={`${
                  !open ? "hidden" : ""
                } uppercase font-medium text-sm text-nowrap mt-4`}
              >
                supports
              </p>
              {supportData &&
                supportData.map((s) => (
                  <Tooltip
                    key={s._id}
                    placement="right"
                    content={s.name}
                    className={`${open ? "opacity-0" : ""}`}
                  >
                    <Link
                      href={s?.goToURL}
                      target="_blank"
                      className={`group ${
                        open ? "justify-center" : "w-[38px]"
                      } min-h-[40px] p-2 ${
                        s?.name?.toLowerCase() === "facebook"
                          ? "bg-[#316FF6]"
                          : ""
                      } ${
                        s?.name?.toLowerCase() === "whatsapp"
                          ? "bg-[#25D366]"
                          : ""
                      } ${
                        s?.name?.toLowerCase() === "website"
                          ? "bg-[#004289]"
                          : ""
                      } flex items-center hover:opacity-90 gap-2 rounded-md text-white text-sm`}
                    >
                      <div>
                        <Image
                          className="min-w-[20px] w-[20px]"
                          src={s?.image}
                          alt={s?.name}
                          width={20}
                          height={20}
                        />
                      </div>
                      <span
                        className={`${
                          !open
                            ? "opacity-0 translate-x-28 cursor-pointer overflow-hidden"
                            : ""
                        } duration-500`}
                      >
                        {s?.name}
                      </span>
                    </Link>
                  </Tooltip>
                ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
