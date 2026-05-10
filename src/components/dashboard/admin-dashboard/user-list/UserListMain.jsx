"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import UserListTable from "./UserListTable";
import Cookies from "js-cookie";

const UserListMain = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const token = Cookies.get("session");
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-list?page=${page}&limit=${limit}`;

      if (search) {
        url += `&search=${search}`;
      }

      const response = await GET_DATA_URL_TOKEN(url, token);

      const result = response?.data;

      setUsers(result?.users || []);

      setTotalPages(result?.meta?.totalPages || 1);

      setTotalUsers(result?.meta?.totalUsers || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="py-6">
      <div className="bg-white shadow-xl p-4 rounded-md m-5">
        <div className="mb-8">
          <h4 className="text-[18px] text-gray-500">User List</h4>

          <span className="text-[14px] text-gray-400">
            Total users - {totalUsers}
          </span>
        </div>

        <UserListTable
          users={users}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
};

export default UserListMain;
