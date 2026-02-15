const TodayDownload = ({ dailyDownload }) => {
  return (
    <div className={`bg-[#26DAD2] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">{dailyDownload}</h2>
        <h3 className="text-[14px]">Today envato download</h3>
      </div>
    </div>
  );
};

export default TodayDownload;
