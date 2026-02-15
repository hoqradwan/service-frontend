"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
// import default_profile from "../../../assets/default_image.png";
import Image from "next/image";

const AboutMe = ({ updateTrigger }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("session");
        const decoded = jwt.decode(token);
        const userId = decoded.id;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/information/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const receive = await response.json();
        setInfo(receive?.data.information);
        console.log(receive);
        toast.success("Here is your information");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [updateTrigger]);

  return (
    <div className="lg:mt-[52px] mt-4">
      <div className="flex justify-center mb-6">
        <Image
          src={
            info.image?.startsWith("http")
              ? info.image
              : "/path/to/default_profile.png"
          }
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full w-24 h-24 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="mt-3 w-full">
          <label
            htmlFor="name"
            className="block text-[#666666] font-normal text-sm mb-2"
          >
            Name
          </label>
          <p className="bg-[#F8F8FF] py-3 px-3 rounded-lg text-[#1B1D48] font-semibold w-full h-[48px]">
            {info.name || "N/A"}
          </p>
        </div>
        <div className="mt-3 w-full">
          <label
            htmlFor="SerialId"
            className="block text-[#666666] font-normal text-sm mb-2"
          >
            Serial Id
          </label>
          <p className="bg-[#F8F8FF] py-3 px-3 rounded-lg text-[#1B1D48] font-semibold w-full h-[48px]">
            {info.serial || "N/A"}
          </p>
        </div>
        <div className="mt-3 w-full">
          <label
            htmlFor="Email"
            className="block text-[#666666] font-normal text-sm mb-2"
          >
            Email
          </label>
          <p className="bg-[#F8F8FF] py-3 px-3 rounded-lg text-[#1B1D48] font-semibold w-full h-[48px]">
            {info.email || "N/A"}
          </p>
        </div>
        <div className="mt-3 w-full">
          <label
            htmlFor="Phone"
            className="block text-[#666666] font-normal text-sm mb-2"
          >
            Phone
          </label>
          <p className="bg-[#F8F8FF] py-3 px-3 rounded-lg text-[#1B1D48] font-semibold w-full h-[48px]">
            {info.phone || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
