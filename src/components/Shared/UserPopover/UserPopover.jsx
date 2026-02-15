"use client";
import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  Divider,
} from "@nextui-org/react";

import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import LogoutButton from "../Logout/LogoutButton";
import Cookies from "js-cookie";
import { RefetchContext } from "@/Provider/RefetchContext";

export default function UserPopover() {
  const { refetch } = useContext(RefetchContext);
  const [userData, setUserData] = React.useState({});
  const [userImage, setUserImage] = useState("");

  React.useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setUserData({
          name: userInfo.name,
          email: userInfo.email,
        });
      }
    };
    getUserInfo();

    const fetchUserImage = async () => {
      refetch;
      try {
        const token = await Cookies.get("session");
        const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/information/${userInfo.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (!result?.success) {
          toast.error("something went wrong");
        }
        setUserImage(result?.data?.information?.image);
       
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUserImage();
  }, [refetch]);
  const content = (
    <PopoverContent>
      <div className="px-1 py-2 flex flex-col">
        <p className={`text-small font-bold capitalize pl-2 `}>
          {userData.name}
        </p>
        <p className="text-tiny pl-2">{userData.email}</p>
        <Divider className="my-2" />
        <Link
          href={"/dashboard/profile"}
          className="flex items-center gap-2 text-base capitalize hover:curson-pointer hover:bg-gray-200 p-2 rounded-md"
        >
          <FaRegUser /> my profile
        </Link>
        <LogoutButton />
      </div>
    </PopoverContent>
  );

  return (
    <div className="">
      <Popover key="bottom-end" placement="bottom-end">
        <PopoverTrigger>
          <Avatar
            isBordered
            src={` ${
              userImage
                ? userImage
                : "https://res.cloudinary.com/dosxctq4v/image/upload/v1723362037/user_profiles/jowjpcp5bm9jhwpweipi.png"
            }`}
            alt=""
            className="hover:cursor-pointer"
          />
        </PopoverTrigger>
        {content}
      </Popover>
    </div>
  );
}
