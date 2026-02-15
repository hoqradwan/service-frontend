import React from "react";
import { ThreeCircles } from "react-loader-spinner";

const Loader = () => {

  return (
    <div className="flex justify-center items-center h-svh">
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#4DBC60"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
