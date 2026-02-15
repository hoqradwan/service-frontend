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
import Cookies from "js-cookie";
import { uploadImageToCloudinary } from "@/components/Cloudinary/Cloudinary";
import { FaSpinner } from "react-icons/fa";


export default function AddBannerModal({ setRefresh }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('session');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fileInput = document.querySelector('input[type="file"]');
      if (!fileInput?.files.length) {
        toast.error("File is required.");
        setLoading(false);
        return;
      }

      const file = fileInput.files[0];
      const fileName = await uploadImageToCloudinary(file, "banner");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/banner/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName,
          goToURL: data.goToURL,
          side: data.side,
        }),
      });

      if (response.ok) {
        toast.success("Banner created successfully!");
        onClose();
        reset();
        setRefresh(prev => !prev);
      } else {
        const errorResponse = await response.json();
      
        toast.error("Failed to create banner.");
      }
    } catch (error) {
    
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button className="font-semibold" onPress={onOpen} color="primary">
        Add Banner
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Banner
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
                    {...register("bannerImage", { required: true })}
                  />
                  {errors.bannerImage && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}
                  <div className="flex flex-col">
                    <label htmlFor="select-side" className="text-sm pb-2">
                      Select Side
                    </label>
                    <select
                      name="select-side"
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      {...register("side", { required: true })}
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  {errors.side && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}
                  <Input
                    autoFocus
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
                    onPress={onClose}
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
