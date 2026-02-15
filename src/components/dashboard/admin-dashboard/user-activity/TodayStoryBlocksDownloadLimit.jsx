import React from "react";

const TodayStoryBlocksDownloadLimit = ({ limitUserData }) => {
  return (
    <div className={`bg-[#FFB22B] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">
          {limitUserData && limitUserData?.dailyLimit}
        </h2>
        <h3 className="text-[14px]">Today story-blocks Limit</h3>
      </div>
    </div>
  );
};

export default React.memo(TodayStoryBlocksDownloadLimit);
