import React, { useEffect, useState } from "react";
import LicenseInfo from "@/components/Shared/license-info/LicenseInfo";
import { formatTime } from "@/utility/formatTime";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import Cookies from "js-cookie";

const ProfileCard = ({ userId }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("session");
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/information/${userId}`;

  useEffect(() => {
    setLoading(true);
    const userInfoFn = async () => {
      const response = await GET_DATA_URL_TOKEN(url, token);
      const user = response?.data?.information;
      const licenses = response?.data?.licenses;
      setLicenseInfo(licenses);
      setUserInfo(user);
      setLoading(false);
    };

    userInfoFn();
  }, [userId, token, url]);

  const infoStyle =
    "text-sm text-gray-700 flex justify-between items-center py-2 px-3 bg-white rounded-md border border-gray-200 mb-2";

  return (
    <>
      {loading ? (
        <h1 className="text-center text-lg font-semibold">Loading...</h1>
      ) : (
        <div className="max-w-4xl mx-auto my-6 bg-white rounded-md shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between">
            {/* User Info */}
            <div className="w-full md:w-1/2 pr-0 md:pr-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                User Information
              </h2>

              <div className={infoStyle}>
                <span>Name</span>
                <span className="font-medium text-gray-800">
                  {userInfo?.name}
                </span>
              </div>

              <div className={infoStyle}>
                <span>Email</span>
                <span className="font-medium text-gray-800">
                  {userInfo?.email}
                </span>
              </div>

              <div className={infoStyle}>
                <span>Phone</span>
                <span className="font-medium text-gray-800">
                  {userInfo?.phone || "N/A"}
                </span>
              </div>

              <div className={infoStyle}>
                <span>Joined</span>
                <span className="font-medium text-gray-800">
                  {formatTime(userInfo?.createdAt) || "10-08-2024"}
                </span>
              </div>
            </div>

            {/* License Info */}
            <div className="w-full md:w-1/2 mt-6 md:mt-0 pl-0 md:pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                License Information
              </h3>
              {licenseInfo?.length ? (
                licenseInfo.map((license) => (
                  <LicenseInfo key={license.serviceName} license={license} />
                ))
              ) : (
                <p className="text-sm text-gray-700">No licenses available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;

// import LicenseInfo from "@/components/Shared/license-info/LicenseInfo";
// import { formatTime } from "@/utility/formatTime";
// import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";

// const ProfileCard = ({ userId }) => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [licenseInfo, setLicenseInfo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const token = Cookies.get("session");
//   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/information/${userId}`;

//   useEffect(() => {
//     setLoading(true);
//     const userInfoFn = async () => {
//       const response = await GET_DATA_URL_TOKEN(url, token);
//       const user = response?.data?.information;
//       const licenses = response.data?.licenses;
//       setLicenseInfo(licenses);
//       setUserInfo(user);
//       setLoading(false);
//     };

//     userInfoFn();
//   }, [userId, token, url]);

//   return (
//     <>
//       {loading ? (
//         <h1>Loading</h1>
//       ) : (
//         <div className="flex py-5 bg-white rounded-md mb-4 shadow-sm">
//           <div className="p-4 md:p-6 mx-5 ">
//             <div className="text-gray-600 space-y-1">
//               <div className="space-x-4 font-semibold">
//                 <span>Name : </span>
//                 <span className="text-[#26547B] font-semibold">
//                   {userInfo?.name}
//                 </span>
//               </div>

//               <div className="space-x-4 font-semibold">
//                 <span>Email : </span>
//                 <span className="text-[#26547B] font-semibold">
//                   {userInfo?.email}
//                 </span>
//               </div>

//               <div className="space-x-4 font-semibold">
//                 <span>Phone : </span>
//                 <span className="text-[#26547B] font-semibold">
//                   {userInfo?.phone ? userInfo?.phone : "phone not available"}
//                 </span>
//               </div>

//               <div className="space-x-4 font-semibold">
//                 <span>Join : </span>
//                 <span className="text-[#26547B] font-semibold">
//                   {formatTime(userInfo?.createdAt)}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="p-4 md:p-6 mx-5 ">
//             <span>License Info:</span>

//             {licenseInfo?.map((license) => (
//               <LicenseInfo
//                 key={license.serviceName}
//                 license={license}
//               ></LicenseInfo>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProfileCard;
