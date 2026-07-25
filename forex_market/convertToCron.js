function convertToCron(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3].toLowerCase();

  if (period === "pm" && hour !== 12) {
    hour += 12;
  }

  if (period === "am" && hour === 12) {
    hour = 0;
  }

  return `${minute} ${hour} * * *`;
}

module.exports=convertToCron