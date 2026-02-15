"use client";
import { RoleContext } from "@/Provider/RoleContext";
import { redirect } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const AdminDashboardLayout = ({ children }) => {
  const { role, setRole } = useContext(RoleContext);
  const [showAdminComponent, setShowAdminComponent] = useState(false);
  useEffect(() => {
    if (role !== "admin") {
      redirect("/login");
    }
    setShowAdminComponent(true);
  }, [role]);
  return <>{showAdminComponent && <div>{children}</div>}</>;
};

export default AdminDashboardLayout;
