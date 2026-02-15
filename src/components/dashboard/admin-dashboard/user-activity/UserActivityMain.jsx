import AdminDnHistoryMain from "../adminDownloadHistory/AdminDnHistoryMain";
import ProfileCard from "./ProfileCard";
import ProfileStatisticsCard from "./ProfileStatisticsCard";
import UserActivityLicenseMain from "./UserActivityLicenseMain";

const UserActivityMain = ({ id }) => {
  return (
    <div className="max-w-[95vw]">
      {/* Profile card */}
      <ProfileCard userId={id} />

      {/* statistics cart */}
      <ProfileStatisticsCard userId={id} />

      {/* user activity license list */}
      <UserActivityLicenseMain userId={id} />

      {/* admin download history */}
      <AdminDnHistoryMain userId={id} />
    </div>
  );
};

export default UserActivityMain;
