"use client";
import React, { useCallback, useEffect, useState } from "react";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import UserListTable from "./UserListTable";
import Cookies from "js-cookie";
import getUniqueUserData from "@/utility/get_unique_user_data";

const UserListMain = () => {
  const [allData, setAllData] = useState([]); // State for user list
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [page, setPage] = useState(1); // State for current page
  const [loadedPages, setLoadedPages] = useState([]); // Track which pages are loaded
  const token = Cookies.get("session"); // Get the session token
  console.log(token, "user");
  const limit = 10; // Set the limit for each request
  const fetchUsers = useCallback(async () => {
    if (loadedPages.includes(page)) return; // Don't refetch the data if already loaded

    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-list?limit=${limit}&page=${page}`;
    try {
      const response = await GET_DATA_URL_TOKEN(url, token);
      console.log(response);
      const data = response?.data?.users;
      console.log(data);
      if (allData.length === 0) {
        setAllData(data);
        setLoading(false);
        setError(null);
        return;
      }

      setAllData((prevData) => [...prevData, ...data]); // Concatenate new data
      // Mark the page as loaded
      setLoadedPages((prevPages) => [...prevPages, page]);

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setError("Error fetching data");
    }
  }, [loadedPages, page, limit, token, allData]);

  useEffect(() => {
    fetchUsers(); // Fetch data whenever page changes
  }, [page, fetchUsers]);
  // Empty dependency array to run only once

  //unique data
  const uniqueData = getUniqueUserData(allData);
  console.log(uniqueData, "unique user");

  return (
    <div className="py-6">
      {/* User list */}
      <div className="bg-white shadow-xl p-4 rounded-md m-5">
        <div className="mb-8">
          <h4 className="text-[18px] text-gray-500">User List</h4>
          <span className="text-[14px] text-gray-400">All users</span>
        </div>

        {/* User list table */}
        <UserListTable users={uniqueData} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default UserListMain;
