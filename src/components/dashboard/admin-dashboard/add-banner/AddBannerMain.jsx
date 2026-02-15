"use client";
import React, { useState } from "react";
import SmallHeader from "@/components/Shared/small-header/SmallHeader";
import BannerTable from "./BannerTable";
import AddBannerModal from "./AddBannerModal";
import { usePathname } from "next/navigation";

const AddBannerMain = () => {
  const path = usePathname();
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <div className="bg-white shadow-xl p-4 rounded-md m-5 ">
        <div className="mb-8 md:flex items-center justify-between gap-5 ">
          <div>
            <h4 className="text-[18px] text-gray-500">Banner List</h4>
            <span className="text-[14px] text-gray-400">All banners</span>
          </div>
          <AddBannerModal setRefresh={setRefresh} />
        </div>
        <BannerTable refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};

export default AddBannerMain;
