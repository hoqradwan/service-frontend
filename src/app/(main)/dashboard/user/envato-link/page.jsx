"use client";
import React, { useContext, useEffect, useState } from "react";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import { FaVideo } from "react-icons/fa6";
import Link from "next/link";

import ServiceStatus from "@/components/dashboard/user-dashboard/envento-elements/ServiceStatus";
import EnvatoLinkGenerate from "@/components/dashboard/user-dashboard/envento-elements/EnvatoLinkGenerate";
import UserGuide from "@/components/dashboard/user-dashboard/envento-elements/UserGuide";

import {
  fetchDailyDownloadData,
  fetchLicenseData,
  fetchServiceStatusData,
  fetchTotalDownloadData,
} from "@/utility/envato_element_data_fetch";

import Loader from "@/components/Shared/loader/Loader";
import { RefetchContext } from "@/Provider/RefetchContext";
import EnvetoCards from "@/components/dashboard/user-dashboard/enveto/EnventoCards";
import { deviceLimitForService } from "@/utility/get_device_limit";
import DeviceLimitExceeded from "@/components/Shared/deviceLimitExceeded/DeviceLimitExceeded";

const EnventoLink = () => {
  const { refetch } = useContext(RefetchContext);

  const [loading, setLoading] = useState(true);

  const [expiryDate, setExpiryDate] = useState("");
  const [dailyDownloadLimit, setDailyDownloadLimit] = useState(0);
  const [totalDownloadLimit, setTotalDownloadLimit] = useState(0);
  const [dailyDownload, setDailyDownload] = useState(0);
  const [totalDownload, setTotalDownload] = useState(0);

  const [serviceStatus, setServiceStatus] = useState(false);
  const [deviceLimitExceeded, setDeviceLimitExceeded] = useState(false);

  // ✅ NOTICE STATES
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeActive, setNoticeActive] = useState(false);

  // ---------------------------
  // FETCH NOTICE
  // ---------------------------
  const fetchNotice = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notice/active/envato`,
      );

      const data = await res.json();

      if (data?.data) {
        setNoticeMessage(data.data.message);
        setNoticeActive(data.data.active);
      } else {
        setNoticeMessage("");
        setNoticeActive(false);
      }
    } catch (error) {
      console.error("Notice fetch error:", error);
    }
  };

  // ---------------------------
  // FETCH ALL DATA
  // ---------------------------
  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchServiceStatusData(setServiceStatus),
        fetchLicenseData(
          setExpiryDate,
          setTotalDownloadLimit,
          setDailyDownloadLimit,
        ),
        fetchDailyDownloadData(setDailyDownload),
        fetchTotalDownloadData(setTotalDownload),
        deviceLimitForService("envato", setDeviceLimitExceeded),
        fetchNotice(), // ✅ added
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
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
      <TopHeader2 />

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white p-8">
          {/* HEADER */}
          <div className="mb-8 w-full flex items-center justify-between">
            <ServiceStatus
              serviceStatus={serviceStatus}
              setServiceStatus={setServiceStatus}
            />

            <Link
              href="https://youtu.be/1XWKWy21ius?si=XprMhGK4qK5T08qK"
              target="_blank"
              className="flex items-center text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              <FaVideo className="mr-2" />
              Watch Promo Video
            </Link>
          </div>

          {/* SERVICE ON */}
          {serviceStatus ? (
            <>
              {/* CARDS */}
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
                {cardsData.map((card) => (
                  <EnvetoCards key={card.id} card={card} />
                ))}
              </div>

              {!deviceLimitExceeded ? (
                <>
                  {/* NOTICE BLOCK (DYNAMIC) */}
                  {noticeActive && noticeMessage ? (
                    <p className="bg-lime-200 p-4 rounded-md">
                      <span className="text-red-600 block font-bold">
                        ATTENTION
                      </span>
                      {noticeMessage}
                    </p>
                  ) : (
                    <div>
                      <p className="bg-lime-200 p-4 rounded-md">
                        <span className="text-red-600 block font-bold">
                          ATTENTION
                        </span>
                        Download links are valid for 1 minute, if you click the
                        link after 1 minute, & will not work Alter downloading
                        your content from here, you can download the license
                        through the download history on the Dashboard tab.
                      </p>

                      <p className="bg-zinc-300 p-4 rounded-md mt-4">
                        Make sure the link you entered goes to the envato
                        elements content page
                      </p>
                      {/* LINK GENERATOR */}
                      <EnvatoLinkGenerate
                        dailyDownloadLimit={dailyDownloadLimit}
                        dailyDownload={dailyDownload}
                      />
                    </div>
                  )}
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

export default EnventoLink;
