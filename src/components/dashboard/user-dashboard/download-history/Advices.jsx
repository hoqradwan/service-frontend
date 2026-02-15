import React from "react";

const Advices = () => {
  return (
    <div className="pt-10 pb-6">
      <span className="text-gray-500 block text-[18px]">Download History</span>
      <span className="text-gray-500 block text-[14px]">
        All Service Download History
      </span>

      <div className="border-[2px] border-gray-300 rounded-md p-5 mt-2 bg-[#FFE0DB] text-[#E63946] ">
        <p className="font-bold">
          {" "}
          <span className="text-yellow-500">⚠</span> Important:
        </p>
        <ul>
          <li>
            1. For your safety, we recommend buying accounts on our official
            website, page, or WhatsApp.
          </li>
          <li>
            2. After downloading the file, you must download the license within
            5 minutes.
          </li>
          <li>
            3. Depending on the file sizes, showing the License Download option
            may take longer.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Advices;
