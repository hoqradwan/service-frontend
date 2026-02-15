import { useEffect, useState } from "react";
import TodayDownload from "./TodayDownload";
import TodayDownloadLimit from "./TodayDownloadLimit";
import TotalDownload from "./TotalDownload";
import TotalDownloadLimit from "./TotalDownloadLimit";
import activity from "./activity.module.css";
import { GET_DATA_BY_EMAIL } from "@/utility/get_data_by_email";
import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
import Cookies from "js-cookie";
import TodayStoryBlock from "./TodayStoryBlockDownload";
import TodayMotionArray from "./TodayMotionArray";
import TotalMotionArrayDownload from "./TotalMotionArrayDownload";
import TotalStoryBlocksDownload from "./TotalStoryBlocksDownload";
import TodayMotionDownloadLimit from "./TodayMotionDownloadLimit";
import TotalMotionDownloadLimit from "./TotalMotionDownloadLimit";
import TodayStoryBlocksDownloadLimit from "./TodayStoryBlocksDownloadLimit";
import TotalStoryBlocksDownloadLimit from "./TotalStoryBlocksDownloadLimit";
import styles from "./ProfileStatisticsCard.module.css"; // New CSS module

const ProfileStatisticsCard = ({ userId }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [limitData, setLimitData] = useState([]);
  const [selectedService, setSelectedService] = useState("Envato"); // Default to Envato

  const token = Cookies.get("session");

  // URLs
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-envato-download/${userId}`;
  const url2 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-envato-download/${userId}`;
  const url3 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-story-blocks-download/${userId}`;
  const url4 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-story-blocks-download/${userId}`;
  const url5 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-motion-array-download/${userId}`;
  const url6 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-motion-array-download/${userId}`;
  const limitUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/user-licenses/${userId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data1, data2, data3, data4, data5, data6] = await Promise.all([
          GET_DATA_BY_EMAIL(url, token),
          GET_DATA_BY_EMAIL(url2, token),
          GET_DATA_BY_EMAIL(url3, token),
          GET_DATA_BY_EMAIL(url4, token),
          GET_DATA_BY_EMAIL(url5, token),
          GET_DATA_BY_EMAIL(url6, token),
        ]);

        setData({ data1, data2, data3, data4, data5, data6 });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [token, url, url2, url3, url4, url5, url6]);

  useEffect(() => {
    const limitFn = async () => {
      const response = await GET_DATA_URL_TOKEN(limitUrl, token);
      const data = response?.data;
      setLimitData(data?.data);
    };

    limitFn();
  }, [limitUrl, token]);

  const getLimitDataByService = (serviceName) => {
    const serviceData = limitData.find(
      (item) => item.serviceName === serviceName
    );
    return serviceData ? serviceData : { dailyLimit: 0, totalLimit: 0 };
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  // Extract limit data for Story-blocks, Motion-array, and Envato
  const storyBlocksLimit = getLimitDataByService("Story-blocks");
  const motionArrayLimit = getLimitDataByService("Motion-array");
  const envatoLimit = getLimitDataByService("Envato");

  const renderServiceData = (service) => {
    switch (service) {
      case "Envato":
        return (
          <>
            <TodayDownload
              dailyDownload={data?.data1?.data?.dailyDownloadCount}
            />
            <TotalDownload
              totalDownload={data?.data2?.data?.totalDownloadCount}
            />
            <TodayDownloadLimit limitUserData={envatoLimit} />
            <TotalDownloadLimit limitUserData={envatoLimit} />
          </>
        );
      case "StoryBlocks":
        return (
          <>
            <TodayStoryBlock
              dailyDownload={data?.data3?.data?.dailyDownloadCount}
            />
            <TotalStoryBlocksDownload
              totalDownload={data?.data4?.data?.totalDownloadCount}
            />
            <TodayStoryBlocksDownloadLimit limitUserData={storyBlocksLimit} />
            <TotalStoryBlocksDownloadLimit limitUserData={storyBlocksLimit} />
          </>
        );
      case "MotionArray":
        return (
          <>
            <TodayMotionArray
              dailyDownload={data?.data5?.data?.dailyDownloadCount}
            />
            <TotalMotionArrayDownload
              totalDownload={data?.data6?.data?.totalDownloadCount}
            />
            <TodayMotionDownloadLimit limitUserData={motionArrayLimit} />
            <TotalMotionDownloadLimit limitUserData={motionArrayLimit} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={` px-4`}>
      {/* Dropdown for selecting service */}
      <div className={styles.dropdownContainer}>
        <label htmlFor="service-select" className={styles.label}>
          Select Service:
        </label>
        <select
          value={selectedService}
          onChange={handleServiceChange}
          id="service-select"
          className={styles.dropdown}
        >
          <option value="Envato">Envato</option>
          <option value="StoryBlocks">StoryBlocks</option>
          <option value="MotionArray">MotionArray</option>
        </select>
      </div>

      {/* Render the data based on selected service */}
      <div className={activity.responsive}>
        {renderServiceData(selectedService)}
      </div>
    </div>
  );
};

export default ProfileStatisticsCard;

// import { useEffect, useState } from "react";
// import TodayDownload from "./TodayDownload";
// import TodayDownloadLimit from "./TodayDownloadLimit";
// import TotalDownload from "./TotalDownload";
// import TotalDownloadLimit from "./TotalDownloadLimit";
// import activity from "./activity.module.css";
// import { GET_DATA_BY_EMAIL } from "@/utility/get_data_by_email";
// import { GET_DATA_URL_TOKEN } from "@/utility/get_data";
// import Cookies from "js-cookie";
// import TodayStoryBlock from "./TodayStoryBlockDownload";

// import TodayMotionArray from "./TodayMotionArray";
// import TotalMotionArrayDownload from "./TotalMotionArrayDownload";
// import TotalStoryBlocksDownload from "./TotalStoryBlocksDownload";
// import TodayMotionDownloadLimit from "./TodayMotionDownloadLimit";
// import TotalMotionDownloadLimit from "./TotalMotionDownloadLimit";
// import TodayStoryBlocksDownloadLimit from "./TodayStoryBlocksDownloadLimit";
// import TotalStoryBlocksDownloadLimit from "./TotalStoryBlocksDownloadLimit";

// const ProfileStatisticsCard = ({ userId }) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [limitData, setLimitData] = useState([]);

//   const token = Cookies.get("session");

//   // URLs
//   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-envato-download/${userId}`;
//   const url2 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-envato-download/${userId}`;
//   const url3 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-story-blocks-download/${userId}`;
//   const url4 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-story-blocks-download/${userId}`;
//   const url5 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-motion-array-download/${userId}`;
//   const url6 = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-motion-array-download/${userId}`;
//   const limitUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/user-licenses/${userId}`;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [data1, data2, data3, data4, data5, data6] = await Promise.all([
//           GET_DATA_BY_EMAIL(url, token),
//           GET_DATA_BY_EMAIL(url2, token),
//           GET_DATA_BY_EMAIL(url3, token),
//           GET_DATA_BY_EMAIL(url4, token),
//           GET_DATA_BY_EMAIL(url5, token),
//           GET_DATA_BY_EMAIL(url6, token),
//         ]);

//         // The data is already parsed, so you can directly log and use it

//         setData({ data1, data2, data3, data4, data5, data6 });
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       }
//     };

//     fetchData();
//   }, [token, url, url2, url3, url4, url5, url6]);

//   useEffect(() => {
//     const limitFn = async () => {
//       const response = await GET_DATA_URL_TOKEN(limitUrl, token);
//       const data = response?.data;
//       setLimitData(data?.data);
//     };

//     limitFn();
//   }, [limitUrl, token]);

//   const getLimitDataByService = (serviceName) => {
//     const serviceData = limitData.find(
//       (item) => item.serviceName === serviceName
//     );
//     if (serviceData) {
//       return serviceData;
//     } else {
//       return { dailyLimit: 0, totalLimit: 0 };
//     }
//   };

//   if (error) return <div>Error: {error}</div>;
//   if (!data) return <div>Loading...</div>;

//   // Extract limit data for Story-blocks, Motion-array, and Envato
//   const storyBlocksLimit = getLimitDataByService("Story-blocks");
//   const motionArrayLimit = getLimitDataByService("Motion-array");
//   const envatoLimit = getLimitDataByService("Envato");

//   return (
//     <div className={`${activity.responsive} px-4`}>
//       <TodayDownload dailyDownload={data?.data1?.data?.dailyDownloadCount} />
//       <TotalDownload totalDownload={data?.data2?.data?.totalDownloadCount} />

//       <TodayStoryBlock dailyDownload={data?.data3?.data?.dailyDownloadCount} />
//       <TotalStoryBlocksDownload
//         totalDownload={data?.data4?.data?.totalDownloadCount}
//       />

//       <TodayMotionArray dailyDownload={data?.data5?.data?.dailyDownloadCount} />
//       <TotalMotionArrayDownload
//         totalDownload={data?.data6?.data?.totalDownloadCount}
//       />

//       {/* Conditional Rendering based on serviceName */}
//       <TodayDownloadLimit limitUserData={envatoLimit} />
//       <TotalDownloadLimit limitUserData={envatoLimit} />

//       <TodayMotionDownloadLimit limitUserData={motionArrayLimit} />
//       <TotalMotionDownloadLimit limitUserData={motionArrayLimit} />

//       <TodayStoryBlocksDownloadLimit limitUserData={storyBlocksLimit} />
//       <TotalStoryBlocksDownloadLimit limitUserData={storyBlocksLimit} />
//     </div>
//   );
// };

// export default ProfileStatisticsCard;
