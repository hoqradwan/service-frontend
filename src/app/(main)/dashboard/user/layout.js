"use client";
import { RoleContext } from "@/Provider/RoleContext";
import { redirect } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const UserDashboardLayout = ({ children }) => {
  const { role, setRole } = useContext(RoleContext);
  const [showUserComponent, setShowUserComponent] = useState(false);
  useEffect(() => {
    if (role !== "user") {
      redirect("/login");
    }
    setShowUserComponent(true);
  }, [role]);
  return <div>{showUserComponent && <div>{children}</div>}</div>;
};

export default UserDashboardLayout;
