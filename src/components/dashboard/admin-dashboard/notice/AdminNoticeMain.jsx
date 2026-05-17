"use client";

import React, { useState } from "react";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import NoticeTable from "./NoticeTable";
import AddNoticeModal from "./AddNoticeModal";

const AdminNoticeMain = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div>
      <TopHeader2 />

      <div className="bg-white shadow-xl p-4 rounded-md m-5">
        <div className="mb-8 md:flex items-center justify-between gap-5">
          <div>
            <h4 className="text-[18px] text-gray-500">Notice List</h4>

            <span className="text-[14px] text-gray-400">
              All service notices
            </span>
          </div>

          <AddNoticeModal setRefresh={setRefresh} />
        </div>

        <NoticeTable refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};

export default AdminNoticeMain;
