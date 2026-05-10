"use client";

import React, { useCallback, useEffect, useState } from "react";
import LicenseTable from "./LicenseTable";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import Cookies from "js-cookie";
import AddLicenseModal from "@/components/Shared/create-license/AddLicenseModal";

const LicenseListTableMain = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLicense, setTotalLicense] = useState(0);

  const [search, setSearch] = useState("");
  const [service, setService] = useState("All");

  // ✅ FIX: limit must be state
  const [limit, setLimit] = useState(10);

  const token = Cookies.get("session");

  const fetchLicenses = useCallback(async () => {
    try {
      setLoading(true);

      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (service && service !== "All") url += `&serviceName=${service}`;

      const response = await GET_DATA_URL_TOKEN(url, token);

      const result = response?.data;

      setLicenses(result?.data || []);
      setTotalPages(result?.meta?.totalPages || 1);
      setTotalLicense(result?.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, token, search, service]); // ✅ FIXED dependency

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  return (
    <div>
      <div className="shadow-xl bg-white p-3 m-2">
        <div className="mb-7 flex justify-between items-center">
          <div>
            <h4 className="text-gray-500">License List</h4>
            <span className="text-gray-400 text-[14px] inline-block">
              Total Licenses - {totalLicense}
            </span>
          </div>

          <div className="sm:hidden mt-4 sm:mt-0">
            <AddLicenseModal />
          </div>
        </div>

        <LicenseTable
          licenseData={licenses}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          setSearch={setSearch}
          setService={setService}
          // ✅ FIX: pass limit control
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
};

export default LicenseListTableMain;
