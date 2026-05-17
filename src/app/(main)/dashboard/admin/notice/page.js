import AdminNoticeMain from "@/components/dashboard/admin-dashboard/notice/AdminNoticeMain";
import React from "react";

export const metadata = {
  title: "DigitalToolsBD | Support",
  description: "DigitalToolsBD Support Page",
};

const page = () => {
  return (
    <div className="bg-[#EDF4F8] pb-5">
      <AdminNoticeMain />
    </div>
  );
};

export default page;
