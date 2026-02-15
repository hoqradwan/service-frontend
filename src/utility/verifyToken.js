import Cookies from "js-cookie";

export const checkAuthToken = async (router) => {
  // Retrieve the session token from cookies
  const token = Cookies.get("session");

  // If no token, redirect to login
  if (!token) {
    router.push("/login");
    return false;
  }

  try {
    // Fetch the token verification from the API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/verify-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );

    // Check for response validity
    if (res.ok) {
      const result = await res.json();
      return result.valid; // Return the validity status
    } else {
      // Handle non-200 responses from the API
      // console.error("Token verification failed with status:", res.status);
      throw new Error("Failed to verify token");
    }
  } catch (error) {
    // console.error("Error during token verification:", error);
    Cookies.remove("session"); // Clear the session cookie on error
    router.push("/login"); // Redirect to the login page
    return false; // Return false to indicate invalid token
  }
};
