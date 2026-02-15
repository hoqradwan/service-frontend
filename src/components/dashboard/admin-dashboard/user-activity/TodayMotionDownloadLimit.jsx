import React from "react";

const TodayMotionDownloadLimit = ({ limitUserData }) => {
  return (
    <div className={`bg-[#b33da9] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">
          {limitUserData && limitUserData?.dailyLimit}
        </h2>
        <h3 className="text-[14px]">Today Motion Array Limit</h3>
      </div>
    </div>
  );
};

export default React.memo(TodayMotionDownloadLimit);
