import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { FaPowerOff } from "react-icons/fa6";

const LogoutButton = () => {
  const router = useRouter();
  const token = Cookies.get("session");

  const logout = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/active-device/log-out`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();

    if (result?.success) {
      Cookies.remove("session");
      Cookies.remove("role");
      localStorage.removeItem("userInfo");
      toast.success("Logout successful");
      router.push("/login");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <button
      onClick={logout}
      type="button"
      className="flex items-center gap-2 text-base capitalize hover:cursor-pointer hover:bg-gray-200 p-2 rounded-md"
    >
      <FaPowerOff />
      Log Out
    </button>
  );
};

export default LogoutButton;
