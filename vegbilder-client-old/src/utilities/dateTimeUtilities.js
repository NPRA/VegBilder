/* Takes an ISO 8601 datetime-string (UTC time zone) and splits it into two strings: date and time.
 * Example: "2020-09-22T04:42:58Z" => { date: "2020-09-22", time: "04:42:58" }
 */
const splitDateTimeString = (dateTimeString) => {
  const split = dateTimeString.split(/[TZ]/);
  return { date: split[0], time: split[1] };
};

export { splitDateTimeString };
