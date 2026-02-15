"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
} from "@nextui-org/react";
import { columns, statusOptions, statusColorMap } from "./data";
import { Select, SelectItem } from "@nextui-org/react";

import {
  BurgerMenu,
  CopyIcon,
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";
import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";
import { formatTime } from "@/utility/formatTime";
import { COPY_TEXT, HANDLE_DELETE } from "@/utility/utils";
import Link from "next/link";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import GET_ALL_PAGINATION_DATA from "@/utility/get_whole_pagination_data";
import { filterData } from "@/utility/filter_data";

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

export default function LicenseTable({ licenseData, page, setPage }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });

  const [data, setData] = useState(licenseData);

  const [allData, setAllData] = useState([]);
  const pages = Math.ceil(data.length / rowsPerPage) + 1;
  const hasSearchFilter = Boolean(filterValue);
  const token = Cookies.get("session");
  const [selectedService, setSelectedService] = useState("All");
  const [services, setServices] = useState(["All"]);

  // Load all data if needed for filtering
  useEffect(() => {
    if (filterValue && allData.length === 0) {
      (async () => {
        const result = await GET_ALL_PAGINATION_DATA(token);
        setAllData(result);
      })();
    }

    const items =
      allData?.length > 0 && hasSearchFilter ? allData : licenseData;
    setData(filterData(items, filterValue));
  }, [filterValue, allData, token, licenseData, hasSearchFilter]);

  useEffect(() => {
    // Extract unique services from licenseData
    const uniqueServices = [
      "All",
      ...new Set(licenseData.map((license) => license.serviceName)),
    ];
    setServices(uniqueServices);
  }, [licenseData]);

  // === delete one item by user id
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const response = await HANDLE_DELETE(id, token);
        if (response.success)
          setData((prevData) => prevData.filter((item) => item._id !== id));
      }
    },
    [token]
  );

  useEffect(() => {
    setData(licenseData);
  }, [licenseData]);

  // Memoizes the columns to display in the table header based on the visibleColumns state.
  // If visibleColumns is "all", it returns all columns. Otherwise, it filters columns to include only those specified in the visibleColumns set.
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // Memoizes the filtered items based on the search input and status filter.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...data];
    console.log("Initial Data:", data); // Check initial data

    if (hasSearchFilter) {
      console.log("Search Filter Enabled:", filterValue); // Debug filterValue

      filteredUsers = filteredUsers.filter(
        (user) =>
          user?.userEmail?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.licenseKey?.toLowerCase().includes(filterValue.toLowerCase()) ||
          user?.serviceName?.toLowerCase().includes(filterValue.toLowerCase())
      );
      console.log("Filtered by Search:", filteredUsers); // Check after search filtering
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    if (selectedService !== "All") {
      filteredUsers = filteredUsers.filter(
        (user) => user.serviceName === selectedService
      );
    }
    return filteredUsers;
  }, [data, filterValue, hasSearchFilter, statusFilter, selectedService]);

  // Memoizes the current page of items to display based on the page number and rowsPerPage.
  // It calculates the start and end indices for the slice and returns the items for the current page.
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // Memoizes the sorted items based on the sortDescriptor.
  // It creates a copy of the items array and sorts it according to the column and direction specified in sortDescriptor.
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Renders a cell based on the columnKey and user data.
  // Switches between different cases to render specific content based on the column key, such as serviceName, dayLimit, licenseKey, and actions.
  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "serial":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-md">{user.serial}</p>
            </div>
          );
        case "serviceName":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-md">{user.serviceName}</p>
            </div>
          );
        case "dayLimit":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 font-bold text-md">
                {user.dayLimit}
              </p>
            </div>
          );
        case "dailyLimit":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 font-bold text-md">
                {user.dailyLimit}
              </p>
            </div>
          );
        case "totalLimit":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 font-bold text-md">
                {user.totalLimit}
              </p>
            </div>
          );
        case "deviceLimit":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 font-bold text-md">
                {user?.deviceLimit || 1}
              </p>
            </div>
          );
        case "licenseKey":
          return (
            <div className="flex flex-col py-1">
              <p className="capitalize  text-md">{user.licenseKey}</p>
              <p className="text-[11px] capitalize ">
                <span className="block">{user.userEmail} </span>

                {user?.status === "used" && (
                  <span> Expiry: {formatTime(user?.expiryDate)}</span>
                )}
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
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              {/* delete button */}
              <Tooltip color="danger" content={`Delete license `}>
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleDelete(user?._id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>

              {/* view user button */}
              {user.status !== "new" && (
                <Tooltip color="success" content={"View user info"}>
                  <Link href={`/dashboard/admin/user-activity/${user.user}`}>
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <BurgerMenu />
                    </span>
                  </Link>
                </Tooltip>
              )}

              {/* copy button */}
              <Tooltip color="secondary" content={`Copy license key `}>
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => COPY_TEXT(user.serviceName, user.licenseKey)}
                >
                  <CopyIcon />
                </span>
              </Tooltip>

              {/* edit button */}
              {user.status !== "expired" && (
                <Tooltip color="primary" content={`Edit license `}>
                  <Link
                    href={`/dashboard/admin/update-license/${user._id}`}
                    className="text-lg text-danger cursor-pointer active:opacity-50"
                  >
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
    [handleDelete]
  );

  // Handles the change in the number of rows per page and resets the current page to 1.
  // Updates the rowsPerPage state based on the selected value.
  const onRowsPerPageChange = useCallback(
    (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage]
  );

  // Handles the search input change and updates the filterValue state.
  // If the search value is empty, it clears the filterValue.
  const onSearchChange = useCallback(
    (value) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    [setPage]
  );

  // Renders the top content of the table, including the search input and rows per page selector.
  // It shows the total number of licenses and allows users to select the number of rows per page.
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
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <Select
            className="max-w-xs"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {services.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} license
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
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
    onSearchChange,
    onRowsPerPageChange,
    selectedService,
    services,
    data.length,
  ]);

  // Renders the bottom content of the table, including the pagination controls.
  // It provides pagination options and updates the current page.
  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end mt-[30px]">
        <Pagination
          showControls
          classNames={{ cursor: "bg-foreground text-background" }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={(event) => setPage(event)}
          className="py-[2px] px-0 rounded-md bg-gray-300"
        />
      </div>
    );
  }, [page, pages, hasSearchFilter, setPage]);

  // Defines custom class names for the table components.
  // Used to style the table wrapper, table header cells, and table data cells.
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
    []
  );

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <Table
        className="w-full"
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={hasSearchFilter ? null : bottomContent}
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
          items={hasSearchFilter ? filteredItems : sortedItems} // Display filtered or sorted items
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
    </div>
  );
}
