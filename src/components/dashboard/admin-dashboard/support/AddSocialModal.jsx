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
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { uploadImageToCloudinary } from "@/components/Cloudinary/Cloudinary";
import { FaSpinner } from "react-icons/fa";
export default function AddSocialModal({ setRefresh }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("session");
  const onSubmit = async (data) => {
    if (!imageFile) {
      toast.error("Image file is required.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(imageFile, "support");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/support/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.socialMediaName,
            image: imageUrl,
            goToURL: data.goToURL,
          }),
        }
      );

      if (response.ok) {
        toast.success("Support created successfully!");
        onClose();
        reset();
        setRefresh((prev) => !prev);
      } else {
        const errorResponse = await response.json();
        console.error("Failed to create support:", errorResponse);
        toast.error("Failed to create support.");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="font-semibold" onClick={onOpen} color="primary">
        Add Social
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Create Social
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Input
                autoFocus
                type="text"
                label="Name"
                labelPlacement="outside"
                placeholder="Social Media Name"
                variant="bordered"
                {...register("socialMediaName", { required: true })}
              />
              {errors.socialMediaName && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
              <Input
                type="file"
                label="Image"
                labelPlacement="outside"
                variant="bordered"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {errors.image && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
              <Input
                type="text"
                label="Go To URL"
                labelPlacement="outside"
                placeholder="Paste Your URL"
                variant="bordered"
                {...register("goToURL", { required: true })}
              />
              {errors.goToURL && (
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              )}
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
                  {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                  {loading ? "Adding..." : "Add"}
                </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
