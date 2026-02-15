const TotalDownload = ({ totalDownload }) => {
  return (
    <div className={`bg-[#4DBC60] text-white rounded-md`}>
      <div className={`shadow-lg  p-4 rounded-md`}>
        <h2 className="text-[24px]">{totalDownload}</h2>
        <h3 className="text-[14px]">Total envato download</h3>
      </div>
    </div>
  );
};

export default TotalDownload;
