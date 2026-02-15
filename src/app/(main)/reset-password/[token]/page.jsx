import ResetPassword from "@/components/Shared/ResetPassword/ResetPassword";
import React from "react";

const page = ({ params }) => {
  return (
    <div>
      <ResetPassword token={params.token}></ResetPassword>
    </div>
  );
};

export default page;
