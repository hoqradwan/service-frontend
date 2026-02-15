const getUniqueData = (data) => {
  const uniqueData = data?.reduce((acc, current) => {
    const x = acc.find((item) => item.licenseKey === current.licenseKey);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return uniqueData;
};

export default getUniqueData;
