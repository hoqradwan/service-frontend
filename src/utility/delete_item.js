export const DELETE_ITEM_URL = async (url, token) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Add any other headers your API might require, e.g., Authorization
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();
  return res;
};
