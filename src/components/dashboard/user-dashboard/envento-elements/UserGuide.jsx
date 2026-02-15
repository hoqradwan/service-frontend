"use client";
import React from "react";

const UserGuide = () => {
  return (
    <div className="bg-lime-200 p-4 rounded-md">
      <p className="text-red-600 block">ATTENTION</p>
      <p className="text-secondary block">
        You can watch the promo video on how to activate your account or follow
        the below guide.
      </p>
      <p className="text-lg font-semibold mt-3">
        How to Activate Your License:
      </p>
      <ol className="list-decimal pl-5">
        <li>{"Copy the license key send to you via email."}</li>
        <li>{`Click on the "License Activation" button in the left sidebar.`}</li>
        <li>{`Now paste the license key and click activate button.`}</li>
        <li>{`If your license key is valid a toast will show saying "License activated successfully".`}</li>
        <li>{`Thank you.`}</li>
      </ol>
    </div>
  );
};

export default UserGuide;
