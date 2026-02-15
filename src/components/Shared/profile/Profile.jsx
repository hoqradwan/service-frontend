"use client";
import React, { useContext, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import AboutMe from "./AboutMe";
import { FaEdit, FaSpinner } from "react-icons/fa";
import { uploadImageToCloudinary } from "@/components/Cloudinary/Cloudinary";
import { RefetchContext } from "@/Provider/RefetchContext";

const Profile = () => {
  const { setRefetch } = useContext(RefetchContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onOpen = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleInfoUpdated = () => {
    setIsModalOpen(false);
    setUpdateTrigger((prev) => !prev);
  };

  const onSubmit = async (data) => {
    if (isNaN(data.phone)) {
      toast.error("Phone number should be a number");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("session");
      const decoded = jwt.decode(token);
      const userId = decoded.id;

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile, "user_profiles");
        data.image = imageUrl;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();

        toast.success("Profile updated successfully", {
          position: "bottom-right",
          duration: 2000,
        });
        setRefetch((prev) => prev + 1);
        handleInfoUpdated();
      } else {
        console.error("Error updating data:", response.status);
        toast.error("Error updating data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:mt-[84px] md:mt-[50px] mt-8 mb-[134px] flex items-center justify-center w-full">
      <div className="p-4 md:p-6 bg-[#FFFFFF] shadow-sm rounded-lg w-full max-w-[800px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-[#1B1D48] font-semibold text-base">My Profile</h1>
          <Button
            className="flex items-center gap-x-1 text-[#1B1D48] cursor-pointer"
            onPress={onOpen}
            color=""
          >
            <FaEdit className="h-4 w-4 lg:h-5 lg:w-5" />
            <p className="font-medium lg:font-semibold lg:text-sm text-sm">
              Edit
            </p>
          </Button>
        </div>
        <AboutMe updateTrigger={updateTrigger} />
      </div>
      <Modal isOpen={isModalOpen} onOpenChange={onClose} placement="center">
        <ModalContent className="flex items-center justify-cente">
          <ModalBody>
            <ModalHeader className="flex flex-col gap-1">
              Update Profile
            </ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col w-full">
                  <Input
                    autoFocus
                    type="name"
                    label="Name"
                    placeholder="Enter new name"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("name")}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Input
                    autoFocus
                    type="password"
                    label="Password"
                    placeholder="Enter new password"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("password")}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Input
                    autoFocus
                    type="text"
                    label="Phone"
                    placeholder="Type your phone number"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("phone")}
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Input
                    type="file"
                    labelPlacement="outside"
                    label="Profile Image"
                    variant="bordered"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    disabled={loading}
                    className="mt-[24px]"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-red-500 text-white"
                  variant="flat"
                  onPress={onClose}
                  disabled={loading}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 text-white flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                  {loading ? "Updating..." : "Update"}
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
