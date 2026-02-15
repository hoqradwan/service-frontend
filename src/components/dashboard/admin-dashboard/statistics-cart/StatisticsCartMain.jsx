// import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
// import { data } from "./data";
// import statistics from "./statistics.module.css";
// import { cookies } from "next/headers";

// const StatisticsCartMain = async () => {
//   const cookie = cookies();
//   const token = cookie.get("session").value;
//   // console.log(token,"token----")
//   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-stats`;
//   const url2 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/envato-stats`;
//   const url3 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/motion-array-stats`;
//   const url4 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/story-blocks-stats`;

//   const userStats = await GET_DATA_URL_TOKEN(url, token);
//   const envatoDownloadStats = await GET_DATA_URL_TOKEN(url2, token);
//   const motionArrayDownloadStats = await GET_DATA_URL_TOKEN(url3, token);
//   const storyBlocksDownloadStats = await GET_DATA_URL_TOKEN(url4, token);

//   const data = await userStats?.data;
//   const envatoDownload = await envatoDownloadStats?.data;
//   const motionArrayDownload = await motionArrayDownloadStats?.data;
//   const storyBlocksDownload = await storyBlocksDownloadStats?.data;

//   return (
//     <div className={`${statistics.responsive} py-6`}>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#1976D2]`}
//       >
//         <h2 className="text-[24px]">{data?.totalUsers || 0}</h2>
//         <h3 className="text-[14px]">{"Total user"}</h3>
//       </div>

//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#5C4AC7]`}
//       >
//         <h2 className="text-[24px]">{data?.todayJoinedUsers || 0}</h2>
//         <h3 className="text-[14px]">{"Today user"}</h3>
//       </div>

//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#FFB22B]`}
//       >
//         <h2 className="text-[24px]">{data?.totalActiveUsers || 0}</h2>
//         <h3 className="text-[14px]">{"Total active user"}</h3>
//       </div>

//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-teal-600`}
//       >
//         <h2 className="text-[24px]">{envatoDownload?.dailyDownloads || 0}</h2>
//         <h3 className="text-[14px]">{"Today Envato download"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#27537D]`}
//       >
//         <h2 className="text-[24px]">{envatoDownload?.totalLimit || 0}</h2>
//         <h3 className="text-[14px]">{"Total envato limit"}</h3>
//       </div>

//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#EF5350]`}
//       >
//         <h2 className="text-[24px]">{envatoDownload?.totalDownloads || 0}</h2>
//         <h3 className="text-[14px]">{"Total envato download"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#d6458e]`}
//       >
//         <h2 className="text-[24px]">
//           {storyBlocksDownload?.dailyDownloads || 0}
//         </h2>
//         <h3 className="text-[14px]">{"Today story-blocks download"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#a1804d]`}
//       >
//         <h2 className="text-[24px]">
//           {storyBlocksDownload?.totalDownloads || 0}
//         </h2>
//         <h3 className="text-[14px]">{"Total story-blocks download"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#a1804d]`}
//       >
//         <h2 className="text-[24px]">{storyBlocksDownload?.totalLimit || 0}</h2>
//         <h3 className="text-[14px]">{"Total story-blocks limit"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#4c0e5f]`}
//       >
//         <h2 className="text-[24px]">
//           {motionArrayDownload?.dailyDownloads || 0}
//         </h2>
//         <h3 className="text-[14px]">{"Today motion-array download"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#ac1ad8]`}
//       >
//         <h2 className="text-[24px]">
//           {motionArrayDownload?.totalDownloads || 0}
//         </h2>
//         <h3 className="text-[14px]">{"Total motion-array download"}</h3>
//       </div>
//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#be6fd6]`}
//       >
//         <h2 className="text-[24px]">{motionArrayDownload?.totalLimit || 0}</h2>
//         <h3 className="text-[14px]">{"Total motion-array limit"}</h3>
//       </div>

