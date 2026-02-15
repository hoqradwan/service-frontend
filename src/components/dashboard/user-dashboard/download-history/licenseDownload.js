"use client";

import Swal from "sweetalert2";

export const downloadLicense = async (id, token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/envato-elements-license/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "license.txt");
    document.body.appendChild(link);
    link.click();
    link.remove();
    Swal({});
  } catch (error) {
    console.error("Error downloading the license file:", error);
  }
};
