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
  // STABLE ITEMS (IMPORTANT FIX)
  // ---------------------------
  const displayedItems = useMemo(() => {
    return sortedItems;
  }, [sortedItems]);

  // ---------------------------
  // CELL RENDER (FIXED INDEX ISSUE)
  // ---------------------------
  const renderCell = useCallback(
    (item, columnKey, index) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "serial": {
          const safeLimit = Number(limit) || 10;
          const safePage = Number(page) || 1;

          const serial = (safePage - 1) * safeLimit + index + 1;

          return <p>{serial}</p>;
        }

        case "serviceName":
          return <p>{item.serviceName}</p>;

        case "dayLimit":
          return <p>{item.dayLimit}</p>;

        case "dailyLimit":
          return <p>{item.dailyLimit}</p>;

        case "totalLimit":
          return <p>{item.totalLimit}</p>;

        case "deviceLimit":
          return <p>{item?.deviceLimit || 1}</p>;

        case "licenseKey":
          return (
            <div className="flex flex-col py-1">
              <p>{item.licenseKey}</p>
              <p className="text-[11px]">
                <span className="block">{item.userEmail}</span>
                {item?.status === "used" && (
                  <span>Expiry: {formatTime(item?.expiryDate)}</span>
                )}
              </p>
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.status]}
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
                  onClick={() => handleDelete(item?._id)}
                  className="cursor-pointer text-danger"
                >
                  <DeleteIcon />
                </span>
              </Tooltip>

              {item.status !== "new" && (
                <Tooltip content="View User">
                  <Link href={`/dashboard/admin/user-activity/${item.user}`}>
                    <BurgerMenu />
                  </Link>
                </Tooltip>
              )}

              <Tooltip content="Copy">
                <span
                  className="cursor-pointer"
                  onClick={() => COPY_TEXT(item.serviceName, item.licenseKey)}
                >
                  <CopyIcon />
                </span>
              </Tooltip>

              {item.status !== "expired" && (
                <Tooltip content="Edit">
                  <Link href={`/dashboard/admin/update-license/${item._id}`}>
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
            setPage(1);
          }}
        />

        {/* SERVICE */}
        <Select
          className="max-w-xs"
          selectedKeys={[selectedService]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            setSelectedService(value);
            setService(value === "All" ? "" : value);
            setPage(1);
          }}
        >
          {services.map((service) => (
            <SelectItem key={service}>{service}</SelectItem>
          ))}
        </Select>

        {/* LIMIT */}
        <Select
          className="max-w-[100px]"
          selectedKeys={[String(limit)]}
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
          items={displayedItems}
          isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent={"No licenses found"}
        >
          {displayedItems.map((item, index) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey, index)}</TableCell>
              )}
            </TableRow>
          ))}
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
