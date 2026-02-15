/**
 * Filters an array of objects based on a search string.
 *
 * @param {Array} data - The array of objects to filter.
 * @param {string} searchString - The search string to match.
 * @returns {Array} - An array of matching objects.
 */
export function filterUserData(data, searchString) {
  if (!searchString) return data; // Return the original data if search string is empty

  const lowerCaseSearchString = searchString.toLowerCase();

  return data?.filter(
    (user) =>
      user?.email?.toLowerCase().includes(lowerCaseSearchString) ||
      user?.phone?.toLowerCase().includes(lowerCaseSearchString)
  );
}
