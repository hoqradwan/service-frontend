"use client";

import React, { useState, useCallback, useMemo } from "react";
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
  Button,
  Spinner,
} from "@nextui-org/react";
import { columns, statusColorMap } from "./user_data";
import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";
import Link from "next/link";
import { formatDate } from "@/utility/formatHours";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import Cookies from "js-cookie";
import generatePasswordModal from "@/utility/generatePasswordModal";
import { RotatingLines } from "react-loader-spinner";
import toast from "react-hot-toast";

const INITIAL_VISIBLE_COLUMNS = [
  "serial",
  "name",
  "email",
  "phone",
  "joining",
  "license",
  "status",
  "action",
];

export default function UserListTable({
  users,
  loading,
  page,
  setPage,
  totalPages,
  search,
  setSearch,
  limit,
  setLimit,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [filterValue, setFilterValue] = useState(search || "");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "serial",
    direction: "ascending",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const token = Cookies.get("session");

  // ---------------------------
  // DOWNLOAD EXCEL
  // ---------------------------
  const downloadExcel = async () => {
    try {
      setIsDownloading(true);

      toast.loading("Preparing Excel file...", {
        id: "downloadExcel",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/export`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "users.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Excel file downloaded successfully!", {
        id: "downloadExcel",
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.message || "Failed to download Excel file", {
        id: "downloadExcel",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------------------------
  // GENERATE PASSWORD
  // ---------------------------
  const generatePassword = useCallback(
    async (id) => {
      setPasswordLoading(true);

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/admin-password/${id}`;

      try {
        const response = await GET_DATA_URL_TOKEN(url, token);

        const password = response?.data?.adminPassword;

        generatePasswordModal(password);
      } catch (error) {
        console.error("Error generating password:", error);
      } finally {
        setPasswordLoading(false);
      }
    },
    [token],
  );

  // ---------------------------
  // TABLE COLUMNS
  // ---------------------------
  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  // ---------------------------
  // SORTING
  // ---------------------------
  const sortedItems = useMemo(() => {
    return [...users].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [users, sortDescriptor]);

  // ---------------------------
  // RENDER CELL
  // ---------------------------
  const renderCell = useCallback(
    (user, columnKey, index) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "serial":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md my-5 block">
                {(page - 1) * limit + index + 1}
              </p>
            </div>
          );

        case "name":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md my-5 block">
                {user.name}
              </p>
            </div>
          );

        case "email":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md">
                {user.email}
              </p>
            </div>
          );

        case "phone":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md">
                {user.phone}
              </p>
            </div>
          );

        case "joining":
          return (
            <div className="flex flex-col">
              <p className="capitalize text-default-500 text-md flex">
                {formatDate(user.createdAt)}
              </p>
            </div>
          );

        case "license":
          return (
            <div className="py-1 flex flex-col capitalize bg-[#61d474] text-white text-center rounded-md font-bold text-md">
              <Link href={`/dashboard/admin/user-list/${user._id}`}>
                <p>{user?.totalLicenses}</p>
              </Link>
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[user.isActive ? "active" : "deactivate"]}
              size="sm"
              variant="dot"
            >
              {user.isActive ? "Active" : "Inactive"}
            </Chip>
          );

        case "action":
          return (
            <div className="flex flex-col py-1">
              <p
                className="cursor-pointer capitalize text-[12px] text-center text-white bg-[#1976D2] rounded-md p-1"
                onClick={() => generatePassword(user._id)}
              >
                Generate
              </p>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [generatePassword, page, limit],
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
            placeholder="Search by name or email or number..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => {
              setFilterValue("");
              setSearch("");
            }}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total Users</span>

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
  }, [filterValue, onSearchChange, limit, onRowsPerPageChange, setSearch]);

  // ---------------------------
  // PAGINATION
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
  // TABLE CLASSNAMES
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
    <div className="overflow-x-auto overflow-y-hidden">
      {/* DOWNLOAD BUTTON */}
      <Button onClick={downloadExcel} disabled={isDownloading} color="primary">
        {isDownloading ? (
          <>
            <RotatingLines
              visible={true}
              height="20"
              width="20"
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
            Downloading...
          </>
        ) : (
          "Download Excel sheet"
        )}
      </Button>

      {/* TABLE */}
      <Table
        className="w-full mt-5"
        isCompact
        removeWrapper
        aria-label="User table"
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
          items={sortedItems}
          isLoading={loading || passwordLoading}
          loadingContent={<Spinner />}
          emptyContent={"No data available in table"}
        >
          {(item) => (
            <TableRow
              key={item._id}
              className={`${
                item.serial % 2 === 0 ? "bg-[#F2F4F8]" : "bg-white"
              } border-b-[1px] border-b-gray-200`}
            >
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey, sortedItems.indexOf(item))}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// =============================================
// =============================================
// =============================================
// "use client";
// import React, { useState, useCallback, useEffect } from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Input,
//   Chip,
//   Pagination,
//   Tooltip,
//   Button,
// } from "@nextui-org/react";
// import { columns, statusOptions, statusColorMap } from "./user_data";
// import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";
// import Link from "next/link";
// import { formatTime } from "@/utility/formatTime";
// import { formatDate } from "@/utility/formatHours";
// import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
// import Cookies from "js-cookie";
// import generatePasswordModal from "@/utility/generatePasswordModal";

