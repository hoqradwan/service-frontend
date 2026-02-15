const getUniqueUserData = (data) => {
  const uniqueData = data?.reduce((acc, current) => {
    const x = acc.find((item) => item.email === current.email);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  return uniqueData;
};

export default getUniqueUserData;
