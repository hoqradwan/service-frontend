"use client";
import { useState, useEffect } from "react";
import UserActivityTable from "./UserActivityTable";
import Cookies from "js-cookie";

const UserActivityLicenseMain = ({ userId }) => {
  const [userLicense, setUserLicense] = useState([]);

  const token = Cookies.get("session");

  useEffect(() => {
    const fetch_data = async () => {
      if (!userId) return; // Check userId inside the function

      let allData = [];
      let page = 1;
      let limit = 10; // Set a large enough limit for each request
      let hasMoreData = true;

      // Loop to fetch data page by page.
      while (hasMoreData) {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/user-licenses/${userId}?limit=${limit}&page=${page}`;
        try {
          // Fetch data from the API with authentication token.
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Example of token usage
            },
            cache: "no-store",
          });

          const res = await response.json();
          const data = res?.data?.data;

          // Append the fetched data and update pagination.
          if (data && data.length > 0) {
            allData = allData.concat(data);
            page += 1;
          } else {
            hasMoreData = false; // No more data to fetch.
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          hasMoreData = false; // Stop fetching in case of error.
        }
      }

      const uniqueData = Array.from(
        allData
          .reduce((map, item) => map.set(item._id, item), new Map())
          .values()
      );

      setUserLicense(uniqueData);
    };
    fetch_data();
  }, [token, userId]);

  if (!userId) return <h1>Loading...</h1>;

  return (
    <div className="m-4 p-4 rounded-md bg-white ">
      <h1 className="my-3 text-md mb-4">License List</h1>

      <UserActivityTable users={userLicense} />
    </div>
  );
};

export default UserActivityLicenseMain;
