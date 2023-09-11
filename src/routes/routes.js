const { Router } = require("express");
const router = Router();

const bankControllers = require("../controllers/bankcontrollers");

const validate = require("../middlewares/bankvalidation");
const verify = require("../middlewares/bankverification");

router.get(
  "/contas",
  validate.validateBankPassword,
  bankControllers.getAccounts
);

router.post(
  "/contas",
  validate.validateAccountFields,
  validate.validateCpf,
  validate.validateEmail,
  validate.validateBirthDate,
  validate.validatePhoneNumber,
  validate.validateName,
  bankControllers.createAccount
);

router.put(
  "/contas/:numeroConta/usuario",
  validate.validateUserInfosFieldsUpdate,
  verify.verifyCpf,
  verify.verifyEmail,
  verify.verifyDateOfBirth,
  validate.validatePhoneNumber,
  validate.validateName,
  bankControllers.updateUserInfos
);

router.delete("/contas/:numeroConta", bankControllers.deleteAccount);

router.post(
  "/transacoes/depositar",
  validate.validateDepositFields,
  verify.verifyAccountNumber,
  verify.verifyValue,
  bankControllers.deposit
);

router.post(
  "/transacoes/sacar",
  validate.validateWithdrawFields,
  verify.verifyAccountNumber,
  validate.validateUserPassword,
  verify.verifyValue,
  bankControllers.withdraw
);

router.post(
  "/transacoes/transferir",
  validate.validateTransferFields,
  verify.verifyValue,
  verify.verifyOriginAccountNumber,
  verify.verifyDestinationAccount,
  validate.validateUserPassword,
  bankControllers.transfer
);

router.get(
  "/contas/saldo",
  verify.verifyAccountNumberQuery,
  verify.verifyPasswordQuery,
  bankControllers.balance
);

router.get(
  "/contas/extrato",
  verify.verifyAccountNumberQuery,
  verify.verifyPasswordQuery,
  bankControllers.bankStatement
);

module.exports = router;
