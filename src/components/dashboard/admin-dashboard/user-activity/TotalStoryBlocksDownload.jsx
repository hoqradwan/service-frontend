const TotalStoryBlocksDownload = ({ totalDownload }) => {
    return (
      <div className={`bg-[#8aaa18] text-white rounded-md`}>
        <div className={`shadow-lg  p-4 rounded-md`}>
          <h2 className="text-[24px]">{totalDownload}</h2>
          <h3 className="text-[14px]">Total story-blocks download</h3>
        </div>
      </div>
    );
  };
  
  export default TotalStoryBlocksDownload;
  