"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { columns, statusColorMap } from "./cookie_data";
import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";
import {
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";
import AddCookieModal from "./AddCookieModal";
import { formatDate } from "@/utility/formatHours";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import UpdateCookie from "./UpdateCookie";

const INITIAL_VISIBLE_COLUMNS = [
  "serial",
  "serviceName",
  "account",
  "email",
  "cookie",
  "joining",
  "source",
  "status",
  "action",
];

const STATIC_SERVICES = ["All", "envato", "story-blocks", "freepik"];

export default function CookieSettingTable({
  users,
  loading,
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  setSearch,
  setService,
}) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "serial",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedService, setSelectedService] = useState("All");
  const [data, setData] = useState(users);
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get("session");

  useEffect(() => {
    setData(users);
  }, [users]);

  // ---------------------------
  // DELETE COOKIE
  // ---------------------------
  const deleteCookie = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to delete cookie");
        }

        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success("Cookie deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    },
    [token],
  );

  // ---------------------------
  // EDIT
  // ---------------------------
  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // ---------------------------
  // COPY COOKIE
  // ---------------------------
  const handleTooltip = (key) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied");
  };

  // ---------------------------
  // HEADER COLUMNS
  // ---------------------------
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  // ---------------------------
  // SORTED ITEMS
  // ---------------------------
  const sortedItems = useMemo(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [data, sortDescriptor]);

  // ---------------------------
  // RENDER CELL
  // ---------------------------
  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "serial":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md my-5 block">
                {user?.serial}
              </p>
            </div>
          );

        case "serviceName":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md my-5 block">
                {user?.serviceName}
              </p>
            </div>
          );

        case "account":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md my-5 block">
                {user?.account}
              </p>
            </div>
          );

        case "email":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md">
                {user?.email}
              </p>
            </div>
          );

        case "cookie":
          return (
            <div className="flex flex-col">
              <Tooltip content={"click to copy"}>
                <p
                  className="capitalize text-default-500 text-md cursor-pointer"
                  onClick={() => handleTooltip(user?.cookie)}
                >
                  {user?.cookie?.length >= 20
                    ? `${user.cookie.slice(0, 15)} ...`
                    : user?.cookie}
                </p>
              </Tooltip>
            </div>
          );

        case "joining":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md flex">
                {formatDate(user?.createdAt)}
              </p>
            </div>
          );

        case "source":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 font-bold text-md">
                {user?.source}
              </p>
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[user.status]}
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
          );

        case "action":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit user">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => handleEdit(user)}
                >
                  <EditOutline />
                </span>
              </Tooltip>

              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => deleteCookie(user?._id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [deleteCookie],
  );

  // ---------------------------
  // SEARCH
  // ---------------------------
  const onSearchChange = useCallback(
    (value) => {
      setFilterValue(value);
      setSearch(value);
      setPage(1);
    },
    [setSearch, setPage],
  );

  // ---------------------------
  // LIMIT CHANGE
  // ---------------------------
  const onRowsPerPageChange = useCallback(
    (e) => {
      setLimit(Number(e.target.value));
      setPage(1);
    },
    [setLimit, setPage],
  );

  // ---------------------------
  // TOP CONTENT
  // ---------------------------
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by service..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => {
              setFilterValue("");
              setSearch("");
              setPage(1);
            }}
            onValueChange={onSearchChange}
          />

          <Select
            className="max-w-xs"
            selectedKeys={[selectedService]}
            onChange={(e) => {
              setSelectedService(e.target.value);
              setService(e.target.value);
              setPage(1);
            }}
          >
            {STATIC_SERVICES.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </Select>

          <AddCookieModal setRefresh={setRefresh} />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total Cookies</span>

          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              value={limit}
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    limit,
    onRowsPerPageChange,
    onSearchChange,
    selectedService,
    setPage,
    setSearch,
    setService,
  ]);

  // ---------------------------
  // BOTTOM CONTENT
  // ---------------------------
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end mt-[30px]">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={page}
          total={totalPages}
          variant="light"
          onChange={setPage}
          className="py-[2px] px-0 rounded-md bg-gray-300"
        />
      </div>
    );
  }, [page, totalPages, setPage]);

  // ---------------------------
  // CLASSNAMES
  // ---------------------------
  const classNames = useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],

      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],

      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden">
        <Table
          className="w-full"
          isCompact
          removeWrapper
          aria-label="Cookie table"
          bottomContent={bottomContent}
          classNames={classNames}
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="text-teal-700 text-[13px]"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            emptyContent={"No data available in table"}
            items={sortedItems}
            isLoading={loading}
            loadingContent={<Spinner />}
          >
            {(item) => (
              <TableRow
                key={item._id}
                className={`${
                  item.serial % 2 === 0 ? "bg-[#F2F4F8]" : "bg-white"
                } border-b-[1px] border-b-gray-200`}
              >
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <UpdateCookie
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedItem={selectedItem}
          refreshData={() => setRefresh((prev) => !prev)}
        />
      </div>
    </>
  );
}
