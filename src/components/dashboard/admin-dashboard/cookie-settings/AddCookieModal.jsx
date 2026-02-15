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
import { FaEdit, FaSpinner } from "react-icons/fa";

export default function AddCookieModal({ setRefresh }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("session");

  const onSubmit = async (data) => {
    const newData = { ...data, status: "active" };
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorDetails = await response.json(); // Parse error response to understand the issue
        console.error("Error details:", errorDetails);
        throw new Error("Failed to set cookie");
      }

      const result = await response.json();
      toast.success("Cookie set successfully!");
      setRefresh(true);
      setLoading(false);
      reset();

      onClose();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <>
      <Button className="font-semibold" onPress={onOpen} color="primary">
        Set Cookie
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Set Cookie
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
                      {...register("serviceName", { required: true })}
                    >
                      <option value="envato">Envato</option>
                      <option value="story-blocks">Story Blocks</option>
                      <option value="motion-array">Motion Array</option>
                      <option value="freepik">Freepik</option>
                    </select>
                  </div>
                  {errors.serviceName && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}

                  {/* Account */}
                  <Input
                    autoFocus
                    type="text"
                    label="Account"
                    labelPlacement="outside"
                    placeholder="Account"
                    variant="bordered"
                    {...register("account", { required: true })}
                  />
                  {errors.account && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}

                  {/* Project */}
                  <Input
                    type="text"
                    label="Project"
                    labelPlacement="outside"
                    placeholder="Project"
                    variant="bordered"
                    {...register("project", { required: true })}
                  />
                  {errors.project && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}

                  {/* cookie source */}
                  <div className="flex flex-col">
                    <label htmlFor="cookie-source" className="text-sm pb-2">
                      Cookie Source
                    </label>
                    <select
                      name="source" // Added name attribute
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      {...register("source", { required: true })}
                    >
                      <option value="envato-element">Envato Element</option>
                      <option value="story-blocks">Story Blocks</option>
                      <option value="motion-array">Motion Array</option>
                      <option value="freepik">Freepik</option>
                    </select>
                  </div>
                  {errors.cookieSource && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}

                  {/* Cookie */}
                  <Input
                    type="text"
                    label="Cookie"
                    labelPlacement="outside"
                    placeholder="Cookie"
                    variant="bordered"
                    {...register("cookie", { required: true })}
                  />
                  {errors.cookie && (
                    <span className="text-red-500 text-xs">
                      This field is required
                    </span>
                  )}

                  {/* Csrf Token */}
                  <Input
                    type="text"
                    label="Csrf Token"
                    labelPlacement="outside"
                    placeholder="Csrf Token"
                    variant="bordered"
                    {...register("csrfToken", { required: true })}
                  />
                  {errors.csrfToken && (
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
                    {loading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : null}
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
