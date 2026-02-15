"use client";
import UserActivityMain from "@/components/dashboard/admin-dashboard/user-activity/UserActivityMain";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
import { useParams } from "next/navigation";

const UserActivityPage = () => {
  const { slug } = useParams();

  return (
    <div>
      <TopHeader2 />
      <div className="bg-[#EDF4F8]">
        <UserActivityMain id={slug} />
      </div>
    </div>
  );
};

export default UserActivityPage;
