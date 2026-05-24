"use client";

export const downloadLicense = async (id, token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/envato-elements-license/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    /* ------------------ Get PDF Blob ------------------ */

    const blob = await response.blob();

    /* ------------------ Create Blob URL ------------------ */

    const url = window.URL.createObjectURL(blob);

    /* ------------------ Dynamic Filename ------------------ */

    const disposition = response.headers.get("content-disposition");

    let filename = "license.pdf";

    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }

    /* ------------------ Create Download Link ------------------ */

    const link = document.createElement("a");

    link.href = url;

    // ✅ Dynamic filename
    link.setAttribute("download", filename);

    document.body.appendChild(link);

    /* ------------------ Start Download ------------------ */

    link.click();

    /* ------------------ Cleanup ------------------ */

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the license file:", error);
  }
};

// export const downloadLicense = async (id, token) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/envato-elements-license/${id}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const blob = await response.blob();

//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "license.txt");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     Swal({});
//   } catch (error) {
//     console.error("Error downloading the license file:", error);
//   }
// };
