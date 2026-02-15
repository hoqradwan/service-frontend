"use client";
import Image from "next/image";
import React from "react";
import errorImage from "@/assets/404_Error1.gif";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center bg-white h-svh">
      <Image
        src={errorImage}
        alt="404 Error"
        width={800}
        height={800}
        property="true"
      />
    </div>
  );
};

export default ErrorPage;
