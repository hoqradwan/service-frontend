"use client";

import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa";

const statusOptions = [
  { key: "true", label: "True" },
  { key: "false", label: "False" },
];

export default function UpdateNoticeModal({
  isOpen,
  onClose,
  selectedItem,
  refreshData,
}) {
  const token = Cookies.get("session");

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      message: "",
      active: "true",
    },
  });

  const [loading, setLoading] = useState(false);

  const activeValue = watch("active");

  useEffect(() => {
    if (selectedItem) {
      setValue("message", selectedItem?.message || "");
      setValue("active", selectedItem?.active ? "true" : "false");
    }
  }, [selectedItem, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        message: data.message,
        active: data.active === "true",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notice/update/${selectedItem?._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result?.success) {
        toast.success("Notice updated successfully!");

        refreshData();
        reset();

        onClose();
      } else {
        toast.error(result?.message || "Failed to update notice");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Update Notice</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {/* SERVICE */}
            <Input
              label="Service"
              labelPlacement="outside"
              variant="bordered"
              value={selectedItem?.service || ""}
              isDisabled
            />

            {/* MESSAGE */}
            <Input
              type="text"
              label="Notice Message"
              labelPlacement="outside"
              placeholder="Enter notice message"
              variant="bordered"
              {...register("message", {
                required: "Message is required",
              })}
            />

            {/* ACTIVE */}
            <Select
              label="Active Status"
              labelPlacement="outside"
              placeholder="Select status"
              variant="bordered"
              selectedKeys={[activeValue]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setValue("active", value);
              }}
            >
              {statusOptions.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              className="bg-red-500 text-white"
              variant="flat"
              onClick={onClose}
            >
              Close
            </Button>

            <Button
              type="submit"
              className="bg-blue-500 text-white flex items-center justify-center"
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              {loading ? "Updating..." : "Update"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
