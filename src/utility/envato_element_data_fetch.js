"use client";
import Cookies from "js-cookie";

export const fetchLicenseData = async (
  setExpiryDate,
  setTotalDownloadLimit,
  setDailyDownloadLimit
) => {
  try {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    const token = await Cookies.get("session");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/user-current-licenses/${userInfo.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    if (!result?.success) {
      toast.error(
        "License data fetching unsuccessful. Please refresh the page!"
      );
    }

    // Filter for Envato service
    const data = result?.data?.data;

    const envatoLicense = data.find((item) => item.serviceName === "Envato");

    if (envatoLicense) {
      const isoDate = envatoLicense?.expiryDate;
      const date = new Date(isoDate);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1; // Months are zero-based, so add 1
      const year = date.getUTCFullYear();

      // Format the date as "DD-MM-YYYY"
      const formattedDate = `${day.toString().padStart(2, "0")}-${month
        .toString()
        .padStart(2, "0")}-${year}`;

      if (setExpiryDate) {
        setExpiryDate(formattedDate);
      }
      if (setTotalDownloadLimit) {
        setTotalDownloadLimit(envatoLicense?.totalLimit);
      }
      if (setDailyDownloadLimit) {
        setDailyDownloadLimit(envatoLicense?.dailyLimit);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchDailyDownloadData = async (setDailyDownload) => {
  try {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    const token = await Cookies.get("session");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-daily-envato-download/${userInfo.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    if (!result?.success) {
      throw new Error("license data fetching unsuccessful");
    }
    setDailyDownload(result?.data?.dailyDownloadCount);
  } catch (error) {
    console.log(error);
  }
};

export const fetchTotalDownloadData = async (setTotalDownload) => {
  try {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    const token = await Cookies.get("session");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/user-total-envato-download/${userInfo.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    if (!result?.success) {
      throw new Error("data fetching unsuccessful");
    }
    setTotalDownload(result?.data?.totalDownloadCount);
  } catch (error) {
    console.log(error);
  }
};

export const fetchServiceStatusData = async (setServiceStatus) => {
  try {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    const token = Cookies.get("session");
    const response = await fetch(
      // `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/information/${userInfo.id}`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/service-status/envato`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    console.log(result);
    
    if (!result?.success)
      throw new Error("service status data fetching unsuccessful");
    setServiceStatus(result?.data);
  } catch (error) {
    console.log(error);
  }
};
