"use client";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import { Button } from "@nextui-org/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const CookieTestPage = () => {
  const token = Cookies.get("session");
  const [servicesData, setServicesData] = useState([]);
  const [cookiesData, setCookiesData] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const selectedService = watch("service");

  // Fetch services and cookies data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/all-cookies`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          toast.error(response.statusText);
        }
        const result = await response.json();

        // Organize data by services
        const services = [];
        const cookiesByService = {};
        result?.data?.cookies.forEach((cookie) => {
          if (!services.includes(cookie.serviceName)) {
            services.push(cookie.serviceName);
            cookiesByService[cookie.serviceName] = [];
          }
          cookiesByService[cookie.serviceName].push(cookie);
        });

        setServicesData(services);
        setCookiesData(cookiesByService);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // tests the cookie
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/cookie-check/${data.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (!result?.success) {
        toast.error("cookie is not working");
      } else {
        toast.success(result?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while testing the cookie");
    }
  };

  return (
    <>
      <TopHeader2 />
      <div className="bg-[#EEF5F9] min-h-screen p-5 rounded-md">
        <div className="bg-white shadow-xl p-4 rounded-md">
          <h4 className="text-gray-500 text-[18px] mb-8">Cookie Test</h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Service dropdown */}
            <div className="flex flex-col">
              <label htmlFor="service" className="text-sm pb-2">
                Select Service
              </label>
              {loading ? (
                <div className="w-full h-[40px] rounded-lg animate-pulse bg-gray-300"></div>
              ) : (
                <Controller
                  name="service"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                    >
                      <option value="">Select a service</option>
                      {servicesData.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.service && (
                <span className="text-red-500 text-xs">
                  Service selection is required
                </span>
              )}
            </div>

            {/* Cookie dropdown */}
            <div className="flex flex-col">
              <label htmlFor="cookie" className="text-sm pb-2">
                Select Cookie
              </label>
              {loading ? (
                <div className="w-full h-[40px] rounded-lg animate-pulse bg-gray-300"></div>
              ) : (
                <Controller
                  name="id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
                      disabled={!selectedService}
                    >
                      <option value="">Select a cookie</option>
                      {selectedService &&
                        cookiesData[selectedService]?.map((cookie) => (
                          <option key={cookie._id} value={cookie._id}>
                            {cookie.account}
                          </option>
                        ))}
                    </select>
                  )}
                />
              )}
              {errors.id && (
                <span className="text-red-500 text-xs">
                  Cookie selection is required
                </span>
              )}
            </div>

            {/* submit button */}
            <Button
              type="submit"
              className="bg-primary text-white font-semibold w-fit"
            >
              Test Cookie
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CookieTestPage;

// "use client";
// import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
// import { Button, Input, Select, SelectItem } from "@nextui-org/react";
// import Cookies from "js-cookie";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// const CookieTestPage = () => {
//   const token = Cookies.get("session");
//   const [accountData, setAccountData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   // fetches the account list
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/all-cookies`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!response.ok) {
//           toast.error(response.statusText);
//         }
//         const result = await response.json();
//         setAccountData(result?.data?.cookies);
//         setLoading(false);
//       } catch (error) {}
//     };
//     fetchData();
//   }, [token]);

//   // tests the cookie
//   const onSubmit = async (data) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/cookie/cookie-check/${data.id}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const result = await response.json();
//       if (!result?.success) {
//         toast.error("cookie is not working");
//       } else {
//         toast.success(result?.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <>
//       <TopHeader2 />
//       <div className="bg-[#EEF5F9] min-h-screen p-5 rounded-md">
//         <div className="bg-white shadow-xl p-4 rounded-md">
//           <h4 className="text-gray-500 text-[18px] mb-8">Cookie Test</h4>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="flex flex-col gap-4"
//           >
//             {/* cookie list */}
//             <div className="flex flex-col">
//               <label htmlFor="cookie-list" className="text-sm pb-2">
//                 Account List
//               </label>
//               {loading ? (
//                 <div className="w-full h-[40px] rounded-lg animate-pulse bg-gray-300"></div>
//               ) : (
//                 <select
//                   name="cookie-list"
//                   className="px-3 py-2 border-2 border-[#E4E4E7] hover:border-opacity-80 active:border-black bg-white rounded-xl text-foreground-500"
//                   {...register("id", { required: true })}
//                 >
//                   {accountData &&
//                     accountData?.map((d) => (
//                       <option key={d?._id} value={d?._id}>
//                         {d?.account}
//                       </option>
//                     ))}
//                 </select>
//               )}
//             </div>
//             {errors.cookieList && (
//               <span className="text-red-500 text-xs">
//                 this field is required
//               </span>
//             )}
//             {/* submit button */}
//             <Button
//               type="submit"
//               className="bg-primary text-white font-semibold w-fit"
//             >
//               Test Cookie
//             </Button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CookieTestPage;
