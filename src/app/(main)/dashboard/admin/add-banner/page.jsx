import AddBannerMain from "@/components/dashboard/admin-dashboard/add-banner/AddBannerMain";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import React from "react";
export const metadata = {
  title: "DigitalToolsBD | Banner",
  description: "DigitalToolsBD Banner Page",
};
const page = () => {
  return (
    <div>
      <TopHeader2 />
      <div className="bg-[#EDF4F8] py-6">
        <AddBannerMain />
      </div>
    </div>
  );
};

export default page;
