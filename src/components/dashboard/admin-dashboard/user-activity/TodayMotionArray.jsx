const TodayMotionArray = ({ dailyDownload }) => {
    return (
      <div className={`bg-[#cec219] text-white rounded-md`}>
        <div className={`shadow-lg  p-4 rounded-md`}>
          <h2 className="text-[24px]">{dailyDownload}</h2>
          <h3 className="text-[14px]">Today motion-array download</h3>
        </div>
      </div>
    );
  };
  
  export default TodayMotionArray;
  