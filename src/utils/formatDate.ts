export const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/");
  const formatDate = `${year}-${month}-${day}`;
  return formatDate;
};
