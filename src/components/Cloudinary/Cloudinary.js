export const uploadImageToCloudinary = async (file, folder) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "envato");
  formData.append("folder", folder);

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dh2azephw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("An error occurred while uploading the image.");
  }
};

