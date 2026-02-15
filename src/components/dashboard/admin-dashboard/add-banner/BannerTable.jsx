import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import {
  DeleteIcon,
  EditOutline,
} from "@/components/Shared/table-component/IconBox";
import { toast } from "react-hot-toast";
import UpdateBanner from "./UpdateBanner";
import Cookies from "js-cookie";
import { formatDate } from "@/utility/formatHours";

export default function BannerTable({ refresh, setRefresh }) {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = Cookies.get("session");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        const result = await response.json();
        setBanners(result.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, [refresh, token]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to delete banner. Status: ${response.status}`
          );
        }

        const responseData = await response.json();

        if (responseData.success) {
          const updatedBanners = banners.filter((item) => item._id !== id);
          setBanners(updatedBanners);
          toast.success("Deleted successfully!");
        } else {
          toast.error("Failed to delete the item.");
        }
      } catch (error) {
        console.error("Error deleting banner:", error);
        toast.error(`Failed to delete the banner. Error: ${error.message}`);
      }
    },
    [banners, token]
  );

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const renderCell = useCallback(
    (item, columnKey) => {
      switch (columnKey) {
        case "image":
          return (
            <div>
              <Image
                src={`${item.fileName}`}
                height={150}
                width={150}
                priority={true}
                alt="Banner"
                className="w-[25%]"
              />
            </div>
          );
        case "url":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-400">
                {item.goToURL}
              </p>
            </div>
          );
        case "date":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {formatDate(item.createdAt)}
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
          return item[columnKey];
      }
    },
    [handleDelete]
  );

  return (
    <>
      <Table aria-label="Banner table">
        <TableHeader>
          <TableColumn key="image">Image</TableColumn>
          <TableColumn key="url">URL</TableColumn>
          <TableColumn key="date">Date</TableColumn>
          <TableColumn key="actions" align="center">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody items={banners}>
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
      <UpdateBanner
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItem}
        refreshData={() => setRefresh((prev) => !prev)}
      />
    </>
  );
}
