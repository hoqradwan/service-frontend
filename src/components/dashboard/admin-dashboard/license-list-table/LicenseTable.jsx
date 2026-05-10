"use client";

import React, { useState, useMemo, useCallback } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Chip,
  Pagination,
  Tooltip,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";

import {
  BurgerMenu,
  CopyIcon,
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";

import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";

import { columns, statusColorMap } from "./data";

import { formatTime } from "@/utility/formatTime";
import { COPY_TEXT, HANDLE_DELETE } from "@/utility/utils";

import Link from "next/link";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const INITIAL_VISIBLE_COLUMNS = [
  "serial",
  "serviceName",
  "dayLimit",
  "dailyLimit",
  "totalLimit",
  "licenseKey",
  "status",
  "actions",
  "deviceLimit",
];

export default function LicenseTable({
  licenseData,
  loading,
  page,
  setPage,
  totalPages,
  setSearch,
  setService,
  limit,
  setLimit,
}) {
  const [filterValue, setFilterValue] = useState("");

  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));

  const [sortDescriptor, setSortDescriptor] = useState({
    column: "serial",
    direction: "ascending",
  });

  // ✅ DEFAULT VALUE FIXED
  const [selectedService, setSelectedService] = useState("All");

  const services = ["All", "Envato", "Story-blocks", "Freepik"];

  const token = Cookies.get("session");

  // ---------------------------
  // DELETE
  // ---------------------------
  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F31260",
        cancelButtonColor: "#2C537A",
        confirmButtonText: "Delete",
      });

      if (result.isConfirmed) {
        await HANDLE_DELETE(id, token);
      }
    },
    [token],
  );

  // ---------------------------
  // COLUMNS
  // ---------------------------
  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  // ---------------------------
  // SORT
  // ---------------------------
  const sortedItems = useMemo(() => {
    return [...licenseData].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [licenseData, sortDescriptor]);

  // ---------------------------
  // CELL RENDER
  // ---------------------------
  const renderCell = useCallback(
    (user, columnKey, index) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "serial":
          const serial = (page - 1) * limit + index + 1;
          return <p>{serial}</p>;

        case "serviceName":
          return <p>{user.serviceName}</p>;

        case "dayLimit":
          return <p>{user.dayLimit}</p>;

        case "dailyLimit":
          return <p>{user.dailyLimit}</p>;

        case "totalLimit":
          return <p>{user.totalLimit}</p>;

        case "deviceLimit":
          return <p>{user?.deviceLimit || 1}</p>;

        case "licenseKey":
          return (
            <div className="flex flex-col py-1">
              <p>{user.licenseKey}</p>
              <p className="text-[11px]">
                <span className="block">{user.userEmail}</span>
                {user?.status === "used" && (
                  <span>Expiry: {formatTime(user?.expiryDate)}</span>
                )}
              </p>
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );

        case "actions":
          return (
            <div className="flex items-center gap-2">
              <Tooltip content="Delete">
                <span
                  onClick={() => handleDelete(user?._id)}
                  className="cursor-pointer text-danger"
                >
                  <DeleteIcon />
                </span>
              </Tooltip>

              {user.status !== "new" && (
                <Tooltip content="View User">
                  <Link href={`/dashboard/admin/user-activity/${user.user}`}>
                    <BurgerMenu />
                  </Link>
                </Tooltip>
              )}

              <Tooltip content="Copy">
                <span
                  className="cursor-pointer"
                  onClick={() => COPY_TEXT(user.serviceName, user.licenseKey)}
                >
                  <CopyIcon />
                </span>
              </Tooltip>

              {user.status !== "expired" && (
                <Tooltip content="Edit">
                  <Link href={`/dashboard/admin/update-license/${user._id}`}>
                    <EditOutline />
                  </Link>
                </Tooltip>
              )}
            </div>
          );

        default:
          return cellValue;
      }
    },
    [handleDelete, page, limit],
  );

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      {/* SEARCH + FILTER */}
      <div className="flex justify-between gap-3 items-end mb-4">
        <Input
          isClearable
          classNames={{
            base: "w-full sm:max-w-[44%]",
            inputWrapper: "border-1",
          }}
          placeholder="Search..."
          size="sm"
          startContent={<SearchIcon className="text-default-300" />}
          value={filterValue}
          variant="bordered"
          onClear={() => {
            setFilterValue("");
            setSearch("");
          }}
          onValueChange={(val) => {
            setFilterValue(val);
            setSearch(val);
          }}
        />

        {/* SERVICE SELECT (FIXED DEFAULT) */}
        <Select
          className="max-w-xs"
          selectedKeys={[selectedService]} // ✅ FIXED
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            setSelectedService(value);
            setService(value === "All" ? "" : value);
          }}
        >
          {services.map((service) => (
            <SelectItem key={service}>{service}</SelectItem>
          ))}
        </Select>

        {/* LIMIT SELECT (FIXED DEFAULT) */}
        <Select
          className="max-w-[100px]"
          selectedKeys={[String(limit)]} // ✅ FIXED
          onSelectionChange={(keys) => {
            const value = Number(Array.from(keys)[0]);
            setLimit(value);
            setPage(1);
          }}
        >
          <SelectItem key="10">10</SelectItem>
          <SelectItem key="15">15</SelectItem>
          <SelectItem key="20">20</SelectItem>
        </Select>
      </div>

      {/* TABLE */}
      <Table
        removeWrapper
        aria-label="License Table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={sortedItems}
          isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent={"No licenses found"}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, sortedItems.indexOf(item))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <div className="flex justify-end mt-5">
        <Pagination
          showControls
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
