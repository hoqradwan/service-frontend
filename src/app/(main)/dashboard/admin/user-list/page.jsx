import UserListMain from "@/components/dashboard/admin-dashboard/user-list/UserListMain";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";

export const metadata = {
  title: "DigitalToolsBD | User List",
  description: "DigitalToolsBD User List Page",
};

const page = async () => {
  return (
    <div>
      <TopHeader2 />
      <div className="bg-[#EEF5F9]">
        <UserListMain />
      </div>
    </div>
  );
};

export default page;
