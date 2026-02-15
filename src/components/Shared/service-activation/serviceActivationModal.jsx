"use client";
import React, { useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { IoMdKey } from "react-icons/io";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { RefetchContext } from "@/Provider/RefetchContext";

export default function ServiceActivationModal({ open }) {
  const { setRefetch } = useContext(RefetchContext);
  const token = Cookies.get("session");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/activate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
   
      if (result?.success) {
        setRefetch((prev) => prev + 1);
        toast.success(result?.message);
        reset();
        // closes the modal
        onClose();
      } else {
        toast.error(result?.message);
        console.error("Error:", response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Tooltip
        placement="right"
        content="License Activation"
        className={`${open ? "opacity-0" : ""}`}
      >
        <Button
          className={`hover:bg-[#E1F7E6] min-h-[40px] p-2 flex items-center gap-2 rounded-md text-black text-sm ${
            open ? "" : "w-[38px] min-w-[38px]"
          }`}
          onPress={onOpen}
          color=""
          // startContent={<IoMdKey />}
        >
          <div className={`text-secondary `}>
            {React.createElement(IoMdKey, { size: "20" })}{" "}
          </div>
          <span
            className={`${
              !open
                ? "opacity-0 translate-x-28 cursor-pointer overflow-hidden"
                : ""
            } duration-500`}
          >
            License Activation
          </span>
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              {/* modal header */}
              <ModalHeader className="flex flex-col gap-1">
                Service Activation
              </ModalHeader>
              {/* add banner form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* modal body */}
                <ModalBody>
                  {/*  Enter your license key, you've received via email */}
                  <Input
                    autoFocus
                    type="text"
                    label=" Enter your license key, you've received via email"
                    labelPlacement="outside"
                    placeholder="your license key"
                    variant="bordered"
                    {...register("licenseKey", { required: true })}
                  />
                  {errors.licenseKey && (
                    <span className="text-red-500 text-xs">
                      this field is required
                    </span>
                  )}
                </ModalBody>
                {/* modal footer */}
                <ModalFooter>
                  {/* close button */}
                  <Button
                    className="bg-red-500 text-white"
                    variant="flat"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  {/* submit button */}
                  <Button type="submit" className="bg-blue-500 text-white">
                    Activate
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
