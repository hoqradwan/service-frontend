/**
 * Filters an array of objects based on a search string.
 *
 * @param {Array} data - The array of objects to filter.
 * @param {string} searchString - The search string to match.
 * @returns {Array} - An array of matching objects.
 */
export function filterData(data, searchString) {
  if (!searchString) return data; // Return the original data if search string is empty

  const lowerCaseSearchString = searchString.toLowerCase();

  return data?.filter(
    (user) =>
      user?.userEmail?.toLowerCase().includes(lowerCaseSearchString) ||
      user?.licenseKey?.toLowerCase().includes(lowerCaseSearchString) ||
      user?.serviceName?.toLowerCase().includes(lowerCaseSearchString)
  );
}