// import * as XLSX from "xlsx";
// import GET_ALL_PAGINATION_USER_DATA from "@/utility/get_whole_pagination_user_data";
// import { filterUserData } from "@/utility/filter_user_data";
// import { RotatingLines } from "react-loader-spinner";
// import toast from "react-hot-toast";

// const INITIAL_VISIBLE_COLUMNS = [
//   "serial",
//   "name",
//   "email",
//   "phone",
//   "joining",
//   "license",
//   "status",
//   "action",
// ];

// export default function UserListTable({ users, page, setPage }) {
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
//   const [visibleColumns, setVisibleColumns] = React.useState(
//     new Set(INITIAL_VISIBLE_COLUMNS),
//   );
//   const [statusFilter, setStatusFilter] = React.useState("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [sortDescriptor, setSortDescriptor] = React.useState({
//     column: "age",
//     direction: "ascending",
//   });
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(users);
//   const [allData, setAllData] = useState([]);
//   const pages = Math.ceil(data.length / rowsPerPage) + 1;
//   const hasSearchFilter = Boolean(filterValue);
//   const token = Cookies.get("session");

//   useEffect(() => {
//     if (filterValue && allData.length === 0) {
//       (async () => {
//         const result = await GET_ALL_PAGINATION_USER_DATA(token);
//         // console.log("user table", result);
//         setAllData(result);
//       })();
//     }

//     const items = allData?.length > 0 && hasSearchFilter ? allData : users;
//     setData(filterUserData(items, filterValue));
//   }, [filterValue, allData, token, users, hasSearchFilter]);

//   /**
//    *
//    * @param {id} id
//    * generate password by admin
//    */
//   //download excel sheet

//   const downloadExcel = async () => {
//     try {
//       setIsDownloading(true);

//       toast.loading("Preparing Excel file...", {
//         id: "downloadExcel",
//       });

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/export`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to download file");
//       }

//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");

//       link.href = url;
//       link.download = "users.xlsx";

//       document.body.appendChild(link);

//       link.click();

//       link.remove();

//       window.URL.revokeObjectURL(url);

//       toast.success("Excel file downloaded successfully!", {
//         id: "downloadExcel",
//       });
//     } catch (error) {
//       console.error(error);

//       toast.error(error?.message || "Failed to download Excel file", {
//         id: "downloadExcel",
//       });
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const generatePassword = useCallback(
//     async (id) => {
//       setLoading(true); // Optional: Set loading to true when the request starts
//       const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/admin-password/${id}`;

//       try {
//         const response = await GET_DATA_URL_TOKEN(url, token);
//         const res = await response;
//         const password = res.data.adminPassword;

