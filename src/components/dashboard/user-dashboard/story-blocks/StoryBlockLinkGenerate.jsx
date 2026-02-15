"use client";
import { useDisclosure } from "@nextui-org/react";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import DownloadConfirmationModal from "./DownloadConfirmationModal";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";
import TypesModal from "@/components/Shared/TypesModal/TypesModal";

const StoryBlockLinkGenerate = ({ dailyDownloadLimit, dailyDownload }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [downloadInfo, setDownloadInfo] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openTypesModal, setOpenTypesModal] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [contentUrl, setContentUrl] = useState(null);
  const token = Cookies.get("session");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // console.log(data, "data from story blocks")
    const url = data?.url;
    const content = url?.split("/")[3];
    if (content === "video") {
      setContentUrl(url);
      const options = [
        { label: "4K (4KMOV)", value: "4KMOV" },
        { label: "4K (4KMP4)", value: "4KMP4" },
        { label: "HD (HDMOV)", value: "HDMOV" },
        { label: "HD (HDMP4)", value: "HDMP4" },
        { label: "AE", value: "AET" },
        { label: "PPT", value: "PPT" },
        { label: "DRT", value: "DRT" },
        { label: "AMT", value: "AMT" },
      ];
      setTypeOptions(options);
      setOpenTypesModal(!openTypesModal);
    } else if (content === "audio") {
      setContentUrl(url);
      const options = [
        { label: "MP3", value: "MP3" },
        { label: "WAV", value: "WAV" },
      ];
      setTypeOptions(options);
      setOpenTypesModal(!openTypesModal);
    } else if (content === "images") {
      setContentUrl(url);
      const options = [
        { label: "JPG", value: "JPG" },
        { label: "EPS", value: "EPS" },
      ];
      setTypeOptions(options);
      setOpenTypesModal(!openTypesModal);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message || "Failed! Wrong URL",
      });
    }
  };

  const downloadRequest = async (data) => {
    setButtonLoading(true);
    try {
      const generateLinkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/story-blocks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const result = await generateLinkResponse?.json();

      if (!generateLinkResponse?.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result?.message || "Failed! Wrong URL",
        });
      } else {
        const { downloadUrl, downloadId } = result?.data || {};

        setDownloadInfo({
          downloadUrl,
          downloadId,
          status: "accepted",
        });
        reset();
        onOpen();
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please try again later.",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-5"
    >
      <div className="w-full">
        <input
          id="helper-text"
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your story-blocks Content url"
          type="text"
          {...register("url", { required: true })}
        />
        {errors.url && (
          <span className="text-red-500 text-xs">This field is required</span>
        )}
      </div>
      {/* Modal for types */}
      <TypesModal
        url={contentUrl}
        options={typeOptions}
        openTypesModal={openTypesModal}
        setOpenTypesModal={setOpenTypesModal}
        downloadRequest={downloadRequest}
      />
      <button
        type="submit"
        disabled={buttonLoading}
        className="flex gap-1 w-fit flex-nowrap text-nowrap items-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        {buttonLoading ? (
          <RotatingLines
            visible={true}
            height="16"
            width="16"
            color="#ffffff"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <FaCheck />
        )}
        Generate Download Link
      </button>
      <DownloadConfirmationModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        downloadInfo={downloadInfo}
      />
    </form>
  );
};

export default StoryBlockLinkGenerate;
