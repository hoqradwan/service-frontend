"use client";
import React, { useContext, useState } from "react";
import SupportTable from "./SupportTable";
import AddSocialModal from "./AddSocialModal";
import { RoleContext } from "@/Provider/RoleContext";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";

const AdminSupportMain = () => {
  
  const [refresh, setRefresh] = useState(false);
  return (
    <div>
     
    <TopHeader2/>

    
      <div className="bg-white shadow-xl p-4 rounded-md m-5 ">
        <div className="mb-8 md:flex items-center justify-between gap-5 ">
          <div>
            <h4 className="text-[18px] text-gray-500">Social List</h4>
            <span className="text-[14px] text-gray-400">All social link</span>
          </div>
          <AddSocialModal setRefresh={setRefresh}  />
        </div>

       
        <SupportTable refresh={refresh} setRefresh={setRefresh}  />
      </div>
    </div>
  );
};

export default AdminSupportMain;
