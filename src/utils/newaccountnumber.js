const newAccountNumber = (contas) => {
  let accountNumber;
  let verifyDigit;

  do {
    accountNumber = Math.round(Math.random() * 1000)
      .toString()
      .padStart(4, "0");
    verifyDigit = getVerifyDigit(accountNumber);
  } while (contas.includes(accountNumber + "-" + verifyDigit));

  return accountNumber + "-" + verifyDigit;
};

const getVerifyDigit = (accountNumber) => {
  let verifyDigit = 0;
  let factor = 2;

  for (let i = accountNumber.length - 1; i >= 0; i--) {
    verifyDigit += Number(accountNumber[factor]) * Number(factor);
    factor = factor === 2 ? 1 : 2;
  }

  verifyDigit = verifyDigit % 10;
  verifyDigit = 10 - verifyDigit;
  verifyDigit = verifyDigit === 10 ? 0 : verifyDigit;

  return verifyDigit;
};

module.exports = newAccountNumber;
