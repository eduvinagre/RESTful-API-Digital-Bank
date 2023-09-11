const { format } = require("date-fns");

const registrationDateFormat = (data) => {
  const hourFormat = data.toLocaleTimeString();
  const dateFormat = format(data, "yyyy-MM-dd");

  return `${dateFormat} ${hourFormat}`;
};

module.exports = registrationDateFormat;
