"use client";
import banner1 from "@/assets/banner-web.jpg";
import banner2 from "@/assets/banner-web.jpg";
import Image from "next/image";
import bannerStyle from "./banner.module.css";
import { useEffect, useState } from "react";

const bannerArray = [banner1, banner2];

const BannerComponent = () => {
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/all`
        );
        const result = await response.json();
   ;
        setBannerData(result?.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchBannerData();
  }, []);
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full`}>
      {bannerData?.length &&
        bannerData?.map((d) => (
          <div
            key={d?._id}
            className={`${
              d?.side === "right" ? "order-2" : "order-1"
            } w-full col-span-1`}
          >
           <a href={d?.
              goToURL} target="_blank" rel="noopener noreferrer">

              <Image
              className={`object-cover object-center w-full h-full`}
              src={d?.fileName}
              width={2000}
              height={800}
              alt="banner"
            />
              </a>
          </div>
        ))}
    </div>
  );
};

export default BannerComponent;
