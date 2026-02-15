import Cookies from "js-cookie";

export const deviceLimitForService = async (
  serviceName,
  setDeviceLimitExceeded
) => {
  try {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    const token = Cookies.get("session");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/user-current-licenses/${userInfo.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response?.json();
    if (!result?.success)
      throw new Error("service status data fetching unsuccessful");

    const data = result?.data?.data;
    // finding the device limit for specific service
    const service = data?.find(
      (service) =>
        service?.serviceName?.toLowerCase() === serviceName?.toLowerCase()
    );

    const response2 = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/active-device/logged-in-devices`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result2 = await response2.json();
    if (!result2?.success)
      throw new Error("service status data fetching unsuccessful");

    // console.log("dev", service);
    // console.log("logged", result2?.data?.loggedInDevices);

    // condition for device limit exceed or not for specific service
    if (service?.deviceLimit < result2?.data?.loggedInDevices) {
      setDeviceLimitExceeded(true);
    } else {
      setDeviceLimitExceeded(false);
    }
  } catch (error) {
    console.log(error);
  }
};
