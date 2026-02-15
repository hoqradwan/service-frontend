/**
 *
 * @param {url} url
 * @param {token} token
 * @param {data} token
 * @returns
 */

export const UPDATE_DATA_URL_ID = async (url, token, data) => {
  const response = fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  return response;
};
