"use client";
import React, { useContext, useEffect, useState } from "react";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import { FaVideo } from "react-icons/fa6";
import Link from "next/link";

import UserGuide from "@/components/dashboard/user-dashboard/motionArray/UserGuide";
import {
  fetchDailyDownloadData,
  fetchLicenseData,
  fetchServiceStatusData,
  fetchTotalDownloadData,
} from "@/utility/freepik_data_fetch.js";
import Loader from "@/components/Shared/loader/Loader";
import { RefetchContext } from "@/Provider/RefetchContext";

import FreePikCards from "@/components/dashboard/user-dashboard/freePikCards/FreePikCards";
import FreepikLinkGenerate from "../../../../../components/dashboard/user-dashboard/freePik/FreepikLinkGenerate";
import ServiceStatus from "../../../../../components/dashboard/user-dashboard/freePik/ServiceStatus";
import DeviceLimitExceeded from "@/components/Shared/deviceLimitExceeded/DeviceLimitExceeded";
import { deviceLimitForService } from "@/utility/get_device_limit";

const Freepik = () => {
  const { refetch } = useContext(RefetchContext);

  const [loading, setLoading] = useState(true);
  const [expiryDate, setExpiryDate] = useState("");
  const [dailyDownloadLimit, setDailyDownloadLimit] = useState(0);
  const [totalDownloadLimit, setTotalDownloadLimit] = useState(0);
  const [dailyDownload, setDailyDownload] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);
  const [serviceStatus, setServiceStatus] = useState(false);
  const [deviceLimitExceeded, setDeviceLimitExceeded] = useState(false);

  const fetchAllData = async () => {
    try {
      // Execute all fetches concurrently
      await Promise.all([
        fetchServiceStatusData(setServiceStatus),
        fetchLicenseData(
          setExpiryDate,
          setTotalDownloadLimit,
          setDailyDownloadLimit
        ),
        fetchDailyDownloadData(setDailyDownload),
        fetchTotalDownloadData(setTotalDownload),
        deviceLimitForService("freepik", setDeviceLimitExceeded),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      // Ensure loading is set to false after all promises resolve
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [refetch]);

  const cardsData = [
    {
      id: 1,
      data: `${Math.max(dailyDownloadLimit - dailyDownload, 0)}`,
      title: "Remaining Daily Download",
      bgColor: "bg-[#1976D2]",
    },
    {
      id: 2,
      data: `${expiryDate}`,
      title: "Service End Date",
      bgColor: "bg-[#5C4AC7]",
    },
    {
      id: 3,
      data: `${totalDownloadLimit}`,
      title: "Total Download Limit",
      bgColor: "bg-[#FFB22B]",
    },
    {
      id: 4,
      data: `${totalDownload}`,
      title: "Total Download File",
      bgColor: "bg-[#EF5350]",
    },
  ];

  return (
    <div key={serviceStatus ? refetch : null} className="min-h-screen">
      {/* top header that contains breadcrumb */}
      <TopHeader2 />
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-8">
          <div className="mb-8 w-full flex items-center justify-between">
            <ServiceStatus
              serviceStatus={serviceStatus}
              setServiceStatus={setServiceStatus}
            />
            {/* Watch the promo video */}
            <Link
              href="https://youtu.be/1XWKWy21ius?si=XprMhGK4qK5T08qK"
              target="_blank"
              className="flex items-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              <FaVideo className="mr-2" />
              Watch Promo Video
            </Link>
          </div>
          {serviceStatus ? (
            <>
              {/* Show the cards */}
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
                {cardsData.map((card) => (
                  <FreePikCards key={card.id} card={card}></FreePikCards>
                ))}
              </div>
              {!deviceLimitExceeded ? (
                <>
                  <div className="">
                    <p className="bg-lime-200 p-4 rounded-md">
                      <span className="text-red-600 block">ATTENTION </span>
                      Download links are valid for 1 minute. If you click the
                      link after 1 minute, it will not work. After downloading
                      your content from here, you can download the license
                      through the download history on the Dashboard tab.
                    </p>
                    <p className="bg-zinc-300 p-4 rounded-md mt-4">
                      Make sure the link you entered goes to the Freepik content
                      page.
                    </p>
                  </div>
                  {/* Generate download link */}
                  <FreepikLinkGenerate
                    dailyDownloadLimit={dailyDownloadLimit}
                    dailyDownload={dailyDownload}
                  />
                </>
              ) : (
                <DeviceLimitExceeded />
              )}
            </>
          ) : (
            <UserGuide />
          )}
        </div>
      )}
    </div>
  );
};

export default Freepik;

// import React from "react";

// const FreepikPage = () => {
//   return (
//     <div className="min-h-[80vh] min-w-full flex items-center justify-center text-gray-500 text-xl uppercase">
//       Contact us 😊
//     </div>
//   );
// };

// export default FreepikPage;
