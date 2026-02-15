export const GET_DATA_BY_EMAIL = async (url, token) => {
  if (!token) {
    throw new Error("Token is required");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // You can also log the error here or throw it again for further handling
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
};
