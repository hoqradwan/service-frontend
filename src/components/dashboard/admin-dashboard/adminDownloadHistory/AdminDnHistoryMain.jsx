"use client";
import React, { useEffect, useState, useRef } from "react";
import AdminDnTable from "./AdminDnTable";
import Cookies from "js-cookie";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";

const AdminDnHistoryMain = ({ userId }) => {
  const [userDownloadLicense, setUserDownloadLicense] = useState([]);

  const token = Cookies.get("session");
  

  useEffect(() => {
    const fetch_data = async () => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-download/${userId}`;
      try {
        const response = await GET_DATA_URL_TOKEN(url, token);
  
        const res = await response;
        const data = res?.data?.downloads;
  
        setUserDownloadLicense(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetch_data(); // Trigger the fetch only once when the component mounts
  }, [token, userId]); // Empty dependency array to ensure this runs only once

  return (
    <div>
      <div className="shadow-xl bg-white p-3 md:m-5 m-4">
        <div className="mb-7">
          <h4 className="text-gray-500">Download History</h4>
        </div>
        {/* Table component to display the fetched license data */}
        <AdminDnTable users={userDownloadLicense} />
      </div>
    </div>
  );
};

export default AdminDnHistoryMain;
