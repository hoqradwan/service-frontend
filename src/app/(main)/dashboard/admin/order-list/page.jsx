import OrderListMain from "@/components/dashboard/admin-dashboard/order-list/OrderListMain";
import Dropdown from "@/components/Shared/dropdown/dropdown";

export const metadata = {
  title: "DigitalToolsBD | Order List",
  description: "DigitalToolsBD Order List Page",
};
const page = () => {
  return (
    <div className="bg-[#ECF3F7] h-svh overflow-auto">
      {/* <Dropdown /> */}
      <OrderListMain />
    </div>
  );
};

export default page;
