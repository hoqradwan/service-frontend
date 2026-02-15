import LicenseListTableMain from "@/components/dashboard/admin-dashboard/license-list-table/LicenseListTableMain";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";

export const metadata = {
  title: "DigitalToolsBD | License List",
  description: "DigitalToolsBD License List",
};

const page = async () => {
  return (
    <div>
      <TopHeader2 />

      <div className="bg-[#EDF4F8] py-4">
        <LicenseListTableMain />
      </div>
    </div>
  );
};

export default page;
