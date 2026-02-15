import DownloadHistoryMain from "@/components/dashboard/user-dashboard/download-history/DownloadHistoryMain";
import CheckLicense from "@/components/Shared/CheckLicense/CheckLicense";
export const metadata = {
  title: "DigitalToolsBD | Download History",
  description: "DigitalToolsBD Download History Page",
};
const DownloadHistoryPage = () => {
  return (
    <div className="pb-10">
      <CheckLicense />
      <DownloadHistoryMain />
    </div>
  );
};

export default DownloadHistoryPage;
