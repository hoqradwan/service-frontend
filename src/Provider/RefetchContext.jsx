"use client";
import React, { createContext, useState } from "react";

export const RefetchContext = createContext();

export const RefetchProvider = ({ children }) => {
  const [refetch, setRefetch] = useState(0);

  return (
    <RefetchContext.Provider value={{ refetch, setRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};
