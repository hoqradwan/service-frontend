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
import { FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AddLicenseModal() {
  const router = useRouter();
  const token = Cookies.get("session");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // changes the value of dailyLimit, dayLimit, totalLimit from string to number
    // changes the value of dailyLimit, dayLimit, totalLimit from string to number
    if (Number(data.dailyLimit) > Number(data.totalLimit)) {
      return toast.error(
        "Total limit must be greater than or equal to daily limit"
      );
    }
    data.dailyLimit = Number(data.dailyLimit);
    data.dayLimit = Number(data.dayLimit);
    data.totalLimit = Number(data.totalLimit);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const result = await response.json();
        toast.success(result?.message);
        reset();
        // closes the modal
        onClose();
        router.refresh();
      } else {
        toast.error(response.statusText);
        console.error("Error:", response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Button
        className="font-semibold"
        onPress={onOpen}
        color="primary"
        startContent={<FaPlus />}
      >
        Create License
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              {/* modal header */}
              <ModalHeader className="flex flex-col gap-1">
                Create License
              </ModalHeader>
              {/* add banner form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* modal body */}
                <ModalBody>
                  {/* select side */}
                  <div className="flex flex-col">
                    <label htmlFor="select-site" className="text-sm pb-2">
                      Select Site
                    </label>
                    <select
                      name="select-site"
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      {...register("serviceName")}
                    >
                      <option defaultChecked value="Envato">
                        Envato
                      </option>
                      <option defaultChecked value="Story-blocks">
                        Story-blocks
                      </option>
                      <option defaultChecked value="Motion-array">
                        Motion-array
                      </option>
                      <option defaultChecked value="Freepik">
                        Freepik
                      </option>
                    </select>
                  </div>
                  {errors.serviceName && (
                    <span className="text-red-500 text-xs">
                      this field is required
                    </span>
                  )}
                  {/* After how many days will expire */}
                  <Input
                    autoFocus
                    type="number"
                    label="After how many days will expire"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("dayLimit", { required: true })}
                  />
                  {errors.dayLimit && (
                    <span className="text-red-500 text-xs">
                      this field is required
                    </span>
                  )}
                  {/* Dialy Download Limit */}
                  <Input
                    autoFocus
                    type="number"
                    label="Dialy Download Limit"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("dailyLimit", { required: true })}
                  />
                  {errors.dailyLimit && (
                    <span className="text-red-500 text-xs">
                      this field is required
                    </span>
                  )}
                  {/*  Total Download Limit  */}
                  <Input
                    autoFocus
                    type="number"
                    label="Total Download Limit "
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("totalLimit", { required: true })}
                  />
                  {errors.totalLimit && (
                    <span className="text-red-500 text-xs">
                      this field is required
                    </span>
                  )}
                  {/*  Device Limit  */}
                  <Input
                    autoFocus
                    type="number"
                    defaultValue={1}
                    label="Device Limit"
                    labelPlacement="outside"
                    variant="bordered"
                    {...register("deviceLimit", { required: true })}
                  />
                  {errors.deviceLimit && (
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
}
