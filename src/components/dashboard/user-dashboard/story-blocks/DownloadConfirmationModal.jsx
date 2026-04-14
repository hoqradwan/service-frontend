"use client";
import React, { useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { ImFolderDownload } from "react-icons/im";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { RefetchContext } from "@/Provider/RefetchContext";

export default function DownloadConfirmationModal({
  isOpen,
  onOpenChange,
  onClose,
  downloadInfo,
}) {
  // destructuring downloadInfo
  const { downloadUrl, downloadId, status } = downloadInfo;
  // new data object for /download/add api
  const data = {
    status,
  };
  const { setRefetch } = useContext(RefetchContext);
  // get token from cookies
  const token = Cookies.get("session");

  const downloadFile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${downloadId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (result?.success) {
        // Option A: Use window.open with specific features to "clean" the request
        window.open(downloadUrl, "_blank", "noopener,noreferrer");

        // OR Option B: If window.open is blocked by popup blockers
        // window.location.assign(downloadUrl);

        setRefetch((prev) => prev + 1);
        onClose();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cancelDownload = () => {
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              {/* modal header */}
              <ModalHeader className="flex flex-col gap-1 text-sm font-normal">
                Download Link Generated
              </ModalHeader>
              {/* modal body */}
              <ModalBody>
                <p className="font-semibold text-lg flex flex-col items-center justify-center gap-3 w-full">
                  <ImFolderDownload className="text-[100px] text-primary animate-bounce" />
                  Do you want to download ?
                </p>
              </ModalBody>
              {/* modal footer */}
              <ModalFooter className="flex items-cener justify-center gap-3">
                {/* cancel button */}
                <Button
                  type="button"
                  className="bg-red-500 text-white"
                  variant="flat"
                  onPress={cancelDownload}
                >
                  Cancel
                </Button>
                {/* confirm button */}
                <Button
                  type="button"
                  onClick={downloadFile}
                  className="bg-blue-500 text-white"
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
