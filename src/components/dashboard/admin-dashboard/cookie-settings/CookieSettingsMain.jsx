"use client";

import { useCallback, useEffect, useState } from "react";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import CookieSettingTable from "./CookieSettingTable";
import Cookies from "js-cookie";

const CookieSettingsMain = () => {
  const [allCookie, setAllCookie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCookies, setTotalCookies] = useState(0);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("All");
  const token = Cookies.get("session");
  const fetchCookies = useCallback(async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/all-cookies?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${search}`;
      }
      if (service && service !== "All") {
        url += `&serviceName=${service}`;
      }

      const response = await GET_DATA_URL_TOKEN(url, token);
      const result = response?.data;
      setAllCookie(result?.cookies || []);
      setTotalPages(result?.meta?.totalPages || 1);
      setTotalCookies(result?.meta?.total || 0);
      setError(null);
    } catch (error) {
      console.error(error);

      setError("Failed to fetch cookies");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, service, token]);

  useEffect(() => {
    fetchCookies();
  }, [fetchCookies]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="bg-white shadow-xl p-4 rounded-md m-5">
        <div className="mb-8">
          <h4 className="text-[18px] text-gray-500">Cookie List</h4>

          <span className="text-[14px] text-gray-400">
            Total Cookies - {totalCookies}
          </span>
        </div>

        <CookieSettingTable
          users={allCookie}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          limit={limit}
          setLimit={setLimit}
          setSearch={setSearch}
          setService={setService}
        />
      </div>
    </div>
  );
};

export default CookieSettingsMain;
