"use client";
import { useEffect, useState } from "react";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import CookieSettingTable from "./CookieSettingTable";
import Cookies from "js-cookie";

const CookieSettingsMain = () => {
  const [allCookie, setAllCookie] = useState([]);
  const [error, setError] = useState(null);
  const token = Cookies.get("session");

  useEffect(() => {
    let allCookies = [];
    let page = 1;
    let limit = 10; // Set a large enough limit for each request
    let hasMoreData = true;

    const fetchCookies = async () => {
      // Loop to fetch data page by page.
      while (hasMoreData) {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/all-cookies?limit=${limit}&page=${page}`;

        try {
          // Fetch data from the API with authentication token.
          const response = await GET_DATA_URL_TOKEN(url, token);
          const data = response.data.cookies;

          // Append the fetched data and update pagination.
          if (data.length > 0) {
            allCookies = allCookies.concat(data);

            page += 1; // Move to the next page.
          } else {
            hasMoreData = false; // No more data to fetch.
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // console.log(error);
          setError(error.message);
          hasMoreData = false; // Stop fetching in case of error.
        }
      }

      setAllCookie(allCookies);
    };

    fetchCookies();
  }, [allCookie, token]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* user list */}
      <div className="bg-white shadow-xl p-4 rounded-md m-5">
        <div className="mb-8">
          <h4 className="text-[18px] text-gray-500">Cookie List</h4>
          <span className="text-[14px] text-gray-400">All cookie</span>
        </div>

        {/* cookie setting table.. */}
        <CookieSettingTable users={allCookie} />
      </div>
    </div>
  );
};

export default CookieSettingsMain;

// import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
// import CookieSettingTable from "./CookieSettingTable";
// import Cookies from "js-cookie";

// const CookieSettingsMain = async () => {
//   let allCookie = [];
//   let page = 1;
//   let limit = 10; // Set a large enough limit for each request
//   let hasMoreData = true;
//   const token = Cookies.get("session");
//   // Loop to fetch data page by page.
//   while (hasMoreData) {
//     const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/all-cookies?limit=${limit}&page=${page}`;
//     // console.log(url);

//     try {
//       // Fetch data from the API with authentication token.
//       const response = await GET_DATA_URL_TOKEN(url, token);
//       const data = response.data.cookies;

//       // Append the fetched data and update pagination.
//       if (data.length > 0) {
//         allCookie = allCookie.concat(data);
//         page += 1; // Move to the next page.
//       } else {
//         hasMoreData = false; // No more data to fetch.
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       hasMoreData = false; // Stop fetching in case of error.
//     }
//   }

//   return (
//     <div>
//       {/* user list */}
//       <div className="bg-white shadow-xl p-4 rounded-md m-5">
//         <div className="mb-8">
//           <h4 className="text-[18px] text-gray-500">Cookie List</h4>
//           <span className="text-[14px] text-gray-400">All cookie</span>
//         </div>

//         {/* cookie setting table.. */}
//         <CookieSettingTable users={allCookie} />
//       </div>
//     </div>
//   );
// };

// export default CookieSettingsMain;
