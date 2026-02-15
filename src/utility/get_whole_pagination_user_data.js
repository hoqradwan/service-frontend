const GET_ALL_PAGINATION_USER_DATA = async (token) => {
  const limit = 100;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let allData = [];
  let page = 1;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      const response = await fetch(
        `${baseUrl}/api/user/user-list?limit=${limit}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Example of token usage
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      const retrievedData = result?.data?.users;

      // Append the retrieved data to allData
      allData = [...allData, ...retrievedData];

      // If fewer items than the limit are returned, assume no more data
      if (retrievedData.length < limit) {
        hasMoreData = false;
      } else {
        page += 1; // Move to the next page
      }
    }

    return allData; // Return the full data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Handle error for calling function
  }
};

export default GET_ALL_PAGINATION_USER_DATA;
