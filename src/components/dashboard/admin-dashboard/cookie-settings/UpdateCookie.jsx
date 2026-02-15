"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const UpdateCookie = ({ isOpen, onClose, selectedItem, refreshData }) => {
  const { control, register, handleSubmit, setValue } = useForm();
  const token = Cookies.get("session");

  useEffect(() => {
    if (selectedItem) {
      setValue("serviceName", selectedItem.serviceName || "");
      setValue("project", selectedItem.project || "");
      setValue("source", selectedItem.source || "");
      setValue("cookie", selectedItem.cookie || "");
      setValue("csrfToken", selectedItem.csrfToken || "");
    }
  }, [selectedItem, setValue]);

  const onSubmit = async (formData) => {
    try {
      const updatedData = {
        serviceName: formData.serviceName || selectedItem.serviceName,
        project: formData.project || selectedItem.project,
        source: formData.source || selectedItem.source,
        cookie: formData.cookie || selectedItem.cookie,
        csrfToken: formData.csrfToken || selectedItem.csrfToken,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/${selectedItem._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Updated successfully!");
        refreshData();
        onClose();
      } else {
        toast.error("Failed to update the item.");
      }
    } catch (error) {
      console.error("There was an error updating the item!", error);
      toast.error("Failed to update the item.");
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Cookie
              </ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  {/* select site */}
                  <div className="flex flex-col">
                    <label htmlFor="select-site" className="text-sm pb-2">
                      Select Site
                    </label>
                    <select
                      name="serviceName" // Added name attribute
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      {...register("serviceName")}
                    >
                      <option value="envato">Envato</option>
                    </select>
                  </div>

                  {/* Project */}
                  <Input
                    type="text"
                    label="Project"
                    labelPlacement="outside"
                    placeholder="Project"
                    variant="bordered"
                    {...register("project")}
                  />

                  {/* cookie source */}
                  <div className="flex flex-col">
                    <label htmlFor="cookie-source" className="text-sm pb-2">
                      Cookie Source
                    </label>
                    <select
                      name="source" // Added name attribute
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      {...register("source")}
                    >
                      <option value="envato-element">Envato Element</option>
                    </select>
                  </div>

                  {/* Cookie */}
                  <Input
                    type="text"
                    label="Cookie"
                    labelPlacement="outside"
                    placeholder="Cookie"
                    variant="bordered"
                    {...register("cookie")}
                  />

                  {/* Csrf Token */}
                  <Input
                    type="text"
                    label="Csrf Token"
                    labelPlacement="outside"
                    placeholder="Csrf Token"
                    variant="bordered"
                    {...register("csrfToken")}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-red-500 text-white"
                    variant="flat"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  <Button type="submit" className="bg-blue-500 text-white">
                    Add
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateCookie;
