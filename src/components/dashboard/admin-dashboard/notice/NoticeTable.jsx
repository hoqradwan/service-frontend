"use client";

import React, { useEffect, useState, useCallback } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from "@nextui-org/react";

import Cookies from "js-cookie";

import { toast } from "react-hot-toast";

import {
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";

import UpdateNoticeModal from "./UpdateNoticeModal";

export default function NoticeTable({ refresh, setRefresh }) {
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const token = Cookies.get("session");

  const fetchNotices = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notice/all`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notices");
      }

      const result = await response.json();

      setData(result.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch notices");
    }
  }, [token]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices, refresh]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/notice/delete/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (result.success) {
          setData((prev) => prev.filter((item) => item._id !== id));

          toast.success("Deleted successfully!");
        } else {
          toast.error("Failed to delete");
        }
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong");
      }
    },
    [token],
  );

  const handleEdit = (item) => {
    setSelectedItem(item);

    setIsModalOpen(true);
  };

  const renderCell = useCallback(
    (item, columnKey) => {
      switch (columnKey) {
        case "service":
          return (
            <p className="font-bold capitalize text-default-500">
              {item.service}
            </p>
          );

        case "message":
          return <p className="text-default-500">{item.message}</p>;

        case "active":
          return (
            <Chip
              color={item.active ? "success" : "danger"}
              variant="dot"
              size="sm"
            >
              {item.active ? "Active" : "Inactive"}
            </Chip>
          );

        case "actions":
          return (
            <div className="flex items-center gap-2">
              <Tooltip content="Edit">
                <span
                  className="cursor-pointer"
                  onClick={() => handleEdit(item)}
                >
                  <EditOutline />
                </span>
              </Tooltip>

              <Tooltip content="Delete" color="danger">
                <span
                  className="cursor-pointer text-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );

        default:
          return item[columnKey];
      }
    },
    [handleDelete],
  );

  const columns = [
    {
      uid: "service",
      name: "Service",
    },

    {
      uid: "message",
      name: "Notice Message",
    },

    {
      uid: "active",
      name: "Status",
    },

    {
      uid: "actions",
      name: "Actions",
    },
  ];

  return (
    <>
      <Table aria-label="Notice Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={data} emptyContent={"No notice found"}>
          {(item, index) => (
            <TableRow
              key={item._id}
              className={index % 2 === 0 ? "bg-[#F2F4F8]" : "bg-white"}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <UpdateNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItem}
        refreshData={() => setRefresh((prev) => !prev)}
      />
    </>
  );
}