//         generatePasswordModal(password);
//       } catch (error) {
//         console.error("Error generating password:", error);
//       } finally {
//         setLoading(false); // Optional: Set loading to false after the request finishes
//       }
//     },
//     [token, setLoading], // Dependencies array
//   );
//   useEffect(() => {
//     setData(users);
//   }, [users]);
//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return columns;

//     return columns.filter((column) =>
//       Array.from(visibleColumns).includes(column.uid),
//     );
//   }, [visibleColumns]);

//   // filter user by brand name
//   const filteredItems = React.useMemo(() => {
//     let filteredUsers = [...data];
//     console.log("Initial Data:", data); // Check initial data

//     if (hasSearchFilter) {
//       console.log("Search Filter Enabled:", filterValue); // Debug filterValue

//       filteredUsers = filteredUsers.filter(
//         (user) =>
//           user?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
//           user?.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
//           user?.phone?.toString().includes(filterValue),
//       );
//       console.log("Filtered by Search:", filteredUsers); // Check after search filtering
//     }
//     if (
//       statusFilter !== "all" &&
//       Array.from(statusFilter).length !== statusOptions.length
//     ) {
//       filteredUsers = filteredUsers.filter((user) =>
//         Array.from(statusFilter).includes(user.status),
//       );
//     }

//     return filteredUsers;
//   }, [data, filterValue, statusFilter, hasSearchFilter]);

//   // divide number of page number
//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);
//   }, [page, filteredItems, rowsPerPage]);

//   // sorted item
//   const sortedItems = React.useMemo(() => {
//     return [...items].sort((a, b) => {
//       const first = a[sortDescriptor.column];
//       const second = b[sortDescriptor.column];
//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   // total number of cell
//   const renderCell = React.useCallback(
//     (user, columnKey) => {
//       const cellValue = user[columnKey];

//       switch (columnKey) {
//         case "serial":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md my-5 block">
//                 {user.serial}
//               </p>
//             </div>
//           );
//         case "name":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md my-5 block">
//                 {user.name}
//               </p>
//             </div>
//           );

//         case "email":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md">
//                 {user.email}
//               </p>
//             </div>
//           );

//         case "phone":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md">
//                 {user.phone}
//               </p>
//             </div>
//           );

//         case "joining":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md flex">
//                 {formatDate(user.createdAt)}
//               </p>
//             </div>
//           );

//         case "license":
//           return (
//             <div className="py-1  flex flex-col capitalize bg-[#61d474] text-white text-center rounded-md font-bold text-md">
//               <Link href={`/dashboard/admin/user-list/${user._id}`}>
//                 <p>{user?.totalLicenses} </p>
//               </Link>
//             </div>
//           );

//         case "status":
//           return (
//             <Chip
//               className="capitalize border-none gap-1 text-default-600"
//               color={statusColorMap[user.isActive ? "active" : "deactivate"]}
//               size="sm"
//               variant="dot"
//             >
//               {user.isActive ? "Active" : "Inactive"}
//             </Chip>
//           );

//         case "action":
//           return (
//             <div className="flex flex-col py-1">
//               <p
//                 className="cursor-pointer capitalize text-[12px] text-center text-white bg-[#1976D2] rounded-md p-1"
//                 onClick={() => generatePassword(user._id)}
//               >
//                 {"generate"}
//               </p>
//             </div>
//           );

//         default:
//           return cellValue;
//       }
//     },
//     [generatePassword],
//   );

//   const onRowsPerPageChange = React.useCallback(
//     (e) => {
//       setRowsPerPage(Number(e.target.value));
//       setPage(1);
//     },
//     [setPage],
//   );

