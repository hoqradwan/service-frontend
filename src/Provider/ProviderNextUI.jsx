"use client";
import { NextUIProvider } from "@nextui-org/react";

const ProviderNextUI = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default ProviderNextUI;
