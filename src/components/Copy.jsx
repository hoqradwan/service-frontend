import React from "react";

const Copy = ({ content }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
 
    }
  };

  return <button onClick={handleCopy}>Copy to Clipboardff</button>;
};

export default Copy;
