import CookieSettingsMain from "@/components/dashboard/admin-dashboard/cookie-settings/CookieSettingsMain";
import TopHeader2 from "@/components/Shared/TopHeader/TopHeader2";
export const metadata = {
  title: "DigitalToolsBD | Cookie",
  description: "DigitalToolsBD Cookie Page",
};
const page = () => {
  return (
    <div>
      <TopHeader2 />
      <div className="bg-[#EEF5F9] py-6">
        <CookieSettingsMain />
      </div>
    </div>
  );
};

export default page;
