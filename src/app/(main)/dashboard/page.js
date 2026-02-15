"use client";
import { RoleContext } from "@/Provider/RoleContext";
import { redirect } from "next/navigation";
import React, { useContext, useEffect } from "react";

const DashboardPage = () => {
  const { role, setRole } = useContext(RoleContext);
  useEffect(() => {
    if (role === "user") redirect("/dashboard/user/download-history");
    if (role === "admin") redirect("/dashboard/admin/order-list");
  }, [role]);

  return <div>this is the dashboard route</div>;
};

export default DashboardPage;
