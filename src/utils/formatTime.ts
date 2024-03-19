export const formatTime = (timeString: string) => {
  const [hour, minute] = timeString.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};
