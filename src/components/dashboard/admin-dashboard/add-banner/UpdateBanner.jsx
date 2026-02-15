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
import { uploadImageToCloudinary } from "@/components/Cloudinary/Cloudinary";

const UpdateBanner = ({ isOpen, onClose, selectedItem, refreshData }) => {
  const { control, register, handleSubmit, setValue } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const token = Cookies.get("session");

  useEffect(() => {
    if (selectedItem) {
      setValue("goToURL", selectedItem.goToURL || "");
      setValue("side", selectedItem.side || "");
    }
  }, [selectedItem, setValue]);

  const onSubmit = async (formData) => {
    try {
      let imageUrl = selectedItem.image;

      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(
          imageFile,
          "social-media-images"
        );
      }
      const updatedData = {
        fileName: imageUrl,
        goToURL: formData.goToURL || selectedItem.goToURL,
        side: formData.side || selectedItem.side,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/update/${selectedItem._id}`,
        {
          method: "PATCH",
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
                Update Banner
              </ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <Input
                    autoFocus
                    type="file"
                    label="Image"
                    labelPlacement="outside"
                    placeholder="Upload an image"
                    variant="bordered"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />

                  <div className="flex flex-col">
                    <label htmlFor="select-side" className="text-sm pb-2">
                      Select Side
                    </label>
                    <select
                      name="select-side"
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      {...register("side")}
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <Input
                    autoFocus
                    type="text"
                    label="Go To URL"
                    labelPlacement="outside"
                    placeholder="Paste Your URL"
                    variant="bordered"
                    {...register("goToURL")}
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
                    Update
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

export default UpdateBanner;
