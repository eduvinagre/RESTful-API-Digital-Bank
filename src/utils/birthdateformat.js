const birthDateFormat = (data) => {
  const [dia, mes, ano] = data.split("/").map(Number);

  const dataObj = new Date(ano, mes - 1, dia);

  const formatDay = dataObj.getDate().toString().padStart(2, "0");
  const formatMonth = dataObj.getMonth().toString().padStart(2, "0");
  const formatYear = dataObj.getFullYear();

  return `${formatYear}-${formatMonth}-${formatDay}`;
};

module.exports = birthDateFormat;
