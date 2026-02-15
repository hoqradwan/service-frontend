"use client";
import { useDisclosure } from "@nextui-org/react";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import DownloadConfirmationModal from "./DownloadConfirmationModal";
import { RotatingLines } from "react-loader-spinner";
import Swal from "sweetalert2";

const EnvatoLinkGenerate = ({ dailyDownloadLimit, dailyDownload }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [downloadInfo, setDownloadInfo] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const token = Cookies.get("session");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    setButtonLoading(true);
    // const remainingDownload = dailyDownloadLimit - dailyDownload;

    // if (remainingDownload <= 0) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Daily download limit reached",
    //     text: "Please try again tomorrow.",
    //   });
    //   setButtonLoading(false);
    //   return;
    // }

    try {
      const generateLinkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/envato-elements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await generateLinkResponse.json();

      if (!generateLinkResponse.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message || "Failed! Wrong URL",
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

  // const onSubmit = async (data) => {
  //   setButtonLoading(true);
  //   const remainingDownload = dailyDownloadLimit - dailyDownload;
  //   if (remainingDownload > 0) {
  //     try {
  //       const generateLinkResponse = await fetch(
  //         `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/envato-elements`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify(data),
  //         }
  //       );
  //       const result = await generateLinkResponse.json();

  //       if (!generateLinkResponse?.ok) {
  //         setButtonLoading(false);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: `failed! Wrong URL`,
  //         });
  //       }

  //       // destructure below data from result
  //       const { downloadUrl, downloadId } = result?.data;
  //       // save the object in downloadInfo state
  //       setDownloadInfo({
  //         downloadUrl,
  //         downloadId,
  //         status: "accepted",
  //       });
  //       reset();
  //       setButtonLoading(false);
  //       onOpen();
  //     } catch (error) {
  //       setButtonLoading(false);
  //       console.log("catch error", error);
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Daily download limit reached.",
  //       text: "Please try again tomorrow.",
  //     });
  //     setButtonLoading(false);
  //   }
  // };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap sm:flex-nowrap items-start gap-4 justify-between mt-5"
    >
      <div className="w-full">
        <input
          id="helper-text"
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your Envato Element Content url"
          type="text"
          {...register("url", { required: true })}
        />
        {errors.url && (
          <span className="text-red-500 text-xs">this field is required</span>
        )}
      </div>
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
      {/* modal for confirming download */}
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

export default EnvatoLinkGenerate;
