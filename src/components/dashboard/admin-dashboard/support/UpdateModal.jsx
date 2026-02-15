import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button,
  } from "@nextui-org/react";
  import React, { useState, useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { toast } from "react-hot-toast";
  import { uploadImageToCloudinary } from "@/components/Cloudinary/Cloudinary";
import Cookies from "js-cookie";
  
  const UpdateModal = ({ isOpen, onClose, selectedItem, refreshData }) => {
    const { register, handleSubmit, setValue } = useForm();
    const [imageFile, setImageFile] = useState(null);
    const token = Cookies.get('session');
  
    useEffect(() => {
      if (selectedItem) {
        setValue("socialMediaName", selectedItem.name || "");
        setValue("goToURL", selectedItem.goToURL || "");
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
          name: formData.socialMediaName || selectedItem.socialMediaName,
          goToURL: formData.goToURL || selectedItem.goToURL,
          image: imageUrl,
          imageId: imageUrl.split("/").pop().split(".")[0],
        };
  
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/support/update/${selectedItem._id}`,
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
  
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Update Social Media
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
                  {...register("socialMediaName")}
                />
                <Input
                  type="file"
                  label="Image"
                  labelPlacement="outside"
                  variant="bordered"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <Input
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
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button type="submit" className="bg-blue-500 text-white">
                  Update
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default UpdateModal;
  