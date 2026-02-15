import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import DynamicUserTable from "./DynamicUserTable";
import { cookies } from "next/headers";

const DynamicUserListMain = async ({ userId }) => {
  let userLicense = [];
  let page = 1;
  let limit = 10; // Set a large enough limit for each request
  let hasMoreData = true;
  const cookieStore = cookies();
  const myCookie = cookieStore.get("session");
  let token = myCookie.value;

  // Loop to fetch data page by page.
  while (hasMoreData) {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/user-licenses/${userId}?limit=${limit}&page=${page}`;
    try {
      // Fetch data from the API with authentication token.
      const response = await GET_DATA_URL_TOKEN(url, token);
      const data = response.data.data;

      // Append the fetched data and update pagination.
      if (data.length > 0) {
        userLicense = userLicense.concat(data);
        page += 1; // Move to the next page.
      } else {
        hasMoreData = false; // No more data to fetch.
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      hasMoreData = false; // Stop fetching in case of error.
    }
  }

  return (
    <div>
      {/* user list */}
      <div className="bg-white shadow-xl p-4 my-8 rounded-md m-5">
        <div className="mb-8">
          <h4 className="text-[18px] text-gray-500">User License List</h4>
        </div>
        {/* order list table  */}
        <DynamicUserTable userData={userLicense} />
      </div>
    </div>
  );
};

export default DynamicUserListMain;
