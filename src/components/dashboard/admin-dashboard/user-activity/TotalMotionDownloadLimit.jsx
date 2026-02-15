import React from "react";

const TotalMotionDownloadLimit= ({ limitUserData }) => {
  return (
    <div className={`bg-[#ce46c3] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">
          {limitUserData&& limitUserData?.totalLimit}
        </h2>
        <h3 className="text-[14px]">Total Motion Array Limit</h3>
      </div>
    </div>
  );
};

export default TotalMotionDownloadLimit;
