"use client";

import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { useForm } from "react-hook-form";

import Cookies from "js-cookie";

import { toast } from "react-hot-toast";

import { FaSpinner } from "react-icons/fa";

const services = ["Envato", "Story-blocks", "Freepik", "Motion-array"];

export default function AddNoticeModal({ setRefresh }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const token = Cookies.get("session");

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      active: "true",
    },
  });

  const [loading, setLoading] = useState(false);

  const selectedService = watch("service");
  const activeValue = watch("active");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notice/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            service: data.service,
            message: data.message,
            active: data.active === "true",
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Notice created successfully!");

        reset();

        onClose();

        setRefresh((prev) => !prev);
      } else {
        toast.error(result.message || "Failed to create notice");
      }
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="font-semibold" onClick={onOpen} color="primary">
        Add Notice
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>Create Notice</ModalHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Select
                label="Service"
                labelPlacement="outside"
                placeholder="Select service"
                selectedKeys={selectedService ? [selectedService] : []}
                onSelectionChange={(keys) => {
                  setValue("service", Array.from(keys)[0]);
                }}
              >
                {services.map((service) => (
                  <SelectItem key={service}>{service}</SelectItem>
                ))}
              </Select>

              <Input
                type="text"
                label="Notice Message"
                labelPlacement="outside"
                placeholder="Write notice"
                variant="bordered"
                {...register("message", {
                  required: true,
                })}
              />

              <Select
                label="Active"
                labelPlacement="outside"
                selectedKeys={[activeValue]}
                onSelectionChange={(keys) => {
                  setValue("active", Array.from(keys)[0]);
                }}
              >
                <SelectItem key="true">True</SelectItem>

                <SelectItem key="false">False</SelectItem>
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
                className="bg-blue-500 text-white"
                disabled={loading}
              >
                {loading && <FaSpinner className="animate-spin mr-2" />}

                {loading ? "Adding..." : "Add"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
