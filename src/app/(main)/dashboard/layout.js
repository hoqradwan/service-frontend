"use client";
import Footer from "@/components/Shared/Footer/Footer";
import Sidebar from "@/components/Shared/Sidebar/Sidebar";
import TopHeader from "@/components/Shared/TopHeader/TopHeader";
import { RoleContext } from "@/Provider/RoleContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const DashboardLayout = ({ children }) => {
  const { role, setRole } = useContext(RoleContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const getAuthInfo = async (setIsAuthenticated, setRole) => {
    const token = Cookies?.get("session");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/active-device/is-session-valid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const result = await response?.json();

      if (!result?.success) {
        Cookies.remove("session");
        Cookies.remove("role");
        localStorage.removeItem("userInfo");
        router.push("/login");
      } else {
        setIsAuthenticated(true);
        // Set role information after successful session validation
        const role = Cookies.get("role");
        if (role) {
          setRole(role);
        }
      }
    } catch (error) {
      console.error("Error validating session:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    // Check authentication and role information
    getAuthInfo(setIsAuthenticated, setRole);
  }, []);

  return (
    <>
      {isAuthenticated && (
        <div className="dash-design banner-text overflow-x-auto font-inriaSans">
          <div className="flex">
            <Sidebar />
            <div className="w-screen overflow-y-auto max-h-screen">
              <div className="sticky top-0 z-20">
                <TopHeader />
              </div>
              <div>{children}</div>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
