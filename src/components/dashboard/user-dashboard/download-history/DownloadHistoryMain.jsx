"use client";
import BannerComponent from "@/components/Shared/banner-component/BannerComponent";
import React, { useEffect, useState } from "react";
import Advices from "./Advices";
import DownloadTable from "./DownloadTable";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import Cookies from "js-cookie";

const DownloadHistoryMain = () => {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const fetchDownloadData = async () => {
      try {
        const token = Cookies.get("session");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/my-downloads`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await res.json();
        if (result?.success) {
          setTableData(result?.data?.result);
        }
      
      
      } catch (error) {
        console.log(error);
      }
    };
    fetchDownloadData();
  }, []);

  return (
    <div>
      <TopHeader2 pageName={"dashboard"} />
      <div className="px-8">
        {/* banner component */}
        <BannerComponent />

        {/* warning advice */}
        <Advices />

        {/* download history.. */}
        {tableData && <DownloadTable users={tableData} />}
      </div>
    </div>
  );
};

export default DownloadHistoryMain;
