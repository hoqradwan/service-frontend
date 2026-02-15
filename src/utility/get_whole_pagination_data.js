const GET_ALL_PAGINATION_DATA = async (token) => {
  const limit = 100;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let allData = [];
  let page = 1;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      const response = await fetch(
        `${baseUrl}/api/license?limit=${limit}&page=${page}`,
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
      const retrievedData = result?.data?.data;

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

export default GET_ALL_PAGINATION_DATA;

// const GET_ALL_PAGINATION_DATA = async (token) => {
//   const limit = 100;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   let allData = [];
//   let hasMoreData = true;
//   let page = 1;

//   try {
//     // Fetch the first page to get the total count of items
//     const initialResponse = await fetch(
//       `${baseUrl}/api/license?limit=${limit}&page=${page}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         cache: "no-store",
//       }
//     );

//     if (!initialResponse.ok) {
//       throw new Error(`Error: ${initialResponse.statusText}`);
//     }

//     const initialResult = await initialResponse.json();
//     const retrievedData = initialResult?.data?.data;
//     const totalItems = initialResult?.data?.totalItems; // Assuming total items are included in the response
//     allData = [...allData, ...retrievedData];

//     const totalPages = Math.ceil(totalItems / limit);
//     const requests = [];

//     // Start requests for remaining pages in parallel
//     for (let i = 2; i <= totalPages; i++) {
//       requests.push(
//         fetch(`${baseUrl}/api/license?limit=${limit}&page=${i}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           cache: "no-store",
//         }).then((response) => {
//           if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//           return response.json();
//         })
//       );
//     }

//     // Wait for all parallel requests to complete
//     const results = await Promise.all(requests);
//     results.forEach((result) => {
//       allData = [...allData, ...(result?.data?.data || [])];
//     });

//     console.log(results);

//     return allData; // Return the full data
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// };

// export default GET_ALL_PAGINATION_DATA;
