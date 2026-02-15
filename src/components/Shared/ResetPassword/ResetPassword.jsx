"use client";
import React from "react";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPassword({ token }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: data.password }),
        }
      );

      if (response.ok) {
        toast.success("Password reset successful!");
        router.push("/"); // Redirect to homepage or login page
      } else {
        alert("Password reset failed.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <Modal isOpen={true} placement="top-center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Reset your password
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Input
              autoFocus
              type="password"
              label="New Password"
              labelPlacement="outside"
              variant="bordered"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
          </ModalBody>
          <ModalFooter className="justify-center items-center">
            <Button type="submit" className="bg-green-400 text-white">
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}