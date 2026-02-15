const TotalMotionArrayDownload = ({ totalDownload }) => {
    return (
      <div className={`bg-[#d3b11b] text-white rounded-md`}>
        <div className={`shadow-lg  p-4 rounded-md`}>
          <h2 className="text-[24px]">{totalDownload}</h2>
          <h3 className="text-[14px]">Total motion-array download</h3>
        </div>
      </div>
    );
  };
  
  export default TotalMotionArrayDownload;
  