//   const onSearchChange = React.useCallback(
//     (value) => {
//       if (value) {
//         setFilterValue(value);
//         setPage(1);
//       } else {
//         setFilterValue("");
//       }
//     },
//     [setPage],
//   );

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-3 items-end">
//           <Input
//             isClearable
//             classNames={{
//               base: "w-full sm:max-w-[44%]",
//               inputWrapper: "border-1",
//             }}
//             placeholder="Search by name..."
//             size="sm"
//             startContent={<SearchIcon className="text-default-300" />}
//             value={filterValue}
//             variant="bordered"
//             onClear={() => setFilterValue("")}
//             onValueChange={onSearchChange}
//           />
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-default-400 text-small">
//             Total {data.length} users
//           </span>
//           <label className="flex items-center text-default-400 text-small">
//             Rows per page:
//             <select
//               className="bg-transparent outline-none text-default-400 text-small"
//               onChange={onRowsPerPageChange}
//             >
//               <option value="10">10</option>
//               <option value="15">15</option>
//               <option value="20">20</option>
//             </select>
//           </label>
//         </div>
//       </div>
//     );
//   }, [filterValue, onSearchChange, data.length, onRowsPerPageChange]);

//   // pagination
//   const bottomContent = React.useMemo(() => {
//     return (
//       <div className="py-2 px-2 flex justify-end mt-[30px]">
//         <Pagination
//           showControls
//           classNames={{
//             cursor: "bg-foreground text-background",
//           }}
//           color="default"
//           isDisabled={hasSearchFilter}
//           page={page}
//           total={pages}
//           variant="light"
//           onChange={setPage}
//           className="py-[2px] px-0 rounded-md bg-gray-300"
//         />
//       </div>
//     );
//   }, [page, pages, setPage, hasSearchFilter]);

//   // make custom class
//   const classNames = React.useMemo(
//     () => ({
//       wrapper: ["max-h-[382px]", "max-w-3xl"],
//       th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
//       td: [
//         // changing the rows border radius
//         // first
//         "group-data-[first=true]:first:before:rounded-none",
//         "group-data-[first=true]:last:before:rounded-none",
//         // middle
//         "group-data-[middle=true]:before:rounded-none",
//         // last
//         "group-data-[last=true]:first:before:rounded-none",
//         "group-data-[last=true]:last:before:rounded-none",
//       ],
//     }),
//     [],
//   );

//   return (
//     <div className="overflow-x-auto overflow-y-hidden">
//       <Button onClick={downloadExcel} disabled={isDownloading} color="primary">
//         {isDownloading ? (
//           <>
//             <RotatingLines
//               visible={true}
//               height="20"
//               width="20"
//               strokeColor="white"
//               strokeWidth="5"
//               animationDuration="0.75"
//               ariaLabel="rotating-lines-loading"
//             />
//             Downloading...
//           </>
//         ) : (
//           "Download Excel sheet"
//         )}
//       </Button>
//       <Table
//         className="w-full mt-5"
//         isCompact
//         removeWrapper
//         aria-label="Example table with custom cells, pagination and sorting"
//         bottomContent={bottomContent}
//         classNames={classNames}
//         selectedKeys={selectedKeys}
//         sortDescriptor={sortDescriptor}
//         topContent={topContent}
//         topContentPlacement="outside"
//         onSelectionChange={setSelectedKeys}
//         onSortChange={setSortDescriptor}
//       >
//         <TableHeader columns={headerColumns}>
//           {(column) => (
//             <TableColumn
//               key={column.uid}
//               align={column.uid === "actions" ? "center" : "start"}
//               allowsSorting={column.sortable}
//               className="text-teal-700 text-[13px]"
//             >
//               {column.name}
//             </TableColumn>
//           )}
//         </TableHeader>
//         <TableBody
//           emptyContent={"No data available in table"}
//           items={sortedItems}
//         >
//           {(item) => (
//             <TableRow
//               key={item._id}
//               className={`${
//                 item.serial % 2 === 0 ? "bg-[#F2F4F8]" : "bg-white"
//               } border-b-[1px] border-b-gray-200`}
//             >
//               {(columnKey) => (
//                 <TableCell>{renderCell(item, columnKey)}</TableCell>
//               )}
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
