const bank = require("../models/bank");
const account = require("../models/account");

const validate = {
  validateAccountFields: (req, res, next) => {
    try {
      const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

      if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res
          .status(404)
          .json({ mensagem: "Todos os campos são obrigatórios." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateDepositFields: (req, res, next) => {
    try {
      const { numero_conta, valor } = req.body;

      if (!numero_conta || !valor) {
        return res
          .status(404)
          .json({ mensagem: "Todos os campos são obrigatórios." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateWithdrawFields: (req, res, next) => {
    try {
      const { numero_conta, valor, senha } = req.body;

      if (!numero_conta || !valor || !senha) {
        return res
          .status(404)
          .json({ mensagem: "Todos os campos são obrigatórios." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateTransferFields: (req, res, next) => {
    try {
      const { numero_conta_origem, numero_conta_destino, valor, senha } =
        req.body;

      if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res
          .status(400)
          .json({ mensagem: "Todos os campos são obrigatórios" });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateCpf: (req, res, next) => {
    try {
      const { cpf } = req.body;
      const { numeroConta } = req.params;

      const resp = /^\d+$/.test(cpf);

      if (!resp) {
        return res
          .status(400)
          .json({ mensagem: "Cpf deve possuir somente caracteres numéricos." });
      }

      if (cpf.length !== 11) {
        return res.status(400).json({
          mensagem: "Cpf deve possuir obrigatoriamente 11 caracteres.",
        });
      }

      const existingAccount = account.findByPk(numeroConta);

      if (existingAccount) {
        if (existingAccount.usuario.cpf === cpf) return next();
      }

      const cpfJaCadastrado = account
        .findAll()
        .find((conta) => conta.usuario.cpf === cpf);

      if (cpfJaCadastrado) {
        return res.status(400).json({
          mensagem: "O Cpf informado já possui um cadastro anterior.",
        });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateBirthDate: (req, res, next) => {
    try {
      const { data_nascimento } = req.body;

      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      const [dia, mes, ano] = data_nascimento.split("/").map(Number);
      const dataDeHoje = new Date();
      const dataNascimento = new Date(ano, mes - 1, dia);

      if (
        !regex.test(data_nascimento) ||
        dataNascimento.getDate() !== dia ||
        dataNascimento.getMonth() + 1 !== mes ||
        dataNascimento.getFullYear() !== ano ||
        (dia > 31 && dia < 1) ||
        (mes > 12 && mes < 1) ||
        dataNascimento > dataDeHoje
      ) {
        return res
          .status(400)
          .json({ mensagem: "O formato da data deve ser DD/MM/AAAA" });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateEmail: (req, res, next) => {
    try {
      const { email } = req.body;
      const { numeroConta } = req.params;

      const indiceDoArroba = email.indexOf("@");

      if (
        indiceDoArroba === -1 ||
        !email.slice(-(email.length - indiceDoArroba)).includes(".")
      ) {
        return res.status(400).json({ mensagem: "Formato de email inválido." });
      }

      const existingAccount = account.findByPk(numeroConta);

      if (existingAccount) {
        if (existingAccount.usuario.email === email) return next();
      }

      const emailJaCadastrado = account
        .findAll()
        .find((conta) => conta.usuario.email === email);

      if (emailJaCadastrado) {
        return res
          .status(400)
          .json({ mensagem: "E-mail já se encontra cadastrado." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateBankPassword: (req, res, next) => {
    try {
      const { senha_banco } = req.query;
      const cubosBank = bank.findAllInfos();

      if (!senha_banco) {
        return res.status(400).json({ mensagem: "Senha é obrigatório." });
      }

      if (cubosBank.banco.senha !== senha_banco) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateUserPassword: (req, res, next) => {
    try {
      const contas = account.findAll();
      const { senha } = req.body;
      const possiveisPropriedades = ["numero_conta", "numero_conta_origem"];

      for (const nomenclatura of possiveisPropriedades) {
        if (req.body[nomenclatura]) {
          const contaExiste = contas.find(
            (conta) => conta.numero === req.body[nomenclatura]
          );

          if (!contaExiste) {
            return res
              .status(400)
              .json({ mensagem: "Login ou senha inválido." });
          }
          const senhaValidada = contaExiste.usuario.senha === String(senha);

          if (!senhaValidada) {
            return res
              .status(400)
              .json({ mensagem: "Login ou senha inválido." });
          }
        }
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validatePhoneNumber: (req, res, next) => {
    try {
      const { telefone } = req.body;

      if (telefone === undefined) {
        next();
      }
      const resp = /^\d+$/.test(telefone);

      if (!resp) {
        return res.status(400).json({
          mensagem: "O telefone deve possuir somente caracteres numéricos.",
        });
      }

      if (telefone.length !== 11) {
        return res.status(400).json({
          mensagem:
            "O número de telefone deve possuir obrigatoriamente 11 caracteres contando com o DDD.",
        });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateUserInfosFieldsUpdate: (req, res, next) => {
    try {
      const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

      if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(404).json({
          mensagem:
            "É necessário o preenchimento de ao menos um campo para atualizar as informações.",
        });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },

  validateName: (req, res, next) => {
    try {
      const { nome } = req.body;

      if (nome === undefined) {
        next();
      }

      const regexNome = /^[A-Za-zÀ-ÿ']+([\s][A-Za-zÀ-ÿ']+)/;

      if (!regexNome.test(nome)) {
        return res.status(400).json({
          mensagem:
            "Nome inválido. Certifique-se de que contém apenas letras e espaços após o primeiro nome.",
        });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ mensagem: "Ocorreu um erro interno no servidor." });
    }
  },
};

module.exports = validate;
