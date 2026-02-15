"use client";
import { fetchLicenseData } from "@/utility/envato_element_data_fetch";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const CheckLicense = () => {
  const [ expiryDate,  setExpiryDate] = useState("");

  useEffect(() => {
    const getExpiryDate = async () => {
      try {
        // Fetch the expiry date and update the state
        await fetchLicenseData( setExpiryDate);
      } catch (error) {
        console.log(error);
      }
    };
    getExpiryDate();
  }, []); // Only run once when the component mounts..

  useEffect(() => {
    if ( expiryDate) {

  
      // Parse the date in 'DD-MM-YYYY' format
      const [day, month, year] =  expiryDate.split('-');
      const targetDate = new Date(`${year}-${month}-${day}`);
  
      if (isNaN(targetDate.getTime())) {
        console.error("Invalid date format:",  expiryDate);
        return;
      }
  
      const currentDate = new Date();
  
      const timeDifference = targetDate.getTime() - currentDate.getTime();

  
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
  
      if (daysDifference <= 2 && daysDifference >= 0) {
    
        Swal.fire({
          title: "Notification!",
          text: "⚠ প্রিয় গ্রাহক, খুব শিগ্রই আপনার প্রিমিয়াম সাবস্ক্রিপশনের মেয়াদ পূর্ণ হতে চলছে। পরবর্তী মাসের সাবস্ক্রিপশন রিনিউ করতে আগ্রহী হলে পেমেন্ট করার জন্য অনুরোধ রইল। আপনার কোনো প্রশ্ন থাকলে মেসেজ করুন নিচের দেয়া হোয়াটসঅ্যাপ নাম্বারে: 📞 01882-658934",
          confirmButtonText: "Close",
        });
      }
    }
  }, [ expiryDate]); // Only run when  expiryDate changes
  
  

  return <div></div>;
};

export default CheckLicense;
