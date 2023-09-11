const account = require("../models/account");
const validate = require("../middlewares/bankvalidation");

const verify = {
  verifyCpf: (req, res, next) => {
    try {
      const { cpf } = req.body;

      if (cpf === undefined) {
        next();
      } else {
        validate.validateCpf(req, res, next);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyDateOfBirth: (req, res, next) => {
    try {
      const { data_nascimento } = req.body;

      if (data_nascimento === undefined) {
        next();
      } else {
        validate.validateBirthDate(req, res, next);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyEmail: (req, res, next) => {
    try {
      const { email } = req.body;

      if (email === undefined) {
        next();
      } else {
        validate.validateEmail(req, res, next);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyAccountNumber: (req, res, next) => {
    try {
      const contas = account.findAll();
      const { numero_conta } = req.body;
      const contaExiste = contas.find((conta) => conta.numero === numero_conta);

      if (!contaExiste) {
        return res.status(400).json({ mensagem: "Login ou Senha inválido." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyDestinationAccount: (req, res, next) => {
    try {
      const contas = account.findAll();
      const { numero_conta_destino } = req.body;

      const contaExiste = contas.find(
        (conta) => conta.numero === numero_conta_destino
      );

      if (!contaExiste) {
        return res.status(400).json({
          mensagem: "A Conta que deseja fazer a transferência não existe.",
        });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyOriginAccountNumber: (req, res, next) => {
    try {
      const contas = account.findAll();
      const { numero_conta_origem } = req.body;

      const contaExiste = contas.find(
        (conta) => conta.numero === numero_conta_origem
      );

      if (!contaExiste) {
        return res.status(400).json({ mensagem: "Login ou Senha inválido." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyAccountNumberQuery: (req, res, next) => {
    try {
      const { numero_conta } = req.query;
      if (!numero_conta) {
        return res.status(400).json({
          mensagem:
            "É obrigatório receber o número da conta e a senha via parâmetro do tipo query.",
        });
      }

      const contaExiste = account
        .findAll()
        .find((conta) => conta.numero === numero_conta);

      if (!contaExiste) {
        return res.status(400).json({ mensagem: "Login ou senha inválido." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyPasswordQuery: (req, res, next) => {
    try {
      const { numero_conta, senha } = req.query;

      if (!senha) {
        return res.status(400).json({
          mensagem:
            "É obrigatório receber o número da conta e a senha via parâmetro do tipo query.",
        });
      }

      const conta = account
        .findAll()
        .find((conta) => conta.numero === numero_conta);

      const senhaValidada = conta.usuario.senha === senha;

      if (!senhaValidada) {
        return res.status(400).json({ mensagem: "Login ou senha inválido." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  verifyValue: (req, res, next) => {
    try {
      const { valor } = req.body;

      if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "Valor inválido." });
      }

      if (!/^\d+$/.test(valor)) {
        return res
          .status(404)
          .json({ mensagem: "O campo valor tem que ser do tipo numérico." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },
};

module.exports = verify;
