import AdminSupportMain from "@/components/dashboard/admin-dashboard/support/AdminSupportMain";
import React from "react";

export const metadata = {
  title: "DigitalToolsBD | Support",
  description: "DigitalToolsBD Support Page",
};


const page = () => {
  return (
    <div className="bg-[#EDF4F8] pb-5">
      <AdminSupportMain />
    </div>
  );
};

export default page;
