"use client";
import React, { useCallback, useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { columns, statusOptions, statusColorMap } from "./cookie_data";
import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";
import {
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";
import AddCookieModal from "./AddCookieModal";
import { formatDate } from "@/utility/formatHours";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import UpdateCookie from "./UpdateCookie";
import swal from "sweetalert";

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

export default function CookieSettingTable({ users }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedService, setSelectedService] = useState("All");

  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState(users);
  const router = useRouter();
  const token = Cookies.get("session");

  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(data.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  // Extract unique services
  const services = React.useMemo(() => {
    const uniqueServices = new Set(data.map((item) => item.serviceName));
    return ["All", ...Array.from(uniqueServices)];
  }, [data]);

  // delete cookie function
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
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete cookie");
        }

        const updatedCookie = data.filter((item) => item._id !== id);
        setData(updatedCookie);
        toast.success("Cookie deleted successfully!");
      } catch (error) {
        toast.error("Something went wrong!");
        console.error(error);
      }
    },
    [data, token]
  );

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleTooltip = (key) => {
    navigator.clipboard.writeText(key);
    toast.success("copied");
  };

  useEffect(() => {
    setData(users);
  }, [users]);

  useEffect(() => {
    router.refresh();
  }, [refresh, router]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // filter user by brand name and service
  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.serviceName.toLowerCase().includes(filterValue.toLowerCase())
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
    if (selectedService !== "All") {
      filteredUsers = filteredUsers.filter(
        (user) => user.serviceName === selectedService
      );
    }

    return filteredUsers;
  }, [data, filterValue, statusFilter, hasSearchFilter, selectedService]);

  // divide number of page number
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  // sorted item
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // total number of cell
  const renderCell = React.useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
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
                {user?.account}
              </p>
            </div>
          );
        case "cookie":
          return (
            <div className="flex flex-col">
              <Tooltip content={"click to copy"}>
                <p
                  className="capitalize text-default-500 text-md"
                  onClick={() => handleTooltip(user?.cookie)}
                  aria-label="click to copy"
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
    [deleteCookie]
  );

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
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
            placeholder="Select a service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {services.map((service) => (
              <SelectItem key={service} value={service}>
                {service}
              </SelectItem>
            ))}
          </Select>
          <AddCookieModal setRefresh={setRefresh} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} accounts
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
    filteredItems.length,
    selectedService,
    services,
    setRefresh,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end mt-[30px]">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
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

  const classNames = React.useMemo(
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
    <>
      <div className="overflow-x-auto overflow-y-hidden">
        <Table
          className="w-full"
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

// "use client";
// import React, { useCallback, useEffect, useState } from "react";
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
// } from "@nextui-org/react";
// import { columns, statusOptions, statusColorMap } from "./cookie_data";
// import { SearchIcon } from "@/components/Shared/table-component/SearchIcon";
// import {
//   DeleteIcon,
//   EditOutline,
// } from "@/components/Shared/table-component/IconBox";
// import AddCookieModal from "./AddCookieModal";
// import { formatDate } from "@/utility/formatHours";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";
// import UpdateCookie from "./UpdateCookie";
// import swal from "sweetalert";

// const INITIAL_VISIBLE_COLUMNS = [
//   "serial",
//   "serviceName",
//   "account",
//   "email",
//   "cookie",
//   "joining",
//   "source",
//   "status",
//   "action",
// ];

// export default function CookieSettingTable({ users }) {
//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
//   const [visibleColumns, setVisibleColumns] = React.useState(
//     new Set(INITIAL_VISIBLE_COLUMNS)
//   );
//   const [statusFilter, setStatusFilter] = React.useState("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [sortDescriptor, setSortDescriptor] = React.useState({
//     column: "age",
//     direction: "ascending",
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const [refresh, setRefresh] = useState(false);
//   const [data, setData] = useState(users);
//   const router = useRouter();
//   const token = Cookies.get("session");

//   const [page, setPage] = React.useState(1);
//   const pages = Math.ceil(data.length / rowsPerPage);
//   const hasSearchFilter = Boolean(filterValue);

//   // delete cookie function
//   const deleteCookie = useCallback(
//     async (id) => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/${id}`,
//           {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`, // Assuming token is required
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to delete cookie");
//         }

//         const updatedCookie = data.filter((item) => item._id !== id);
//         setData(updatedCookie);
//         toast.success("Cookie deleted successfully!");
//       } catch (error) {
//         toast.error("Something went wrong!");
//         console.error(error);
//       }
//     },
//     [data, token] // Add necessary dependencies here
//   );

//   const handleEdit = (item) => {
//     setSelectedItem(item);
//     setIsModalOpen(true);
//   };

//   const handleTooltip = (key) => {
//     // swal(key, "...and here's the text!");
//     navigator.clipboard.writeText(key);
//     toast.success("copied");
//   };

//   useEffect(() => {
//     setData(users);
//   }, [users]);

//   useEffect(() => {
//     router.refresh();
//   }, [refresh, router]);

//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return columns;

//     return columns.filter((column) =>
//       Array.from(visibleColumns).includes(column.uid)
//     );
//   }, [visibleColumns]);

//   // filter user by brand name
//   const filteredItems = React.useMemo(() => {
//     let filteredUsers = [...data];

//     if (hasSearchFilter) {
//       filteredUsers = filteredUsers.filter((user) =>
//         user.serviceName.toLowerCase().includes(filterValue.toLowerCase())
//       );
//     }
//     if (
//       statusFilter !== "all" &&
//       Array.from(statusFilter).length !== statusOptions.length
//     ) {
//       filteredUsers = filteredUsers.filter((user) =>
//         Array.from(statusFilter).includes(user.status)
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
//         case "serviceName":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md my-5 block">
//                 {user?.serviceName}
//               </p>
//             </div>
//           );
//         case "account":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md my-5 block">
//                 {user?.account}
//               </p>
//             </div>
//           );

//         case "email":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md">
//                 {user?.account}
//               </p>
//             </div>
//           );

//         case "cookie":
//           return (
//             <div className="flex flex-col">
//               <Tooltip content={"click to copy"}>
//                 <p
//                   className="capitalize text-default-500 text-md"
//                   onClick={() => handleTooltip(user?.cookie)}
//                   aria-label="click to copy"
//                 >
//                   {user?.cookie?.length >= 20
//                     ? `${user.cookie.slice(0, 15)} ...`
//                     : user?.cookie}
//                 </p>
//               </Tooltip>
//             </div>
//           );

//         case "joining":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 text-md flex">
//                 {formatDate(user?.createdAt)}
//               </p>
//             </div>
//           );

//         case "source":
//           return (
//             <div className="flex flex-col">
//               <p className="capitalize text-default-500 font-bold text-md">
//                 {user?.source}
//               </p>
//             </div>
//           );

//         case "status":
//           return (
//             <Chip
//               className="capitalize border-none gap-1 text-default-600"
//               color={statusColorMap[user.status]}
//               size="sm"
//               variant="dot"
//             >
//               {cellValue}
//             </Chip>
//           );

//         case "action":
//           return (
//             <div className="relative flex items-center gap-2">
//               <Tooltip content="Edit user">
//                 <span
//                   className="text-lg text-default-400 cursor-pointer active:opacity-50"
//                   onClick={() => handleEdit(user)}
//                 >
//                   <EditOutline />
//                 </span>
//               </Tooltip>
//               <Tooltip color="danger" content="Delete user">
//                 <span
//                   className="text-lg text-danger cursor-pointer active:opacity-50"
//                   onClick={() => deleteCookie(user?._id)}
//                 >
//                   <DeleteIcon />
//                 </span>
//               </Tooltip>
//             </div>
//           );

//         default:
//           return cellValue;
//       }
//     },
//     [deleteCookie]
//   );

//   const onRowsPerPageChange = React.useCallback((e) => {
//     setRowsPerPage(Number(e.target.value));
//     setPage(1);
//   }, []);

//   const onSearchChange = React.useCallback((value) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-1 mb-4 items-end">
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

//           {/* set cookie */}
//           <AddCookieModal setRefresh={setRefresh} />
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
//   }, [filterValue, onSearchChange, onRowsPerPageChange, data.length]);

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
//   }, [page, pages, hasSearchFilter]);

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
//     []
//   );

//   return (
//     <>
//       <div className="overflow-x-auto overflow-y-hidden">
//         <Table
//           className="w-full"
//           isCompact
//           removeWrapper
//           aria-label="Example table with custom cells, pagination and sorting"
//           bottomContent={bottomContent}
//           classNames={classNames}
//           selectedKeys={selectedKeys}
//           sortDescriptor={sortDescriptor}
//           topContent={topContent}
//           topContentPlacement="outside"
//           onSelectionChange={setSelectedKeys}
//           onSortChange={setSortDescriptor}
//         >
//           <TableHeader columns={headerColumns}>
//             {(column) => (
//               <TableColumn
//                 key={column.uid}
//                 align={column.uid === "actions" ? "center" : "start"}
//                 allowsSorting={column.sortable}
//                 className="text-teal-700 text-[13px]"
//               >
//                 {column.name}
//               </TableColumn>
//             )}
//           </TableHeader>
//           <TableBody
//             emptyContent={"No data available in table"}
//             items={sortedItems}
//           >
//             {(item) => (
//               <TableRow
//                 key={item._id}
//                 className={`${
//                   item.serial % 2 === 0 ? "bg-[#F2F4F8]" : "bg-white"
//                 } border-b-[1px] border-b-gray-200`}
//               >
//                 {(columnKey) => (
//                   <TableCell>{renderCell(item, columnKey)}</TableCell>
//                 )}
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//         <UpdateCookie
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           selectedItem={selectedItem}
//           refreshData={() => setRefresh((prev) => !prev)}
//         />
//       </div>
//     </>
//   );
// }
