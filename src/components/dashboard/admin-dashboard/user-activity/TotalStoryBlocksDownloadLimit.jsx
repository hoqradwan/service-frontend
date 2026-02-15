import React from "react";

const TotalStoryBlocksDownloadLimit= ({ limitUserData }) => {
  return (
    <div className={`bg-[#2597b9] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">
          {limitUserData && limitUserData?.totalLimit}
        </h2>
        <h3 className="text-[14px]">Total Story Blocks Limit</h3>
      </div>
    </div>
  );
};

export default TotalStoryBlocksDownloadLimit;
