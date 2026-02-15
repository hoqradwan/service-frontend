"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Provider/AuthContext";
import { checkAuthToken } from "@/utility/verifyToken";
import Cookies from "js-cookie";

export default function AuthChecker({ children }) {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const handleTokenCheck = useCallback(async () => {
    const isValid = await checkAuthToken(router);
    if (!isValid) {
      Cookies.remove("session"); // Remove session cookie
      setIsAuthenticated(false); // Update authentication state
      router.push("/login"); // Redirect to login page
    }
  }, [router, setIsAuthenticated]);

  useEffect(() => {
    // Initial token check when the page first loads
    handleTokenCheck();

    // Set up event-based polling for user interactions
    const events = ["click", "keypress", "mousemove"];
    events.forEach((event) => window.addEventListener(event, handleTokenCheck));

    // Set up background polling every 2 minutes
    const intervalId = setInterval(() => {
      handleTokenCheck();
    }, 120000); // 2 minutes

    // Clean up event listeners and interval on component unmount
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleTokenCheck)
      );
      clearInterval(intervalId);
    };
  }, [handleTokenCheck]);

  return <>{children}</>;
}
