import DynamicUserListMain from "@/components/dashboard/admin-dashboard/dynamic-user-list-license/DynamicUserListMain";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";

const page = ({ params }) => {
  return (
    <div>
      <TopHeader2 />
      <div className="bg-[#EBF2F6] py-6">
        <DynamicUserListMain userId={params.slug} />
      </div>
    </div>
  );
};

export default page;
