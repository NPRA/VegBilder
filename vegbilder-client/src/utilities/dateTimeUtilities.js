function toLocaleDateAndTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const locale = "nb-NO";
  const dateFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const timeFormatOptions = { hour: "2-digit", minute: "2-digit" };
  return {
    date: dateTime.toLocaleDateString(locale, dateFormatOptions),
    time: dateTime.toLocaleTimeString(locale, timeFormatOptions),
  };
}

export { toLocaleDateAndTime };
