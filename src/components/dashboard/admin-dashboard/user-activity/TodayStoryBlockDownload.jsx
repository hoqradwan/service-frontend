const TodayStoryBlock = ({ dailyDownload }) => {
    return (
      <div className={`bg-[#9bda26] text-white rounded-md`}>
        <div className={`shadow-lg  p-4 rounded-md`}>
          <h2 className="text-[24px]">{dailyDownload}</h2>
          <h3 className="text-[14px]">Today Story Block download</h3>
        </div>
      </div>
    );
  };
  
  export default TodayStoryBlock;
  