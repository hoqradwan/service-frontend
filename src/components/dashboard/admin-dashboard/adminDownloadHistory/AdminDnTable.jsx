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
import { columns, statusOptions, statusColorMap } from "./history";
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

const INITIAL_VISIBLE_COLUMNS = [
  "serial",
  "serviceName",
  "assets",
  "status",
  "time",
];

export default function AdminDnTable({ users }) {
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

  const [data, setData] = useState(users);
  const [page, setPage] = useState(1);
  const pages = Math.ceil(data.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);
  const token = Cookies.get("session");

  useEffect(() => {
    setData(users);
  }, [users]);

  // Memoizes the columns to display in the table header based on the visibleColumns state.
  // If visibleColumns is "all", it returns all columns. Otherwise, it filters columns to include only those specified in the visibleColumns set.
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // Memoizes the filtered items based on the search input and status filter.
  // It filters the data by checking if the service_name includes the search filter value and if the item's status is included in the statusFilter.
  const filteredItems = useMemo(() => {
    let filteredUsers = [...data];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.service.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }
    return filteredUsers;
  }, [data, filterValue, statusFilter, hasSearchFilter]);

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
  const renderCell = useCallback((user, columnKey) => {
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
            <p className="capitalize text-md">{user.service}</p>
          </div>
        );
      case "assets":
        return (
          <div className="flex flex-col">
            <p className="capitalize  text-md py-3">{user.content}</p>
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

      case "time":
        return (
          <div className="flex flex-col">
            <p className="capitalize text-md">{user.time}</p>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  // Handles the change in the number of rows per page and resets the current page to 1.
  // Updates the rowsPerPage state based on the selected value.
  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  // Handles the search input change and updates the filterValue state.
  // If the search value is empty, it clears the filterValue.
  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

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
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} download history
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
  }, [filterValue, onSearchChange, onRowsPerPageChange, data.length]);

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
          onChange={setPage}
          className="py-[2px] px-0 rounded-md bg-gray-300"
        />
      </div>
    );
  }, [page, pages, hasSearchFilter]);

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
    <Table
      isCompact
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
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
  );
}
