// import React from "react";
// import StatisticsCartMain from "../statistics-cart/StatisticsCartMain";
// import OrderTable from "./OrderTable";
// import { cookies } from "next/headers";
// import Dropdown from "@/components/Shared/dropdown/dropdown";

// const OrderListMain = async () => {
//   const cookieStore = cookies();
//   const myCookie = cookieStore.get("session");
//   let token = myCookie?.value;

//   return (
//     <div className="">
//       <div className="p-4">
//         {/* statistics cart */}
//         <Dropdown />
//         <StatisticsCartMain />

//         {/* order list */}
//         {/* <div className="bg-white shadow-xl p-4 rounded-md mt-5 md:mt-8">
//           <div className="mb-8">
//             <h4 className="text-[18px] text-gray-400">Order List</h4>
//             <span className="text-[14px] text-gray-400">All Ordersssss</span>
//           </div>

//           <OrderTable users={allData} />
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default OrderListMain;
"use client";
import Dropdown from "@/components/Shared/dropdown/dropdown";
import { useState } from "react";
import StatisticsCartMain from "../statistics-cart/StatisticsCartMain";

export default function OrderListMain() {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      <Dropdown setSelectedService={setSelectedService} />
      {selectedService && (
        <StatisticsCartMain selectedService={selectedService} />
      )}
    </div>
  );
}
