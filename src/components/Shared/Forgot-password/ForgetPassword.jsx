"use client";
import React from "react";
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
import { FaLock, FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ForgetPassword() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // Serialize the data to JSON string
          cache: "no-store",
        }
      );
    
      if (!response.ok) {
        toast.error("This account does not exist!!")
      }
    else{
      toast.success("Reset Link send to your email address")
    }
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <>
      <Button
        className="font-semibold p-0 bg-transparent text-slate-400"
        onPress={onOpen}
        startContent={<FaLock />}
      >
        Forgot password
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              {/* modal header */}
              <ModalHeader className="flex flex-col gap-1">
                Forgot password
              </ModalHeader>
              {/* add banner form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* modal body */}
                <ModalBody>
                  <Input
                    autoFocus
                    type="email"
                    label="Type Your Email"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}
                </ModalBody>
                {/* modal footer */}
                <ModalFooter className="justify-center items-center">
                  {/* close button */}
                  <Button
                    className="bg-red-500 text-white"
                    variant="flat"
                    onPress={onClose}
                  >
                    Close
                  </Button>
                  {/* submit button */}
                  <Button type="submit" className="bg-green-400 text-white">
                    Send
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