//       <div
//         className={`$
//             shadow-lg  p-4 text-white rounded-md bg-[#19d3a4]`}
//       >
//         <h2 className="text-[24px]">
//           {motionArrayDownload?.totalDownloads || 0}
//         </h2>
//         <h3 className="text-[14px]">{"Total motion-array download"}</h3>
//       </div>
//     </div>
//   );
// };

// export default StatisticsCartMain;
// "use client";
// import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
// import Cookies from "js-cookie";
// import { useState, useEffect } from "react";

// const StatisticsCartMain = ({ selectedService }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const token = Cookies.get("session");

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const url = `${process.env.NEXT_PUBLIC_BASE_URL}${selectedService.apiEndpoint}`;
//       const fetchedData = await GET_DATA_URL_TOKEN(url, token);
//       setData(fetchedData?.data || {});
//       setLoading(false);
//     };

//     if (selectedService) {
//       fetchData();
//     }
//   }, [selectedService, token]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="py-6 mt-8">
//       <div className="shadow-lg p-4 text-white rounded-md bg-[#1976D2]">
//         <h2 className="text-[24px]">{data?.dailyDownloads || 0}</h2>
//         <h3 className="text-[14px]">
//           {"Today " + selectedService.name + " download"}
//         </h3>
//       </div>
//       <div className="shadow-lg p-4 text-white rounded-md bg-[#5C4AC7]">
//         <h2 className="text-[24px]">{data?.totalDownloads || 0}</h2>
//         <h3 className="text-[14px]">
//           {"Total " + selectedService.name + " downloads"}
//         </h3>
//       </div>
//       <div className="shadow-lg p-4 text-white rounded-md bg-teal-600">
//         <h2 className="text-[24px]">{data?.totalLimit || 0}</h2>
//         <h3 className="text-[14px]">
//           {"Total " + selectedService.name + " limit"}
//         </h3>
//       </div>
//     </div>
//   );
// };

// export default StatisticsCartMain;
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const StatisticsCartMain = ({ selectedService }) => {
  const [data, setData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("session");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}${selectedService.apiEndpoint}`;
      const fetchedData = await GET_DATA_URL_TOKEN(url, token);
      setData(fetchedData?.data || {});

      // Fetch user statistics
      const userStatsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-stats`;
      const userStatsData = await GET_DATA_URL_TOKEN(userStatsUrl, token);
      setUserStats(userStatsData?.data || {});

      setLoading(false);
    };

    if (selectedService) {
      fetchData();
    }
  }, [selectedService, token]);

  if (loading)
    return <div className="text-center text-xl py-10">Loading...</div>;

  return (
    <div className="py-1 mt-2 mx-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* User Statistics */}
        <div className="relative p-2 shadow-md rounded-lg bg-blue-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {userStats?.totalUsers || 0}
            </h2>
            <p className="text-sm font-medium text-white opacity-80">
              Total Users
            </p>
          </div>
        </div>

        <div className="relative p-2 shadow-md rounded-lg bg-purple-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {userStats?.todayJoinedUsers || 0}
            </h2>
            <p className="text-sm font-medium text-white opacity-80">
              Today Users
            </p>
          </div>
        </div>

        <div className="relative p-2 shadow-md rounded-lg bg-orange-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {userStats?.totalActiveUsers || 0}
            </h2>
            <p className="text-sm font-medium text-white opacity-80">
              Active Users
            </p>
          </div>
        </div>

        {/* Service Statistics */}
        <div className="relative p-2 shadow-md rounded-lg bg-green-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {data?.dailyDownloads || 0}
            </h2>
            <p className="text-sm font-medium text-white opacity-80">
              Today {selectedService.name} Downloads
            </p>
          </div>
        </div>

        <div className="relative p-2 shadow-md rounded-lg bg-blue-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {data?.totalDownloads || 0}
            </h2>
            <p className="text-sm font-medium text-white opacity-80">
              Total {selectedService.name} Downloads
            </p>
          </div>
        </div>

        <div className="relative p-2 shadow-md rounded-lg bg-teal-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              {data?.totalLimit || 0}
            </h2>
            <p className="text-sm font-medium text-white opacity-80">
              Total {selectedService.name} Limits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCartMain;
