"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { columns } from "./download";
import React from "react";
import Link from "next/link";
import { downloadLicense } from "./licenseDownload";
import Cookies from "js-cookie";

export default function DownloadTable({ users }) {
  const token = Cookies.get("session");

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const renderCell = React.useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "service":
          return (
            <div>
              <p className="text-bold text-sm capitalize">{user.service}</p>
            </div>
          );
        case "assets":
          return (
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-2 flex-wrap">
                <Link
                  href={user.content}
                  target="_blank"
                  className="text-[13px] text-nowrap rounded-sm p-1 text-white capitalize bg-[#1976D2]"
                >
                  Content address
                </Link>
                {
                  user?.contentLicense
                  && <button
                  onClick={() => downloadLicense(user._id, token)}
                  className="text-[13px] text-nowrap rounded-sm p-1 text-white capitalize bg-[#4DBC60] "
                >
                  License download
                </button>
                }
                
              </div>
            </div>
          );
        case "status":
          return (
            <div className="flex flex-col">
              <p
                className={`${
                  user.status === "pending" ? "bg-secondary" : "bg-primary"
                } text-bold text-sm capitalize text-white  text-center rounded-sm p-1`}
              >
                {user.status === "pending" && "pending"}
                {user.status === "accepted" && "success"}
              </p>
            </div>
          );
        case "time":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-400">
                {user.time}
              </p>
            </div>
          );

        default:
          return cellValue;
      }
    },
    [token]
  );

  return (
    <Table
      aria-label="Download History Table"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            className="text-teal-700 text-[14px]"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={items} emptyContent={"There's no download history"}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
