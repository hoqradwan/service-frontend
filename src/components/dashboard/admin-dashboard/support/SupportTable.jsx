"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
} from "@nextui-org/react";
import React, { useEffect, useState, useCallback } from "react";
import {
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";
import { toast } from "react-hot-toast";
import UpdateModal from "./UpdateModal";
import Cookies from "js-cookie";
export default function SupportTable({ refresh, setRefresh }) {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = Cookies.get("session");

  const fetchSupports = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/support/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch supports");
      }
      const result = await response.json();
      setData(result.data); // Assuming result.data is the array you want to set in state
    } catch (error) {
      console.error("Error fetching supports:", error);
      toast.error("Failed to fetch supports");
    }
  }, [token]); // The fetchSupports function will only change if the token changes

  // Call fetchSupports when the component mounts and when refresh or fetchSupports changes
  useEffect(() => {
    fetchSupports();
  }, [refresh, fetchSupports]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/support/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete the item: ${errorData.message}`);
        }

        const responseData = await response.json();

        if (responseData.success) {
          const updatedData = data.filter((item) => item._id !== id);
          setData(updatedData);
          toast.success("Deleted successfully!");
        } else {
          toast.error("Failed to delete the item.");
        }
      } catch (error) {
        console.error("There was an error deleting the item!", error);
        toast.error(`Failed to delete the item. Error: ${error.message}`);

        // Trigger a refresh
        setRefresh((prev) => !prev);
      }
    },
    [token, data, setData, setRefresh] // Add necessary dependencies here
  );

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const renderCell = useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "socialIcon":
          return (
            <User
              avatarProps={{ radius: "full", src: item.image, size: "lg" }}
            />
          );
        case "socialName":
          return (
            <div>
              <p className="text-bold text-sm capitalize text-default-400">
                {item.name}
              </p>
            </div>
          );
        case "url":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-400">
                <a
                  href={item.goToURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.goToURL}
                </a>
              </p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-1">
              <Tooltip color="danger" content="Delete item">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50 mx-auto"
                  onClick={() => handleDelete(item._id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Edit Item">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50 mx-auto"
                  onClick={() => handleEdit(item)}
                >
                  <EditOutline />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [handleDelete]
  );

  const columns = [
    { uid: "socialIcon", name: "Social Icon" },
    { uid: "socialName", name: "Social Name" },
    { uid: "url", name: "Go To URL" },
    { uid: "actions", name: "Action" },
  ];

  return (
    <>
      <Table aria-label="Support Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              style={{ width: column.uid === "url" ? "50%" : "20%" }}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
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

      <UpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItem}
        refreshData={() => setRefresh((prev) => !prev)}
      />
    </>
  );
}
