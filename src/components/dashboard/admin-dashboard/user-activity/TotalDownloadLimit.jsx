import React from "react";

const TotalDownloadLimit = ({ limitUserData }) => {
  return (
    <div className={`bg-[#EF5350] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">
          {limitUserData && limitUserData?.totalLimit}
        </h2>
        <h3 className="text-[14px]">Total envato Limit</h3>
      </div>
    </div>
  );
};

export default TotalDownloadLimit;
