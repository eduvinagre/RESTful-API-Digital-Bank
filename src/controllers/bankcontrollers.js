const bank = require("../models/bank");
const account = require("../models/account");
const newAccountNumber = require("../utils/newaccountnumber");
const birthDateFormat = require("../utils/birthdateformat");
const registrationDateFormat = require("../utils/registrationdateformat");

const bankControllers = {
  getAccounts: (req, res) => {
    try {
      const accounts = account.findAll();

      if (!accounts) {
        return res
          .status(500)
          .json({ mensagem: "Ocorreu um erro interno no servidor." });
      }

      return res.status(200).json(accounts);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  createAccount: (req, res) => {
    try {
      const accounts = account.findAll();

      const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

      const newAccount = {
        numero: newAccountNumber(accounts),
        saldo: 0,
        usuario: {
          nome,
          cpf,
          data_nascimento: birthDateFormat(data_nascimento),
          telefone,
          email,
          senha: senha.toString(),
        },
      };

      account.create(newAccount);
      return res.status(201).json(newAccount);
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  updateUserInfos: (req, res) => {
    try {
      const { numeroConta } = req.params;

      const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

      const existingAccount = account.findByPk(numeroConta);

      if (!existingAccount) {
        return res
          .status(404)
          .json({ mensagem: "A conta informada não existe." });
      }

      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          mensagem:
            "É obrigatório o envio de todas as propriedades para atualizar as informações.",
        });
      }

      const updatedAccount = {
        numero: numeroConta,
        saldo: existingAccount.saldo,
        usuario: {
          nome: nome ?? existingAccount.usuario.nome,
          cpf: cpf ?? existingAccount.usuario.cpf,
          data_nascimento: data_nascimento
            ? birthDateFormat(data_nascimento)
            : existingAccount.usuario.data_nascimento,
          telefone: telefone ?? existingAccount.usuario.telefone,
          email: email ?? existingAccount.usuario.email,
          senha: senha ?? existingAccount.usuario.senha,
        },
      };

      const answer = account.update(updatedAccount);

      if (!answer) {
        return res
          .status(400)
          .json({ mensagem: "Não foi possível atualizar as informações." });
      }

      return res
        .status(201)
        .json({ mensagem: "Conta atualizada com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  deleteAccount: (req, res) => {
    try {
      const { numeroConta } = req.params;

      const existingAccount = account
        .findAll()
        .find((conta) => conta.numero === numeroConta);

      if (!existingAccount) {
        return res.status(400).json({ mensagem: "Conta não encontrada." });
      }

      if (existingAccount.saldo > 0) {
        return res.status(400).json({
          mensagem:
            "Não é permitido excluír uma conta com saldo diferente de 0(zero).",
        });
      }

      const answer = account.destroy(existingAccount.numero);

      if (!answer) {
        return res.status(422).json({ mensagem: "Exclusão mal sucedida." });
      }

      return res.json({ mensagem: "Conta excluída com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  deposit: (req, res) => {
    try {
      const { numero_conta, valor } = req.body;

      const accountDeposit = account.findByPk(numero_conta);
      accountDeposit.saldo += Number(valor);

      const registry = {
        data: registrationDateFormat(new Date()),
        numero_conta,
        valor: Number(valor),
      };

      const cubosBank = bank.findAllInfos();
      cubosBank.depositos.push(registry);

      return res.json({ mensagem: "Depósito realizado com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  withdraw: (req, res) => {
    try {
      const { numero_conta, valor } = req.body;
      const accountUser = account.findByPk(numero_conta);

      if (accountUser.saldo < Number(valor)) {
        return res.status(400).json({ mensagem: "Saldo insuficiente." });
      }

      accountUser.saldo -= Number(valor);

      const registry = {
        data: registrationDateFormat(new Date()),
        numero_conta,
        valor: Number(valor),
      };

      const cubosBank = bank.findAllInfos();
      cubosBank.saques.push(registry);

      return res.json({ mensagem: "Saque realizado com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  transfer: (req, res) => {
    try {
      const { numero_conta_origem, numero_conta_destino, valor } = req.body;

      const contaOrigem = account
        .findAll()
        .find((conta) => conta.numero === numero_conta_origem);

      const contaDestino = account
        .findAll()
        .find((conta) => conta.numero === numero_conta_destino);

      if (Number(valor) > contaOrigem.saldo) {
        return res.status(400).json({
          mensagem: "Saldo insuficiente para efetuar a transferência.",
        });
      }

      contaOrigem.saldo -= Number(valor);
      contaDestino.saldo += Number(valor);

      const registry = {
        data: registrationDateFormat(new Date()),
        numero_conta_origem,
        numero_conta_destino,
        valor: Number(valor),
      };

      const cubosBank = bank.findAllInfos();
      cubosBank.transferencias.push(registry);

      return res
        .status(200)
        .json({ mensagem: "Transferência realizada com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  balance: (req, res) => {
    try {
      const { numero_conta, senha } = req.query;
      const conta = account
        .findAll()
        .find((conta) => conta.numero === numero_conta);

      return res.json({ saldo: conta.saldo });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  bankStatement: (req, res) => {
    try {
      const { numero_conta } = req.query;

      const registroDepositosConta = bank
        .findAllInfos()
        .depositos.filter((conta) => conta.numero_conta === numero_conta);

      const registroSaquesConta = bank
        .findAllInfos()
        .saques.filter((conta) => conta.numero_conta === numero_conta);

      const transferenciasEnviadas = bank
        .findAllInfos()
        .transferencias.filter(
          (conta) => conta.numero_conta_origem === numero_conta
        );

      const transferenciasRecebidas = bank
        .findAllInfos()
        .transferencias.filter(
          (conta) => conta.numero_conta_destino === numero_conta
        );

      return res.json({
        depositos: registroDepositosConta,
        saques: registroSaquesConta,
        transferenciasEnviadas,
        transferenciasRecebidas,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },
};

module.exports = bankControllers;
