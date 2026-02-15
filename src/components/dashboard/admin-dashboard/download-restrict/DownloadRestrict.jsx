"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const DownloadRestrict = () => {
  const [restriction, setRestriction] = useState({
    service: "Envato Elements",
    delay: 0,
    isRestricted: false,
  });
  const [isToggleInteracted, setIsToggleInteracted] = useState(false); // Track toggle interaction
  const token = Cookies.get("session");

  useEffect(() => {
    const fetchRestrictionData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/downloadRestrict`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const restrictData = await response.json();

        if (restrictData.data && restrictData.data.length > 0) {
          const serviceData = restrictData.data.find(
            (item) => item.service === restriction.service
          );

          if (serviceData) {
            setRestriction(serviceData);
          } else {
            setRestriction((prev) => ({
              ...prev,
              delay: 0,
              isRestricted: false,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching restriction data:", error);
      }
    };
    fetchRestrictionData();
  }, [restriction.service, token]);

  const handleDownloadRestriction = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/downloadRestrict/update-restriction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(restriction),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error details:", errorDetails);
        throw new Error("Failed to update download restriction");
      }
      toast.success(
        `Download restriction is ${restriction.isRestricted ? "on" : "off"}`
      );
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to update download restriction. Please try again.");
    }
  };

  const handleToggle = () => {
    setRestriction((prev) => ({
      ...prev,
      isRestricted: !prev.isRestricted,
    }));
    setIsToggleInteracted(true); // Set toggle interaction to true
  };

  const handleChange = (field, value) => {
    setRestriction((prev) => ({
      ...prev,
      [field]: field === "delay" ? parseInt(value) : value,
    }));
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-[84vh] bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            Download Restriction
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Delay (seconds)
            </label>
            <input
              type="number"
              value={restriction.delay}
              onChange={(e) => handleChange("delay", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter delay time"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Service
            </label>
            <select
              value={restriction.service}
              onChange={(e) => handleChange("service", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Envato Elements">Envato Elements</option>
              <option value="Story Blocks">Story Blocks</option>
              <option value="Motion Array">Motion Array</option>
              <option value="Freepik">Freepik</option>
            </select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Restrict Download</span>
            <div
              onClick={handleToggle}
              className={`relative inline-flex h-8 w-14 cursor-pointer rounded-full transition-colors ${
                restriction.isRestricted ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                  restriction.isRestricted ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleDownloadRestriction}
            className={`w-full py-2 px-4 rounded-md font-semibold text-white ${
              isToggleInteracted
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isToggleInteracted}
          >
            Update Restriction
          </button>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default DownloadRestrict;

// "use client";
// import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import Cookies from "js-cookie";

// const DownloadRestrict = () => {
//   const [restriction, setRestriction] = useState({
//     service: "Envato Elements",
//     delay: 0,
//     isRestricted: false,
//   });
//   const token = Cookies.get("session");
//   // Fetch restriction data based on selected service
//   useEffect(() => {
//     const fetchRestrictionData = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/downloadRestrict`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`, // Example of token usage
//             },
//           }
//         );
//         const restrictData = await response.json();

//         if (restrictData.data && restrictData.data.length > 0) {
//           // Find the restriction data for the currently selected service
//           const serviceData = restrictData.data.find(
//             (item) => item.service === restriction.service
//           );

//           if (serviceData) {
//             setRestriction(serviceData);
//           } else {
//             // Reset if no data found for the selected service
//             setRestriction((prev) => ({
//               ...prev,
//               delay: 0,
//               isRestricted: false,
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching restriction data:", error);
//       }
//     };
//     fetchRestrictionData();
//   }, [restriction.service, token]); // Re-run when `service` changes

//   const handleDownloadRestriction = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/downloadRestrict/update-restriction`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(restriction),
//         }
//       );

//       if (!response.ok) {
//         const errorDetails = await response.json();
//         console.error("Error details:", errorDetails);
//         throw new Error("Failed to update download restriction");
//       }
//       let restrictionStatus;
//       if (restriction.isRestricted) {
//         restrictionStatus = "on";
//       } else {
//         restrictionStatus = "off";
//       }
//       toast.success(`Download restriction is ${restrictionStatus}`);
//     } catch (error) {
//       console.error("Error:", error.message);
//       toast.error("Failed to update download restriction. Please try again.");
//     }
//   };

//   const handleToggle = () => {
//     setRestriction((prev) => ({
//       ...prev,
//       isRestricted: !prev.isRestricted,
//     }));
//   };

//   const handleChange = (field, value) => {
//     setRestriction((prev) => ({
//       ...prev,
//       [field]: field === "delay" ? parseInt(value) : value,
//     }));
//   };

//   return (
//     <>
//       <div className="flex justify-center items-center min-h-[84vh] bg-gray-100 p-4">
//         <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
//           <h1 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
//             Download Restriction
//           </h1>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Time Delay (seconds)
//             </label>
//             <input
//               type="number"
//               value={restriction.delay}
//               onChange={(e) => handleChange("delay", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter delay time"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Select Service
//             </label>
//             <select
//               value={restriction.service}
//               onChange={(e) => handleChange("service", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Envato Elements">Envato Elements</option>
//               <option value="Story Blocks">Story Blocks</option>
//               <option value="Motion Array">Motion Array</option>
//               <option value="Freepik">Freepik</option>
//             </select>
//           </div>

//           <div className="flex items-center justify-between mb-4">
//             <span className="text-gray-700 font-medium">Restrict Download</span>
//             <div
//               onClick={handleToggle}
//               className={`relative inline-flex h-8 w-14 cursor-pointer rounded-full transition-colors ${
//                 restriction.isRestricted ? "bg-green-500" : "bg-gray-300"
//               }`}
//             >
//               <span
//                 className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
//                   restriction.isRestricted ? "translate-x-6" : "translate-x-1"
//                 }`}
//               />
//             </div>
//           </div>

//           <button
//             onClick={handleDownloadRestriction}
//             className="w-full py-2 px-4 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600"
//           >
//             Update Restriction
//           </button>
//         </div>
//       </div>

//       <Toaster position="top-center" reverseOrder={false} />
//     </>
//   );
// };

// export default DownloadRestrict;
