"use client";
import React, { useCallback, useEffect, useState } from "react";
import LicenseTable from "./LicenseTable";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import Cookies from "js-cookie";
import AddLicenseModal from "@/components/Shared/create-license/AddLicenseModal";
import getUniqueData from "@/utility/get_unique_data";

const LicenseListTableMain = () => {
  const [allData, setAllData] = useState([]); // State for storing all license data
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [page, setPage] = useState(1); // State for current page
  const [loadedPages, setLoadedPages] = useState([]); // Track which pages are loaded
  const limit = 10; // Set the limit for each request
  const token = Cookies.get("session"); // Get the session token

  const fetchLicenses = useCallback(async () => {
    if (loadedPages.includes(page)) return; // Don't refetch the data if already loaded

    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license?limit=${limit}&page=${page}`;
    try {
      const response = await GET_DATA_URL_TOKEN(url, token);
      const data = response?.data?.data;

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
    fetchLicenses(); // Fetch data whenever page changes
  }, [page, fetchLicenses]);

  //unique data
  const uniqueData = getUniqueData(allData);
  // console.log(uniqueData, "unique licen");
  return (
    <div>
      <div className="shadow-xl bg-white p-3 m-2">
        {/* License list title and description */}
        <div className="mb-7">
          <div>
            <h4 className="text-gray-500">License List</h4>
            <span className="text-gray-400 text-[14px] inline-block">
              All Licenses
            </span>
          </div>
          <div className="sm:hidden mt-4 sm:mt-0">
            <AddLicenseModal />
          </div>
        </div>

        {/* Table component to display the fetched license data */}
        <LicenseTable licenseData={uniqueData} page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default LicenseListTableMain;
