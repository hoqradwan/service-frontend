export const formatTime = (isoString) => {
  const date = new Date(isoString);

  // Get day, month, and year
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();

  // Combine them into the desired format
  return `${day}-${month}-${year}`;
};
